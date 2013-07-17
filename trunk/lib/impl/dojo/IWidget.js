/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

'use strict';

register('impl.dojo::IWidget', function() {
})
.define({
    static: {
        create: function(html, ref) {
            var o = dojo.query(dojo.create("div", { innerHTML:html }).firstChild);
            return IWidget.shim(o, ref);
        },
        //http://dojotoolkit.org/reference-guide/1.9/dojo/query.html#standard-css3-selectors
        find: function(selector, parent, ref) {
            if (selector.$) return selector;
            return IWidget.shim(IWidget.findAll(selector, parent).at(0), ref);
        },
        findAll: function(selector, parent) {
            return (parent || dojo).query(selector);
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
                val: function(value) {
                    return undef(value) ? o[0].value : !(o[0].value = value) || _;
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
                    if(o[0].parentNode)
                       o[0].parentNode.insertBefore(elem.$[0], o[0]);
                    elem.$[0].appendChild(o[0]);
                    return _;
                },
                html: function(value) {
                    return undef(value) ? o[0].innerHTML : !(o[0].innerHTML = value) || _;
                },
                text: function(value) {
                    return undef(value) ? o[0].textContent : !(o[0].textContent  = value) || _;
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
                    dojo.place(elem.$[0], o[0], position);
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