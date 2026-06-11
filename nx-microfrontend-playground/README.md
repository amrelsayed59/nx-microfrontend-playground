# Nx Micro Frontend Workspace

This is the Nx workspace for the **cross-framework Micro Frontend playground**:
an Angular host loading React (`products`) and Vue (`orders`) remotes at runtime
via Module Federation.

**Full documentation — architecture, runtime flow, dev workflow, build
instructions, and lessons learned — lives in the repository root
[README.md](../README.md).**

## Quick reference

```bash
# Development (one terminal per deployable unit)
npx nx serve products                                  # React remote  → :4201
npx nx serve orders                                    # Vue remote    → :4202
npx nx run host:serve --devRemotes=products,orders     # Angular host  → :4200

# Production builds
npx nx build products
npx nx build orders
npx nx build host

# Workspace insight
npx nx show projects
npx nx graph
```

## Projects

| Project         | Role                            | Stack            |
| --------------- | ------------------------------- | ---------------- |
| `host`          | Shell: routing, nav, tokens     | Angular, Webpack |
| `products`      | Products feature remote         | React, Rspack    |
| `orders`        | Orders feature remote           | Vue 3, Rspack    |
| `shared-models` | Cross-MFE TypeScript contracts  | `@org/shared-models` |
