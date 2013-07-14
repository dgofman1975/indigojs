/**
 *
 * Copyright © 2013 Softigent Inc.. All rights reserved.
 *
 *   Permission is granted to copy, and distribute verbatim copies
 *   of this license document, but changing it is not allowed.
 *
 *   Author: David Gofman
 */

register('impl.dojo::IWidget', function() {
})
.define({
    static: {
        create: function(html, shim, ref) {
            var o = dojo.query(dojo.create("div", { innerHTML:html }).firstChild);
            return shim != false ? IWidget.shim(o, ref) : o;
        },
        find: function(selector, parent, shim, ref) {
            var o =  (parent || dojo).query(selector);
            return shim != false ? IWidget.shim(o, ref) : o;
        },
        shim: function(o, _) {
            var apis = {
                $: o, //keep reference to jquery object
                find: function(selector, parent) {
                    return IWidget.find(selector, o);
                },
                offset: function() {
                    var r = o.position()[0];
                    return { top:r.y, left:r.x };
                },
                x: function(value) {
                    return undef(value) ? o.coords()[0].l : !o.style('left', value) || _;
                },
                y: function(value) {
                    return undef(value) ? o.coords()[0].t : !o.style('top', value) || _;
                },
                width: function(value) {
                    return undef(value) ? o.style('width')[0] : !o.style('width', value) || _;
                },
                height: function(value) {
                    return undef(value) ? o.style('height')[0] : !o.style('height', value) || _;
                },
                css: function(value) {
                    return typeof(value) == 'string' ?
                        dojo.getComputedStyle(o[0]).getPropertyValue(value) : !o.style(value) || _;
                },
                bind: function(type, listener) { //cannot use dojo connect such as not supporting disconnect by type or listener
                    if (o[0].attachEvent) {
                        o[0].attachEvent('on' + type, listener);
                    } else {
                        o[0].addEventListener(type, listener);
                    }
                    return _;
                },
                unbind: function(type, listener) {
                    if (o[0].detachEvent) {
                        o[0].detachEvent('on' + type, listener);
                    } else {
                        o[0].removeEventListener(type, listener);
                    }
                    return _;
                },
                append: function(elem) {
                    dojo.place(elem.$[0], o[0], 'last');
                    return _;
                },
                remove: function() {
                    o.forEach(dojo.destroy);
                    return _;
                }
            }
            if (undef(_)) _ = apis;
            return apis;
        }
    }
});