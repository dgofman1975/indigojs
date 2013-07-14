/**
 *
 * Copyright © 2013 Softigent Inc.. All rights reserved.
 *
 *   Permission is granted to copy, and distribute verbatim copies
 *   of this license document, but changing it is not allowed.
 *
 *   Author: David Gofman
 */

register('impl.native::IWidget', function() {
})
.define({
    static: {
        create: function(html, shim, ref) {
            var o, div = document.createElement('div');
            div.innerHTML = html;
            o = div.firstChild;
            div.textContent = '';
            return shim != false ? IWidget.shim(o, ref) : o;
        },
        find: function(selector, parent, shim, ref) {
            var o = typeof(selector) == 'string' ? (parent || document).querySelector(selector) : selector;
            return shim != false ? IWidget.shim(o, ref) : o;
        },
        shim: function(o, _) {
            var apis = {
                $: o, //keep reference to jquery object
                find: function(selector, parent) {
                    return IWidget.find(selector, o);
                },
                offset: function() {
                    var r = o.getBoundingClientRect();
                    return { top:r.top, left:r.left };
                },
                x: function(value) {
                    return undef(value) ? parseInt(o.style.left, 10) : !(o.style.left = value) || _;
                },
                y: function(value) {
                    return undef(value) ? parseInt(o.style.top, 10) : !(o.style.top = value) || _;
                },
                width: function(value) {
                    return undef(value) ? parseInt(o.style.width, 10) || o.getBoundingClientRect().width : !(o.style.width = value) || _;
                },
                height: function(value) {
                    return undef(value) ? parseInt(o.style.height, 10) || o.getBoundingClientRect().height : !(o.style.height = value) || _;
                },
                css: function(value) {
                    if(typeof(value) == 'string')
                        return window.getComputedStyle(o).getPropertyValue(value);
                    for(var key in value)
                        o.style.setProperty(key, value[key]);
                    return _;
                },
                bind: function(type, listener) {
                    if (o.attachEvent) {
                        o.attachEvent('on' + type, listener);
                    } else {
                        o.addEventListener(type, listener);
                    }
                    return _;
                },
                unbind: function(type, listener) {
                    if (o.detachEvent) {
                        o.detachEvent('on' + type, listener);
                    } else {
                        o.removeEventListener(type, listener);
                    }
                    return _;
                },
                append: function(elem) {
                    o.appendChild(elem.$);
                    return _;
                },
                remove: function() {
                    o.parentNode.removeChild(o);
                    return _;
                }
            }
            if (undef(_)) _ = apis;
            return apis;
        }
    }
});