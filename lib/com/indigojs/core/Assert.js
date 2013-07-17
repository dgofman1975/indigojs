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
            var str1 = (error ? (message != undefined ? message : 'failed') : 'okay');
            var str2 = ' - Expected: ' + expected + (error ? ', Result: ' + actual : '');
            Assert.console(str1 + str2, error ? 'error' : 'info');
        },
        assertTrue: function(actual, message) {
            this.assertEquals(actual, true, message);
        },
        console: function(msg, state) {
            window.console[state || 'log'](msg);
        }
    }
});