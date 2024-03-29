"use strict";

var nodeunit = require('nodeunit');
var fate = require('../build/fate');
var types = fate.Types;

exports.api = nodeunit.testCase({

  "True / False": function (test) {
    test.equal(types.isTrue(null), false);
    test.equal(types.isTrue(), false);
    test.equal(types.isTrue([]), false);
    test.equal(types.isTrue({}), false);
    test.equal(types.isTrue({ name: 'fate' }), true);
    test.equal(types.isTrue("hello"), true);
    test.equal(types.isTrue([1]), true);
    test.equal(types.isFalse(null), true);
    test.equal(types.isFalse(), true);
    test.equal(types.isFalse([]), true);
    test.equal(types.isFalse({}), true);
    test.equal(types.isFalse({ name: 'fate' }), false);
    test.equal(types.isFalse("hello"), false);
    test.equal(types.isFalse([1]), false);
    test.done();
  }

});
