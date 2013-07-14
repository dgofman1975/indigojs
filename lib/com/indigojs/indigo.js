/**
 *
 * Copyright © 2013 Softigent Inc. All rights reserved.
 *
 *   Permission is granted to copy, and distribute verbatim copies
 *   of this license document, but changing it is not allowed.
 *
 *   Author: David Gofman
 */

'use strict';

var com = {};
com.indigojs = {},

window.undef = function(value) {
    return value === undefined;
}

window.register = function(pkg_class, constractor) {
    var s = pkg_class.split('::');
    var pkgs = s[0].split('.');
    var p = window;
    for(var i = 0; i < pkgs.length; i++)
        p = p[pkgs[i]] || (p[pkgs[i]] = {});
    if (s.length > 1) {
        constractor.className = s[1];
        p[s[1]] = constractor;
        if (undef(window[s[1]])) //create alias
            window[s[1]] = constractor;
    }
    constractor.package = s[0];
    return constractor;
};

var Indigo = com.indigojs.Indigo = {
    inner: {
        instances: {},

        genUUID: function(pattern) {
            pattern = pattern || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
            var d = new Date().getTime();
            var uuid = pattern.replace(/x/g, function() {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return r.toString(16);
            });
            return uuid;
        },
        property: function(inst, name, defaultValue, isGet, isSet, visible) {
            var val = defaultValue;
            var o = {configurable: true, enumerable: visible != false};
            if (isGet != false)
                o.get = function () {
                    Indigo.propHook(false, this, name, val);
                    return val;
                };
            if (isSet != false)
                o.set = function (value) {
                    Indigo.propHook(true, this, name, val, value);
                    val = value;
                };

            //Add an accessor property to the object.
            Object.defineProperty(inst, name, o);
        },
    },
    uids: function() {
        return Object.keys(this.inner.instances);
    },
    callHook: function(inst, fName, args) {
        /* debugging function calls */
    },
    propHook: function(isSet, inst, propName, value, newValue) {
        /* debugging getter/setter calls */
    }
};

Function.prototype.define = function(apis) {
    apis = apis || {};
    var args, publiAPIs = apis['public'] || {},
        protectedAPIs = apis['protected'] || {},
        staticAPIs = apis['static'] || {},
        classAPIs = {}, classType = this;

    for (var name in staticAPIs)
        classType[name] = staticAPIs[name];

    var execute = function(name, apis) {
        var func = apis[name];

        return function() {
            var _ = Indigo.inner.instances[this.uid];
            var args = [].slice.call(arguments);
            Indigo.callHook(this, name, args);
            args.splice(0, 0, _);
            _.__fn__ = name;
            return func.apply(this, args);
        };
    };

    var access = function(apis, classApis, visible) {
        for(var name in apis)
            classApis[name] = { value: execute(name, apis), enumerable: visible };
        return classApis;
    };

    access(publiAPIs, classAPIs, true);
    access(protectedAPIs, classAPIs, false);

    var type = arguments.length > 1 ? arguments[1] : this;
    this.prototype = Object.create(type.prototype, classAPIs);
    this.prototype.constructor = this;
    classAPIs = publiAPIs = protectedAPIs = null; //clear memory

    this.prototype.super = function() {
        var _, inner = Indigo.inner,
            instances = inner.instances;
        if (undef(this.uid)) {
            var uid = inner.genUUID();
            var _ = instances[uid] = Object.create(this);
            // reserved keywords
            // me, parent, super, callLater, public, protected,
            // final, __me__, __fn__, __ci__)
            _.me = this;
            _.super = function() {
                var f, parent = this.parent;
                parent = parent || this.me.constructor.parent;
                if (parent && (f = parent.prototype[_.__fn__])) {
                    this.parent = parent.parent;
                    f.apply(this, arguments);
                }
                this.parent = null; //delete temp variable
                return this;
            };
            _.protected = function(_) {
                for(var name in _) {
                    if (!undef(this[name]))
                        throw new SyntaxError('The protected propery name: "' + name + '" already defined');
                    this[name] = _[name];
                }
                return this;
            };
            _.public = function(_) {
                for(var name in _)
                    this.me[name] = _[name];
                return this;
            };
            _.final = function(_) {
                for (var name in _)
                     inner.property(this.me, name, this[name] = _[name], true, false);
                return this;
            };
            _.callLater = function() {
                if (undef(_.__me__)) {
                    for (var i = 0; i < arguments.length; i++)
                    _[arguments[i]].call(this);
                }
            }
            Object.defineProperty(this, 'uid', {
                get: function () {
                    return uid;
                }
            });

            _.__me__ = this;
            _.parent = this.constructor.parent;
            if(_.parent) _.parent.apply(this, arguments);
            delete _.__me__;
        } else {
            _ = instances[this.uid];
            var names = Object.getOwnPropertyNames(_.parent.prototype)
            for(var i = 0; i < names.length; i++){
                var name = names[i];
                if (undef(_[name])) { //do not override parent APIs
                    Object.defineProperty(_, name,
                        Object.getOwnPropertyDescriptor(_.parent.prototype, name));
                }
            }

            _.parent = _.parent.parent;
            if(_.parent) _.parent.apply(this, arguments);
        }

        _.parent = null; //delete temp variable

        return _;
    };

    return this;
};

Function.prototype.extends = function(superClass, apis) {
    try {
        this.parent = eval(superClass);
        if (this.parent) {
            this.define(apis, this.parent);
            return;
        }
    }catch(e){}
    this.__ci__ = [superClass, apis];
    return this;
};

// See Loader.js
Function.prototype.import =
Function.prototype.implements = function() {
    return this;
};