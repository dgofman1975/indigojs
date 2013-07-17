/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

'use strict';

register('impl.jquery::IWidget', function() {
})
.define({
    static: {
        create: function(html, ref) {
            return IWidget.shim($(html), ref);
        },
        find: function(selector, parent, ref) {
            if (selector.$) return selector;
            return IWidget.shim(IWidget.findAll(selector, parent).eq(0), ref);
        },
        findAll: function(selector, parent) {
            return parent ? parent.find(selector) : $(selector);
        },
        shim: function(o, _) {
            var apis = {
                $: o, //keep reference to jquery object
                find: function(selector, parent) {
                    return IWidget.find(selector, o);
                },
                offset: function() {
                    return o[0].getBoundingClientRect();
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
                classed: function(name, value) {
                    if (value === null)
                        return !o.removeClass(name) || _;
                    return !o.addClass(name) || _;
                },
                attr: function(name, value) {
                    if (value === null)
                        return !o.removeAttr(name) || _;
                    return undef(value) ? o.attr(name) : !o.attr(name, value) || _;
                },
                wrap: function(elem) {
                    //return !o.wrap(elem.$) || _; //bug http://bugs.jquery.com/ticket/14131
                    if (elem.$.length > 0) {
                        if(o[0].parentNode)
                           o[0].parentNode.insertBefore(elem.$[0], o[0]);
                        elem.$[0].appendChild(o[0]);
                    }
                    return _;
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
                dispatch: function(type, classType) {
                    if (document.createEventObject) {
                        var e = document.createEventObject();
                        o[0].fireEvent('on' + type, e);
                    } else {
                        var e = document.createEvent(classType || 'HTMLEvents');
                        e.initEvent(type, true, false);
                        o[0].dispatchEvent(e);
                    }
                    return _;
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