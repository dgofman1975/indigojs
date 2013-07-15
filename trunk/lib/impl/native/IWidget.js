/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

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
            return IWidget.shim(IWidget.findAll(selector, parent)[0], ref);
        },
        findAll: function(selector, parent) {
            try {
                return typeof(selector) == 'string' ? (parent || document).querySelectorAll(selector) : selector;
            }catch(e) { throw new Error("Invalid selector: " + selector, e)}
        },
        shim: function(o, _) {
            var apis = {
                $: o, //keep reference to jquery object
                find: function(selector, parent) {
                    return IWidget.find(selector, o);
                },
                offset: function() {
                    return o.getBoundingClientRect();
                },
                x: function(value) {
                    return undef(value) ? parseInt(o.style.left, 10) : !(o.style.left = value) || _;
                },
                y: function(value) {
                    return undef(value) ? parseInt(o.style.top, 10) : !(o.style.top = value) || _;
                },
                width: function(value) {
                    return undef(value) ? parseInt(apis.css('width'), 10) || o.getBoundingClientRect().width : !(o.style.width = value) || _;
                },
                height: function(value) {
                    return undef(value) ? parseInt(apis.css('height'), 10) || o.getBoundingClientRect().height : !(o.style.height = value) || _;
                },
                css: function(value) {
                    if(typeof(value) == 'string')
                        return window.getComputedStyle(o).getPropertyValue(value);
                    for(var key in value)
                        o.style.setProperty(key, value[key]);
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
                },
                html: function(value) {
                    return undef(value) ? o.innerHTML : (o.innerHTML = value) != value || _;
                },
                text: function(value) {
                    return undef(value) ? o.textContent : (o.textContent = value) != value || _;
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