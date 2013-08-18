/**
 *
 * Copyright © 2013 Softigent Inc.
 *
 * Author: David Gofman
 */

'use strict';

register('impl.dojo::IWidget', function() {
})
.$define({
    static: {
        create: function(html, ref) {
            var o = dojo.query(dojo.create("div", { innerHTML:html }).firstChild);
            return IWidget.shim(o, ref);
        },
        //http://dojotoolkit.org/reference-guide/1.9/dojo/query.html#standard-css3-selectors
        find: function(selector, parent, ref) {
            if (selector.$) return selector;
            var all = (parent || dojo).query(selector);
            return IWidget.shim(all, ref).eq(0);
        },
        dummy: dojo.query(document.createElement('div')),
        shim: function(all, _) {
            var o = all, index = 0;
            var apis = {
                $: o, //keep reference to the current object
                length: function() {
                    return all.length;
                },
                eq: function(i) {
                    o = all.at(index = i);
                    apis.$ = o = o.length ? o : IWidget.dummy;
                    return apis;
                },
                find: function(selector) {
                    return IWidget.find(selector, o);
                },
                parent: function() {
                    return IWidget.find(o[0].parentNode);
                },
                each: function(handler, startIndex, endIndex) {
                    startIndex = startIndex || 0;
                    endIndex = endIndex || apis.length();
                    var oldIndex = index;
                    for (var i = startIndex; i < endIndex; i++) {
                        if (handler(apis.eq(i), i, all) === false)
                            break;
                    }
                    return apis.eq(oldIndex);
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
                    if(typeof(value) == 'string')
                        return o[0].getStyle(value);
                    for(var key in value)
                        o[0].setStyle(key, value[key]);
                    return _;
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
                prop: function(name, value) {
                    return !(o[0][name] = value) || _;
                },
                wrap: function(elem) {
                    var d = o[0]; //Dom
                    if (elem.$.length > 0) {
                        if(d.parentNode)
                           d.parentNode.insertBefore(elem.$[0], d);
                        elem.$[0].appendChild(d);
                    }
                    return _;
                },
                html: function(value) {
                    var d = o[0]; //Dom
                    return undef(value) ? d.innerHTML : (d.innerHTML = value) != value || _;
                },
                text: function(value) {
                    var d = o[0]; //Dom
                    if (d.textContent)
                        return undef(value) ? d.textContent : (d.textContent = value) != value || _;
                    return undef(value) ? d.innerText : (d.innerText = value) != value || _; //IE8
                },
                bind: function(type, listener) { //cannot use dojo connect such as not supporting disconnect by type or listener
                    var d = o[0]; //Dom
                    if (d.attachEvent) {
                        d.attachEvent('on' + type, listener);
                    } else {
                        d.addEventListener(type, listener);
                    }
                    return _;
                },
                unbind: function(type, listener) {
                    var d = o[0]; //Dom
                    if (d.detachEvent) {
                        d.detachEvent('on' + type, listener);
                    } else {
                        d.removeEventListener(type, listener);
                    }
                    return _;
                },
                dispatch: function(type, classType) {
                    var d = o[0]; //Dom
                    if (document.createEventObject) {
                        var e = document.createEventObject();
                        d.fireEvent('on' + type, e);
                    } else {
                        var e = document.createEvent(classType || 'HTMLEvents');
                        e.initEvent(type, true, false);
                        d.dispatchEvent(e);
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

if (!(CSSStyleDeclaration.prototype.setProperty instanceof Function)) {
    //IE 8
    Element.prototype.getStyle = function(name) {
        var value = this.currentStyle[name.replace(/\-(\w)/g, function(m, value) {
            return value.toUpperCase();
        })];
        return value != 'auto' ? value : 0;
    };
    Element.prototype.setStyle = function(name, value) {
        this.style.setAttribute(name.replace(/\-(\w)/g, function(m, value) {
            return value.toUpperCase();
        }), value);
    };
} else {
    Element.prototype.getStyle = function(name) {
        return dojo.getComputedStyle(this).getPropertyValue(name);
    };
    Element.prototype.setStyle = function(name, value) {
        this.style.setProperty(name, value);
    };
};