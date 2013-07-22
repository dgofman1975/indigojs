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
    }
});