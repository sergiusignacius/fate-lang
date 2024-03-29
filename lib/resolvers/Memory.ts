/// <reference path="../Types.ts"/>
/// <reference path="../Fate.ts"/>

"use strict";

namespace Fate.Resolvers {
  import isFateModule = Types.isFateModule;
  import createModule = Types.createModule;

  type AnyMap = { [index: string]: any };

  /**
   * Creates a new MemoryResolver.  As its name implies, this resolver
   * allows one to register a module to be stored in memory.  A default
   * instance of this resolver is used to store the System Modules.
   * Because of its flexibility, it can also be used to store custom
   * modules and native JavaScript helpers.
   */
  export function createMemoryResolver() {
    var cache: { [index: string]: Types.Module } = {};

    return {
      resolve: resolve,
      unregister: unregister,
      register: register
    };

    function resolve(name: Types.ModuleName) {
      var result = cache[name];
      if ( !result ) {
        return undefined;
      }
      return result;
    }

    /**
     * Removes a module from the resolver cache.
     *
     * @param {String} name the name of the module to remove
     */
    function unregister(name: Types.ModuleName) {
      delete cache[name];
    }

    /**
     * Registers a module in the module cache.
     *
     * @param {String} name the name of the module to be registered
     * @param {Function|String|Object} module the module to register
     */
    function register(name: Types.ModuleName,
                      module: Types.Module|string|AnyMap) {
      // A compiled Fate Module function
      if ( isFateModule(module) ) {
        cache[name] = <Types.Module>module;
        return;
      }

      // *String* - An unparsed Fate script
      if ( typeof module === 'string' ) {
        var compiled = Fate.compile(module);
        var generatedModule = createModule();
        compiled(Fate.globals(), generatedModule.exports);
        cache[name] = generatedModule;
        return;
      }

      // *Object* - A hash of Helpers (name->Function)
      if ( Types.isObject(module) ) {
        cache[name] = createModule(<Types.ModuleExports>module);
        return;
      }

      throw new Error("Module not provided");
    }
  }
}
