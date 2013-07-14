/**
 *
 * Copyright � 2013 Softigent Inc.. All rights reserved.
 *
 *   Permission is granted to copy, and distribute verbatim copies
 *   of this license document, but changing it is not allowed.
 *
 *   Author: David Gofman
 */

register('impl.d3::IWidget', function() {
})
.define({
    static: {
        create: function(html, shim, ref) {
            var o, div = document.createElement('div');
            div.innerHTML = html;
            o = d3.select(div.firstChild);
            div.textContent = '';
            return shim != false ? IWidget.shim(o, ref) : o;
        },
        find: function(selector, parent, shim, ref) {
            var o = selector instanceof Array ? selector : (parent || d3).select(selector);
            return shim != false ? IWidget.shim(o, ref) : o;
        },
        shim: function(o, _) {
            var apis = {
                $: o, //keep reference to jquery object
                find: function(selector, parent) {
                    return IWidget.find(selector, o);
                },
                offset: function() {
                    var r = o.node().getBoundingClientRect();
                    return { top:r.top, left:r.left };
                },
                x: function(value) {
                    return undef(value) ? parseInt(o.style('left'), 10) : !o.style('left', value) || _;
                },
                y: function(value) {
                    return undef(value) ? parseInt(o.style('top'), 10) : !o.style('top', value) || _;
                },
                width: function(value) {
                    return undef(value) ? parseInt(o.style('width'), 10) : !o.style('width', value) || _;
                },
                height: function(value) {
                    return undef(value) ? parseInt(o.style('height'), 10) : !o.style('height', value) || _;
                },
                css: function(value) {
                    return typeof(value) == 'string' ? o.style(value) : !o.style(value) || _;
                },
                bind: function(type, listener) {
                    return !o.on(type, function() {
                        listener(d3.event);
                    }) || _;
                },
                unbind: function(type, listener) {
                    return !o.on(type, null) || _;
                },
                append: function(elem) {
                    o.node().appendChild(elem.$.node());
                    return _;
                },
                remove: function() {
                    o.remove();
                    return _;
                }
            }
            if (undef(_)) _ = apis;
            return apis;
        }
    }
});