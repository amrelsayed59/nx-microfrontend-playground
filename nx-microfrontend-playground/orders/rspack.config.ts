import { NxAppRspackPlugin } from '@nx/rspack/app-plugin.js';
import {
  NxModuleFederationPlugin,
  NxModuleFederationDevServerPlugin,
} from '@nx/module-federation/rspack.js';
import type { Compiler } from '@rspack/core';
import { DefinePlugin, SwcJsMinimizerRspackPlugin } from '@rspack/core';
import { VueLoaderPlugin } from 'vue-loader';
import { join } from 'path';

import config from './module-federation.config';

/**
 * NxAppRspackPlugin hardcodes `module: false` in its SWC minimizer options
 * (it assumes script-format MF containers). This app emits ESM containers
 * (output.module/library type 'module'), so production chunks contain
 * import/export/import.meta — the minifier must parse them as ES modules.
 * Must be registered AFTER NxAppRspackPlugin so this minimizer wins.
 */
const esmMinimizerPlugin = {
  apply(compiler: Compiler): void {
    if (process.env['NODE_ENV'] !== 'production') {
      return;
    }
    compiler.options.optimization.minimizer = [
      new SwcJsMinimizerRspackPlugin({
        extractComments: false,
        minimizerOptions: {
          module: true,
          mangle: {
            keep_classnames: true,
          },
          format: {
            ecma: 2020,
            ascii_only: true,
            comments: false,
          },
        },
      }),
    ];
  },
};

export default {
  output: {
    path: join(__dirname, '../dist/orders'),
    publicPath: 'auto',
    module: true,
    chunkFormat: 'module',
    chunkLoading: 'import',
    // Inject the standalone index.html entry as <script type="module">.
    // ESM output uses import.meta, which classic scripts cannot execute.
    // Only affects standalone mode; the federated host imports remoteEntry.mjs
    // directly and never loads this index.html.
    scriptType: 'module',
  },
  experiments: {
    outputModule: true,
  },
  devServer: {
    port: 4202,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // Emits SFC blocks as inline match resources (e.g. *.vue.ts) so
          // Rspack's TS/SCSS rules process them. Required for vue-loader on Rspack.
          experimentalInlineMatchResource: true,
        },
      },
    ],
  },
  plugins: [
    new NxAppRspackPlugin({
      tsConfig: './tsconfig.app.json',
      main: './src/main.ts',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico'],
      styles: ['./src/styles.scss'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    esmMinimizerPlugin,
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    }),
    new NxModuleFederationPlugin(
      { config },
      {
        dts: false,
        // Same ESM container settings as the products remote — the Webpack
        // host imports remotes as ES modules.
        library: { type: 'module' },
        filename: 'remoteEntry.mjs',
      }
    ),
    new NxModuleFederationDevServerPlugin({ config }),
  ],
};
