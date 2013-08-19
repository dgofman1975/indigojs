/**
 *
 * Copyright © 2013 Softigent Inc.
 *
 * Author: David Gofman
 */

'use strict';

register('com.indigojs.core.Widget', {
    namespace: function(_) {
        var can;

        return {
            init: function(selector, name) {
                _.supra(name)

                this.final({
                    container: (can = IWidget.find(selector, null, _))
                })
            },
            extend: 'com.indigojs.core.Object',
            implement: ['IWidget'],
            inherit: {
                redraw: function(_) {
                    return _;
                },
                move: function(x, y) {
                    return _.x(x).y(y);
                },
                size: function(width, height) {
                    return _.width(width).height(height);
                },
                find: function(selector) {
                    return can.find(selector);
                },
                offset: function(_) {
                    return can.offset();
                },
                x: function(value) {
                    return can.x(value);
                },
                y: function(value) {
                    return can.y(value);
                },
                width: function(value) {
                    return can.width(value);
                },
                height: function(value) {
                    return can.height(value);
                },
                classed: function(value, remove) {
                    return can.classed(value, remove);
                },
                css: function(value) {
                    return can.css(value);
                },
                val: function(value) {
                    return can.val(value);
                },
                attr: function(name, value) {
                    return can.attr(name, value);
                },
                prop: function(name, value) {
                    return can.prop(name, value);
                },
                wrap: function(elem) {
                    return can.wrap(elem);
                },
                html: function(value) {
                    return can.html(value);
                },
                text: function(value) {
                    return can.text(value);
                },
                bind: function(type, listener) {
                    return can.bind(type, listener);
                },
                unbind: function(type, listener) {
                    return can.unbind(type, listener);
                },
                dispatch: function(type, classType) {
                    return can.dispatch(type, classType);
                },
                append: function(elem, position) {
                    return can.append(elem, position);
                }
            }
        };
    }
});