/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

'use strict';

register('impl.d3::IWidget', function() {
})
.$define({
    static: {
        create: function(html, ref) {
            var o, div = document.createElement('div');
            div.innerHTML = html;
            o = d3.select(div.firstChild);
            div.textContent = '';
            return IWidget.shim(o, ref);
        },
        find: function(selector, parent, ref) {
            if (selector.$) return selector;
            var all = selector instanceof Array ? selector : (parent || d3).selectAll(selector);
            return IWidget.shim(all, ref).eq(0);
        },
        shim: function(all, _) {
            var o = all, index = 0;
            var apis = {
                $: o, //keep reference to the current object
                length: function() {
                    return all[0].length;
                },
                eq: function(i) {
                    apis.$ = o = d3.select(all[0][index = i]);
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
                    return o.node().getBoundingClientRect();
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
                val: function(value) {
                    return undef(value) ? o.node().value : !(o.node().value = value) || _;
                },
                classed: function(name, value) {
                    return !o.classed(name, value !== null) || _;
                },
                attr: function(name, value) {
                    if (value === null)
                        return !o.attr(name, null) || _;
                    return undef(value) ? o.attr(name) : !o.attr(name, value) || _;
                },
                wrap: function(elem) {
                    if(o.node().parentNode)
                       o.node().parentNode.insertBefore(elem.$.node(), o.node());
                    elem.$.node().appendChild(o.node());
                    return _;
                },
                html: function(value) {
                    return undef(value) ? o.html() : !o.html(value) || _;
                },
                text: function(value) {
                    return undef(value) ? o.text() : !o.text(value) || _;
                },
                bind: function(type, listener) {
                    return !o.on(type, function() {
                        listener(d3.event);
                    }) || _;
                },
                unbind: function(type, listener) {
                    return !o.on(type, null) || _;
                },
                dispatch: function(type, classType) {
                    if (document.createEventObject) {
                        var e = document.createEventObject();
                        o.node().fireEvent('on' + type, e);
                    } else {
                        var e = document.createEvent(classType || 'HTMLEvents');
                        e.initEvent(type, true, false);
                        o.node().dispatchEvent(e);
                    }
                    return _;
                },
                append: function(elem, position) {
                    switch(position) {
                        case 'before':
                            if(o.node().parentNode)
                                o.node().parentNode.insertBefore(elem.$.node(), o.node());
                            break;
                        case 'after':
                            if(o.node().parentNode) {
                                if(o.node().parentNode.lastChild == o){
                                    o.node().parentNode.appendChild(elem.$.node());
                                }else{
                                    o.node().parentNode.insertBefore(elem.$.node(), o.node().nextSibling);
                                }
                            }
                            break;
                        default:
                            o.node().appendChild(elem.$.node());
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