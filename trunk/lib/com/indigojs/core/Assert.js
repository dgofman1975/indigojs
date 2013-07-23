/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

'use strict';

register('com.indigojs.core::Assert', function() {
})
.$define({
    static: {
        errors: 0,
        funcCover: {},

        assertEquals: function(actual, expected, message) {
            var error = (actual != expected);
            if (arguments.length == 4) //error
                 error = arguments[3];
             var str1 = (error ? message || 'failed' : 'okay');
             var str2 = ' - Expected: ' + expected + (error ? ', Result: ' + actual : '');
             this.console(str1 + str2, error && this.errors++ ? 'error' : 'info');
        },
        assertTrue: function(actual, message) {
            this.assertEquals(actual, true, message);
        },
        assertFalse: function(actual, message) {
            this.assertEquals(actual, false, message);
        },
        result: function() {
            this.console('Assert::result ' + this.errors + ' assert failed', this.errors ? 'error' : 'info')
        },
        console: function(msg, state) {
            window.console && console[state || 'log'](msg);
        },
        codeCoverageStart: function() {
            Assert.funcCover = {};
            this.oldCallHook = Indigo.callHook;
            Indigo.callHook = function(inst, fName, args, count) {
                var cname = inst.constructor.package + '.' + inst.constructor.className;
                if (undef(Assert.funcCover[cname]))
                    Assert.funcCover[cname] = {};
                if (undef(Assert.funcCover[cname][fName]))
                    Assert.funcCover[cname][fName] = 0;
                Assert.funcCover[cname][fName]++;
            };
        },
        codeCoverageEnd: function(full) {
            Indigo.callHook = this.oldCallHook;

            var output = [];
            output.push('Coverage Functions:');
            for (var cname in Assert.funcCover) {
                var total = 0, covered = 0, fn = [],
                    apis = Assert.funcCover[cname];
                for (var name in apis) {
                    total++;
                    fn.push('    ' + name + ': ' + apis[name]);
                    if (apis[name] != 0) covered++;
                }
                if (fn.length > 0) {
                    output.push(cname + ': ' + Math.floor(covered / total * 100) + '%');
                    if (full) output = output.concat(fn);
                }
            }
            this.console(output.join('\n'), 'info');
        }
    }
});