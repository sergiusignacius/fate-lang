/// <reference path="./Types.ts"/>
/// <reference path="./Util.ts"/>
/// <reference path="./runtime/Function.ts"/>
/// <reference path="./runtime/Format.ts"/>
/// <reference path="./runtime/Join.ts"/>
/// <reference path="./runtime/Loop.ts"/>
/// <reference path="./runtime/Match.ts"/>
/// <reference path="./runtime/Import.ts"/>

"use strict";

namespace Fate.Runtime {
  export import isObject = Types.isObject;
  export var isTruthy = Types.isTruthy;
  export var isFalsy = Types.isFalsy;
  export var isIn = Types.isIn;
  export var isArray = Array.isArray;
}
