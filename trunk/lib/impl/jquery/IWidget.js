/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

register('impl.jquery::IWidget', function() {
})
.define({
    static: {
        create: function(html, shim, ref) {
            var o = $(html);
            return shim != false ? IWidget.shim(o, ref) : o;
        },
        find: function(selector, parent, shim, ref) {
            var o =  parent ? parent.find(selector) : $(selector);
            return shim != false ? IWidget.shim(o, ref) : o;
        },
        shim: function(o, _) {
            var apis = {
                $: o, //keep reference to jquery object
                find: function(selector, parent) {
                    return IWidget.find(selector, o);
                },
                offset: function() {
                    return o.offset();
                },
                x: function(value) {
                    return undef(value) ? o.position().left : !o.css('left', value) || _;
                },
                y: function(value) {
                    return undef(value) ? o.position().top : !o.css('top', value) || _;
                },
                width: function(value) {
                    return undef(value) ? o.width() : !o.css('width', value) || _;
                },
                height: function(value) {
                    return undef(value) ? o.height() : !o.css('height', value) || _;
                },
                css: function(value) {
                    return typeof(value) == 'string' ? o.css(value) : !o.css(value) || _;
                },
                val: function(value) {
                    return undef(value) ? o.val() : !o.val(value) || _;
                },
                attr: function(name, value) {
                    return undef(value) ? o.attr(name) : !o.attr(name, value) || _;
                },
                html: function(value) {
                    return undef(value) ? o.html() : !o.html(value) || _;
                },
                text: function(value) {
                    return undef(value) ? o.text() : !o.text(value) || _;
                },
                bind: function(type, listener) {
                    return !o.bind(type, listener) || _;
                },
                unbind: function(type, listener) {
                    return !o.unbind(type, listener) || _;
                },
                append: function(elem, position) {
                    switch(position) {
                        case 'before':
                            o.before(elem.$);
                            break;
                        case 'after':
                            o.after(elem.$);
                            break;
                        default:
                            o.append(elem.$);
                    }
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