/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

'use strict';

register('com.indigojs.core::Assert', function() {
})
.define({
    static: {
        assertEquals: function(actual, expected, message) {
            var error = (actual != expected);
            if (arguments.length == 4) //error
                 error = arguments[3];
             var str1 = (error ? message || 'failed' : 'okay');
             var str2 = ' - Expected: ' + expected + (error ? ', Result: ' + actual : '');
             Assert.console(str1 + str2, error ? 'error' : 'info');
        },
        assertNotEqual: function(actual, expected, message) {
            Assert.assertEquals(actual, expected, message, actual == expected);
        },
        assertTrue: function(actual, message) {
            Assert.assertEquals(actual, true, message);
        },
        assertFalse: function(actual, message) {
            Assert.assertEquals(actual, false, message);
        },
        console: function(msg, state) {
            window.console && console[state || 'log'](msg);
        }
    }
});