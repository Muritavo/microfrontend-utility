var ConcatSource = require("webpack-core/lib/ConcatSource");
var fs = require("fs");
/**
 * As a developer I want to
 */

/**
 * @typedef {{
 *  name: string, //Microfrontend name
 *  chunkOrigin: string, //Defines where to find the microfrontend
 *  externals: {
 *    [key: string]: string //Mapping for the externalized name and the cdn for the library definition
 *  }
 * }} MicrofrontendDefinition
 */
module.exports = class MicrofrontendWebpackPlugin {
  microfrontendsMapping = {};
  externalsMapping = {};

  /**
   *
   * @param {MicrofrontendDefinition[]} requiredMicrofrontendDefinitions
   */
  constructor(requiredMicrofrontendDefinitions) {
    requiredMicrofrontendDefinitions.forEach(def => {
      if (!def.name) {
        throw new Error(
          "It's required to provide a name for the required microfrontend"
        );
      }
      if (!def.chunkOrigin) {
        throw new Error(
          "It's required to provide a origin for the microfrontend entry point"
        );
      }
      if (!def.externals) {
        console.warn(
          "You did not provided externalized dependencies. Some libraries can take up a lot of space of the final bundle and should be externalized to prevent duplication accross multiple frontends"
        );
      }
      this.microfrontendsMapping = {
        ...this.microfrontendsMapping,
        [def.name]: def.chunkOrigin
      };
      this.externalsMapping = {
        ...this.externalsMapping,
        ...(def.externals || {})
      };
    });
  }

  /**
   * This function binds the necessary functions to the compiler lifecycle
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.options.output.futureEmitAssets = false;
    //This function overrides the externals property to externalize dependencies external to all microfrontends
    Object.keys(this.microfrontendsMapping).forEach(mfeName => {
      if (!compiler.options.externals)
        compiler.options.externals = {};
      compiler.options.externals[mfeName] = mfeName;
    })
    
    /**
     * This function overrides the entry point of the microfrontend to inject the
     * function that setups necessary externals and import maps
     */
    compiler.hooks.compilation.tap(
      "microfrontend-webpack-plugin",
      injectBootstrapOnChunk(this.externalsMapping, this.microfrontendsMapping)
    );
  }
}

function injectBootstrapOnChunk(externals, microfrontends) {
  /**
   *
   * @param {import('webpack').compilation.Compilation} compilation
   */
  function A(compilation) {
    const injector = fs
      .readFileSync(require.resolve("./bootstrapper.js"))
      .toString()
      .replace(
        "/** externals-insertion-point */",
        `externals = ${JSON.stringify(externals)}`
      ).replace(
        "/** microfrontends-insertion-point */",
        `microfrontends = ${JSON.stringify(microfrontends)}`
      );
    compilation.hooks.optimizeChunkAssets.tapAsync(
      "microfrontend-webpack-plugin",
      (chunks, callback) => {
        chunks.forEach(chunk => {
          if (!(chunk.isOnlyInitial ? chunk.isOnlyInitial() : (chunk.isInitial ? chunk.isInitial() : chunk.initial))) return;
          chunk.files.forEach(function(file, i) {
            if (file.indexOf(`.js`) == -1) return;
            compilation.assets[file] = new ConcatSource(
              "/* Microfrontend references bootstrapper */\n",
              injector,
              compilation.assets[file]
            );
          });
          callback();
        });
      }
    );
  };
  return A;
}
