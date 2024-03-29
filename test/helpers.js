"use strict";

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var fate = require('../build/fate');
var mixin = fate.Util.mixin;

/**
 * Creates a mock console, primarily for intercepting the results of the
 * Fate command-line tool
 */
function createConsole() {
  var buffer = [];
  var str;

  return {
    log: append,
    info: append,
    warn: append,
    error: append,
    result: result,
    contains: contains
  };

  function append(value) {
    buffer.push(value);
    str = null;
  }

  function result() {
    if ( !str ) {
      str = buffer.join('\n');
    }
    return str;
  }

  function contains(str) {
    return result().indexOf(str) !== -1;
  }
}

function evaluateEmit(script, data) {
  var result = [];
  fate.evaluate(script, mixin({ emit: emit }, data));
  return result;

  function emit(value) {
    result.push(value);
  }
}

function evaluateAsync(script, callback) {
  var result = [];
  return fate.evaluate(script, { emit: emit });

  function emit(value) {
    result.push(value);
    callback(result);
  }
}

function monkeyPatchRequires(root, remappedPaths) {
  var files = glob.sync('**/*.fate.js', { cwd: root });
  files.forEach(function (file) {
    // Rewrite the file to point to the local Fate instance
    var filePath = path.join(root, file);
    var content = fs.readFileSync(filePath).toString();
    Object.keys(remappedPaths).forEach(function (originalPackage) {
      content = content.replace(
        "require('" + originalPackage + "')",
        "require('" + remappedPaths[originalPackage] + "')"
      );
    });
    fs.writeFileSync(filePath, content);
  });
}

// Exported Functions
exports.createConsole = createConsole;
exports.evaluateEmit = evaluateEmit;
exports.evaluateAsync = evaluateAsync;
exports.monkeyPatchRequires = monkeyPatchRequires;
