/**
 *
 * Copyright © 2013 Softigent Inc.. All rights reserved.
 *
 *   Permission is granted to copy, and distribute verbatim copies
 *   of this license document, but changing it is not allowed.
 *
 *   Author: David Gofman
 */

var LOGALL    = 0,
    LOGLEVEL1 = 1,
    LOGLEVEL2 = 2,
    LOGLEVEL3 = 3,
    LOGLEVEL4 = 4,
    LOGLEVEL5 = 5;

var LOGLEVEL = LOGLEVEL1;

register('com.indigojs.core::Utils', function() {
})
.define({
    static: {
        template: function(template, params) {
            for(var key in params)
                template = template.split('<%=' + key + '%>').join(params[key]);
            return template;
        },
        substitute: function(str) {
            for (var i = 1; i < arguments.length; i++)
                str = str.split('{' + (i - 1) + '}').join(arguments[i]);
            return str;
        },
        log: function(level) {
            var args = [].slice.call(arguments);
            args.splice(0, 1);
            if (LOGLEVEL == LOGALL || level <= LOGLEVEL)
                console.log.apply(console, args);
        }
    }
})

