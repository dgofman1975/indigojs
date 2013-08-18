/**
 *
 * Copyright © 2013 Softigent Inc.
 *
 * Author: David Gofman
 */

'use strict';

register('com.indigojs.core.Object', {
    static: {
        genUUID: function(pattern) {
            pattern = pattern || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
            var d = new Date().getTime();
            var uuid = pattern.replace(/x/g, function() {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return r.toString(16);
            });
            return uuid;
        }
    },
    namespace: function(_) {
        return {
            init: function(name) {
                var uid = this.genUUID();
                name = (name || _.constructor.className);
                _.toString = function() {
                    return name + '_' + uid;
                }
                _.getName = function() {
                    return name;
                }
            },
            inherit: {
                destroy: function() {
                    return _;
                }
            }
        };
    }
});