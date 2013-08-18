/**
 *
 * Copyright © 2013 Softigent Inc.
 *
 * Author: David Gofman
 */

'use strict';

var com = {};
com.indigojs = {},

window.undef = function(value) {
    return value === undefined;
}

window.register = function(pkg_class, definition) {
    var pkgs = pkg_class.split('.');
    var className = pkgs.pop();
    var i, name, p = window;
    for(var i = 0; i < pkgs.length; i++)
        p = p[pkgs[i]] || (p[pkgs[i]] = {});

    var constructor = function() {
        Indigo.init(constructor, this, arguments);
    };
    constructor.namespace = definition.namespace;
    constructor.className = className;
    constructor.package = pkgs.join('.');

    p[className] = constructor;
    if (undef(window[className])) //create alias
        window[className] = constructor;

    for (var name in definition.static)
        constructor[name] = definition.static[name];
};

var Indigo = com.indigojs.Indigo = {
    init: function(constructor, _ /*thisObj*/, args) {
        if (constructor.namespace)
            constructor.prototype = constructor.namespace.call(constructor, _);
        Indigo.extend.call(constructor, _, constructor.prototype, args)
        Indigo.define.call(constructor, _, constructor.prototype, args);
    },
    extend: function(_, proto, args) {
        if (proto.extend) {
            try {
                this.parent = eval(proto.extend);
                if (this.parent)
                    Indigo.init(this.parent, _, args)
            }catch(e){}
        }
    },
    define: function(_, proto, args) {
        var execute = function(name, apis) {
            var func = apis[name];
            return function() {
                _.supra = Indigo.supra('inherit', name);
                return func.apply(this, arguments)
            };
        };
        for(var name in proto.inherit)
            _[name] = execute(name, proto.inherit);

        if (proto.init instanceof Function) {
            _.supra = Indigo.supra('init');
            proto.init.apply(this, args);
        }
    },
    supra: function(prop, name) {
        var o, parent = {};
        return function() {
            parent = parent.parent || this.constructor.parent;
            if ((o = parent) &&
                (o = o.prototype[prop])) {
                    if (name) o = o[name];
                    if (o instanceof Function)
                        return o.apply(parent, arguments);
            }
            parent = {};
        };
    }
};