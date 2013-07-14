/**
 *
 * Copyright © 2013 Softigent Inc. All rights reserved.
 *
 *   Permission is granted to copy, and distribute verbatim copies
 *   of this license document, but changing it is not allowed.
 *
 *   Author: David Gofman
 */

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