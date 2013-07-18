/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

'use strict';

register('impl.native::IWidget', function() {
})
.define({
    static: {
        create: function(html, ref) {
            var o, div = document.createElement('div');
            div.innerHTML = html;
            o = div.firstChild;
            div.textContent = '';
            return IWidget.shim(o, ref);
        },
        find: function(selector, parent, ref) {
            if (selector.$) return selector;
            try {
                var all = typeof(selector) == 'string' ? (parent || document).querySelectorAll(selector) : selector;
                return IWidget.shim(all, ref).eq(0);
            }catch(e) { throw new Error("Invalid selector: " + selector, e)}
        },
        shim: function(all, _) {
            var o = all, index = 0;
            var apis = {
                $: o, //keep reference to the current object
                length: function() {
                    return all.length;
                },
                eq: function(i) {
                    apis.$ = o = all[index = i];
                    return apis;
                },
                find: function(selector) {
                    return IWidget.find(selector, o);
                },
                foreach: function(handler, startIndex, endIndex) {
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
                    var r = o.getBoundingClientRect();
                    if(isNaN(r.width) || isNaN(r.height)) /*IE8*/
                        r = {top: r.top, bottom: r.bottom,
                             left: r.left, right: r.right,
                             width: o.offsetWidth, height: o.offsetHeight };

                    return r;
                },
                x: function(value) {
                    return undef(value) ? parseInt(apis.css('left'), 10) : !(o.style.left = value) || _;
                },
                y: function(value) {
                    return undef(value) ? parseInt(apis.css('top'), 10) : !(o.style.top = value) || _;
                },
                width: function(value) {
                    return undef(value) ? parseInt(apis.css('width'), 10) || parseInt(o.style.width, 10)
                                || o.offsetWidth /*IE8 */ : !(o.style.width = value) || _;
                },
                height: function(value) {
                    return undef(value) ? parseInt(apis.css('height'), 10) || parseInt(o.style.height, 10)
                            || o.offsetHeight /*IE8 */ : !(o.style.height = value) || _;
                },
                css: function(value) {
                    if(typeof(value) == 'string')
                        return o.getStyle(value);
                    for(var key in value)
                        o.setStyle(key, value[key]);
                    return _;
                },
                val: function(value) {
                    return undef(value) ? o.value : !(o.value = value)|| _;
                },
                classed: function(name, value) {
                    if (value === null) {
                        o.className = o.className.replace(new RegExp(name,'g'), '');
                    } else {
                        if (o.className.indexOf(name) == -1)
                            o.className += ' ' + name;
                    }
                    o.className = o.className.replace(/^\s+|\s+$/g, '');
                    return _;
                },
                attr: function(name, value) {
                    if (value === null)
                        return !o.removeAttribute(name) || _;
                    return undef(value) ? o.getAttribute(name) : !o.setAttribute(name, value) || _;
                },
                wrap: function(elem) {
                    if(o.parentNode)
                       o.parentNode.insertBefore(elem.$, o);
                    elem.$.appendChild(o);
                    return _;
                },
                html: function(value) {
                    return undef(value) ? o.innerHTML : (o.innerHTML = value) != value || _;
                },
                text: function(value) {
                    if (o.textContent)
                        return undef(value) ? o.textContent : (o.textContent = value) != value || _;
                    return undef(value) ? o.innerText : (o.innerText = value) != value || _; //IE8
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
                        try { o.detachEvent('on' + type, listener);
                        } catch (e) {} //IE8 may cause an exception
                    } else {
                        o.removeEventListener(type, listener);
                    }
                    return _;
                },
                dispatch: function(type, classType) {
                    if (document.createEventObject) {
                        var e = document.createEventObject();
                        o.fireEvent('on' + type, e);
                    } else {
                        var e = document.createEvent(classType || 'HTMLEvents');
                        e.initEvent(type, true, false);
                        o.dispatchEvent(e);
                    }
                    return _;
                },
                append: function(elem, position) {
                    switch(position) {
                        case 'before':
                            if(o.parentNode)
                                o.parentNode.insertBefore(elem.$, o);
                            break;
                        case 'after':
                            if(o.parentNode) {
                                if(o.parentNode.lastChild == o){
                                    o.parentNode.appendChild(elem.$);
                                }else{
                                    o.parentNode.insertBefore(elem.$, o.nextSibling);
                                }
                            }
                            break;
                        default:
                            o.appendChild(elem.$);
                    }
                    return _;
                },
                remove: function() {
                    if (o.parentNode)
                        o.parentNode.removeChild(o);
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
        return document.defaultView.getComputedStyle(this, '').getPropertyValue(name);
    };
    Element.prototype.setStyle = function(name, value) {
        this.style.setProperty(name, value);
    };
};