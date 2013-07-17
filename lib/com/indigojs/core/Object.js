/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

'use strict';

register('com.indigojs.core::Object', function(name) {
    name = (name || this.constructor.className);
    this.toString = function() {
        return name + '_' + this.uid;
    }
    this.getName = function() {
        return name;
    }
})
.define({
    public: {
        destroy: function(_) {
            delete Indigo.inner.instances[this.uid];
            return _.me;
        }
    }
});