/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
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
                attr: function(name, value) {
                    return undef(value) ? o.attr(name) : !o.attr(name, value) || _;
                },
                wrap: function(elem) {
                    if(o.node().parentNode)
                       o.node().parentNode.insertBefore(elem.$.node(), o.node());
                    elem.$.node().appendChild(o.node());
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