# Nx Micro Frontend Playground

A production-style **cross-framework Micro Frontend platform**: an Angular host that loads React and Vue remotes at runtime through **Module Federation**, built in an **Nx monorepo** with shared contracts, a shared design system, and enforced architectural boundaries.

Built as a senior frontend portfolio project — the goal is not just a working demo, but documented architectural decisions and the real-world integration problems that had to be solved along the way (see [Production Build Issue](#production-build-issue-and-resolution) and [Lessons Learned](#lessons-learned)).

---

## Architecture

```text
                       ┌──────────────────────────────────────────────┐
                       │              Angular Host (4200)             │
                       │              Webpack · port 4200             │
                       │                                              │
                       │  Owns: shell, routing, navigation, branding, │
                       │  design tokens (:root CSS custom properties) │
                       │                                              │
                       │   ┌─────────────┐        ┌─────────────┐     │
                       │   │ /products   │        │ /orders     │     │
                       │   │ wrapper cmp │        │ wrapper cmp │     │
                       │   └──────┬──────┘        └──────┬──────┘     │
                       └──────────┼──────────────────────┼────────────┘
                  import('products/Module')   import('orders/Module')
                                  │ runtime ESM            │ runtime ESM
                                  ▼                        ▼
                   ┌──────────────────────┐   ┌──────────────────────┐
                   │  Products Remote     │   │  Orders Remote       │
                   │  React 22 · Rspack   │   │  Vue 3 · Rspack      │
                   │  port 4201           │   │  port 4202           │
                   │                      │   │                      │
                   │  exposes mount()     │   │  exposes mount()     │
                   │  remoteEntry.mjs     │   │  remoteEntry.mjs     │
                   └──────────┬───────────┘   └──────────┬───────────┘
                              │                          │
                              └──────────┬───────────────┘
                                         ▼
                          ┌──────────────────────────────┐
                          │  libs/shared/models          │
                          │  Product · Order (TS types)  │
                          │  compile-time contract only  │
                          └──────────────────────────────┘
```

Key properties:

- **Each remote is a vertical slice** — it owns its feature UI, state, and (future) data access, runs standalone on its own port, and is independently buildable and deployable.
- **The host is thin** — shell, routing, and cross-cutting concerns only. This is enforced by Nx module boundaries (the `scope:host` tag may only depend on `scope:shared`).
- **The framework is an implementation detail of the remote.** The host consumes a framework-agnostic `mount(element)` contract and cannot tell React from Vue.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Monorepo | Nx 22.7.5 |
| Host | Angular 21, Webpack (`@nx/angular:webpack-browser`), `@nx/module-federation` |
| Products remote | React 22, Rspack, `NxModuleFederationPlugin` |
| Orders remote | Vue 3 (Composition API, `<script setup>`), Rspack, vue-loader |
| Federation | Module Federation 2.x (`@module-federation/enhanced`), **static federation**, **ESM containers** (`remoteEntry.mjs`) |
| Contracts | TypeScript interfaces in `@org/shared-models` |
| Design system | CSS custom properties (design tokens) shared through the DOM cascade |
| Quality | ESLint with `@nx/enforce-module-boundaries`, strict TypeScript, Prettier |

## Workspace Structure

```text
nx-microfrontend-playground/
├── host/                          # Angular shell (scope:host)
│   ├── module-federation.config.ts   # declares remotes + their URLs
│   ├── webpack.config.ts              # withModuleFederation + ESM script type
│   └── src/app/
│       ├── app-header/                # brand, nav, notifications, avatar
│       ├── home/                      # host-owned landing page
│       ├── products-remote.component.ts  # React bridge (mount/unmount)
│       └── orders-remote.component.ts    # Vue bridge (mount/unmount)
├── products/                      # React remote (scope:products)
│   ├── module-federation.config.ts   # exposes ./Module
│   ├── rspack.config.ts               # ESM output + ESM-aware minifier
│   └── src/
│       ├── remote-entry.ts            # mount() contract implementation
│       └── app/
│           ├── pages/products-page/   # smart: search, loading, filtering
│           ├── components/            # product-table, search-input, empty-state
│           └── data/
├── orders/                        # Vue remote (scope:orders)
│   ├── module-federation.config.ts
│   ├── rspack.config.ts               # + vue-loader, same ESM settings
│   └── src/
│       ├── remote-entry.ts            # mount() via createApp/unmount
│       └── app/
│           ├── pages/orders-page/     # KPI cards, sortable table
│           ├── components/            # kpi-card, status-badge, orders-table…
│           ├── composables/use-orders.ts  # all page state
│           ├── services/orders.service.ts # data seam (mock → future API)
│           └── models/                # remote-internal view models
└── libs/
    └── shared/models/             # @org/shared-models (scope:shared)
        └── src/lib/                   # product.model.ts · order.model.ts
```

## Module Federation — How It Works Here

This project uses **static federation**: the host declares each remote's name and URL at build time, but downloads the remote's code **at runtime**.

```ts
// host/module-federation.config.ts
remotes: [
  ['products', 'http://localhost:4201/remoteEntry.mjs'],
  ['orders', 'http://localhost:4202/remoteEntry.mjs'],
],
```

`remoteEntry.mjs` is the remote's **container manifest** — a small ES module exporting two functions:

- `init(shareScope)` — negotiates shared dependencies (singletons) with the host
- `get(exposedName)` — returns a factory for an exposed module (here: `./Module`)

The actual feature code arrives in separate chunks only when requested. Deploying a new remote version requires **no host rebuild** — the host fetches whatever lives at the URL.

A deliberate, hard-won decision: **all containers are ES modules.** The Angular/Webpack host emits ESM (`import.meta`-based) bundles and loads remotes via dynamic `import()`, so both Rspack remotes are configured to emit ESM containers too (`output.module`, `experiments.outputModule`, `library: { type: 'module' }`, `filename: 'remoteEntry.mjs'`). Host and remote must agree on three things — entry filename, container format, and share scope — and mismatches in the first two produced the most instructive bugs of this project (see Lessons Learned).

## How Angular Loads the React and Vue Remotes

Every remote exposes the same framework-agnostic contract:

```ts
// products/src/remote-entry.ts (React)        // orders/src/remote-entry.ts (Vue)
export function mount(element: HTMLElement): () => void;
```

Internally, React calls `createRoot(element).render(...)` and Vue calls `createApp(App).mount(element)` — but the host never sees that. The Angular side is a small wrapper component per remote:

```ts
async ngAfterViewInit(): Promise<void> {
  const { mount } = await import('products/Module'); // triggers the federation handshake
  this.unmount = mount(this.hostEl.nativeElement);   // remote renders into Angular-owned DOM
}

ngOnDestroy(): void {
  this.unmount?.(); // prevents leaked React roots / Vue apps on navigation
}
```

Runtime sequence when a user clicks "Products":

1. Angular lazily loads the wrapper component (local chunk).
2. `import('products/Module')` fires → the federation runtime fetches `remoteEntry.mjs` from port 4201.
3. Host calls the container's `init(shareScope)`, then `get('./Module')` → feature chunks stream in.
4. The wrapper calls `mount(div)` → React renders inside the Angular shell.

The Vue remote follows the identical sequence — the only framework-specific code lives inside the remote.

**Design system across frameworks:** tokens (spacing, color, typography, radii, shadows) are CSS custom properties on `:root`. Because host and remotes share one DOM document, the variables cascade into React and Vue content with zero shared component code. Each remote also carries a copy of the token sheet for standalone development.

**TypeScript:** federated modules are virtual — `host/src/remotes.d.ts` declares the `mount` signature for `products/Module` and `orders/Module`. tsconfig path aliases are reserved for workspace libraries (`@org/shared-models`); pointing one at a federated module breaks the runtime handshake (learned the hard way — see Lessons Learned).

## Local Development

```bash
npm install
```

Run each deployable unit in its own terminal (mirroring how independent teams work):

```bash
# Terminal 1 — React remote (port 4201)
npx nx serve products

# Terminal 2 — Vue remote (port 4202)
npx nx serve orders

# Terminal 3 — Angular host (port 4200), after the remotes are up
npx nx run host:serve --devRemotes=products,orders
```

Then open `http://localhost:4200`. The remotes are also fully usable standalone at `http://localhost:4201` and `http://localhost:4202`.

Useful commands:

```bash
npx nx show projects     # list all projects
npx nx graph             # visualize the dependency graph
npx nx run-many -t lint  # lint everything
```

## Production Builds

```bash
npx nx build products    # → dist/products (minified ESM remoteEntry.mjs + chunks)
npx nx build orders      # → dist/orders
npx nx build host        # → dist/host
```

Each output directory is an independently deployable artifact — remotes go to their own static hosting/CDN; the host references them by URL.

## Production Build Issue and Resolution

The most interesting bug in the project: **everything worked in development, but `nx build` failed for both remotes** with:

```text
ERROR in remoteEntry.mjs
Chunk minification failed:
JavaScript parse error: 'import', and 'export' cannot be used outside of module code
JavaScript parse error: 'import.meta' cannot be used outside of module code
```

**Diagnosis.** The error named the phase — *minification*, not compilation — which narrowed the search to the minifier's configuration. Reading the installed `@nx/rspack` source (`plugins/utils/apply-base-config.js`) revealed that `NxAppRspackPlugin` hardcodes the SWC minimizer with `module: false`, with a code comment explaining the assumption: Module Federation containers are expected to be *script-format* (global-variable) containers. This project deliberately emits **ESM containers** instead — so in production the minifier parsed ES-module chunks as classic scripts, where `import`/`export`/`import.meta` are syntax errors. Development never failed because minification only runs in production.

**Fix.** A small custom plugin registered *after* `NxAppRspackPlugin` (which overwrites top-level `optimization` config, so ordering matters) replaces the minimizer with an ESM-aware one:

```ts
const esmMinimizerPlugin = {
  apply(compiler: Compiler): void {
    if (process.env['NODE_ENV'] !== 'production') return;
    compiler.options.optimization.minimizer = [
      new SwcJsMinimizerRspackPlugin({
        extractComments: false,
        minimizerOptions: {
          module: true, // parse chunks as ES modules
          mangle: { keep_classnames: true },
          format: { ecma: 2020, ascii_only: true, comments: false },
        },
      }),
    ];
  },
};
```

`module: true` is safe here precisely because the containers are ESM: Nx's "keep top-level variables global" concern only applies to script-format containers. After the fix, both remotes build successfully and `remoteEntry.mjs` is verified minified *and* still a valid ES module (`export{...as get,...as init}`).

## Known Limitations

- `npx nx run host:serve --devRemotes=products,orders` does **not** reliably auto-start the remote dev servers (Nx's MF dev-server spawns `rspack serve --no-verbose`, which the Rspack CLI in this workspace rejects). The three-terminal workflow above is the reliable path — start remotes first, then the host.
- Remote URLs are hardcoded `localhost` values (static federation). Production deployment requires environment-specific URLs — see Future Improvements.
- `.vue` files are not yet covered by ESLint (`eslint-plugin-vue`) or full template type-checking (`vue-tsc`); TypeScript inside SFCs is checked by the build.
- The design-token sheet is duplicated per app (host + 2 remotes) for standalone mode — three copies is the signal to extract a shared `ui-tokens` library.

## Lessons Learned

1. **Host and remote must agree on the container contract, not just the module name.** Three independent agreements: entry filename (`.js` vs `.mjs`), container format (script/global vs ESM), and shared-dependency versions. Each mismatch produces a different failure at a different lifecycle phase (404, white page, `fn is not a function`).
2. **tsconfig `paths` and federated modules don't mix.** A leftover path alias for `products/Module` let the bundler resolve the import from disk at build time, silently bypassing federation. Path aliases are for workspace libs; ambient `.d.ts` declarations are for federated modules.
3. **Inspect the artifact, not the config.** `curl remoteEntry.mjs | head` / `| tail` answers "what format is this container?" in seconds — `var products = ...` means script, `export { get, init }` means ESM. Hours of config-guessing were replaced by reading output.
4. **`node_modules` is documentation.** The production minifier bug was diagnosed by reading the installed Nx plugin source, where a code comment explained the (incompatible) assumption. Error messages name the phase; the phase narrows the search space.
5. **Expose behavior, not components.** Sharing `mount()` instead of a React component keeps the host framework-agnostic and makes adding the Vue remote a copy of an existing pattern instead of a new integration.
6. **Types are free to share; runtime is not.** `@org/shared-models` is erased at compile time — a contract with zero runtime cost. The same instinct applied to runtime code (shared singletons, shared UI) carries real coupling costs and version negotiation.
7. **Boundaries must be machine-enforced.** Nx tags + `@nx/enforce-module-boundaries` turn "the host stays thin" and "shared libs depend on nothing above them" from review comments into CI failures.
8. **"Works in dev" guarantees nothing about prod.** Minification, output hashing, and static remote builds are production-only code paths; each one failed at least once in this project while dev mode stayed green.

## Future Improvements

- **Dynamic federation** — replace hardcoded remote URLs with a runtime `module-federation.manifest.json`, enabling per-environment URLs, canary releases, and rollback by URL swap without rebuilding the host.
- **Shared libraries** — extract `libs/shared/ui-tokens` (design tokens, ending the three-copy duplication) and a `data-access` layer per domain; share runtime utilities through the federation share scope as versioned singletons.
- **Shared authentication** — host-owned auth (token acquisition, refresh, session) exposed to remotes through an injected context on `mount(element, context)`, keeping remotes auth-agnostic.
- **Cross-framework communication** — a typed event contract (in `shared-models`) over a host-owned event bus / `CustomEvent`s, so the Vue remote can request a host toast or the host can broadcast user changes — without any remote importing another's internals.
- **Independent deployment** — CI per project via `nx affected`, each remote published to its own static hosting with versioned URLs, host consuming them through the dynamic manifest; contract tests in CI to catch host/remote drift before deploy.
