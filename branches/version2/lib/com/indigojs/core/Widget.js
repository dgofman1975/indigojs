/**
 *
 * Copyright © 2013 Softigent Inc.
 *
 * Author: David Gofman
 */

'use strict';

register('com.indigojs.core::Widget', function(selector, name) {
    var _ = this.$super(name)

    _.final({
        container: IWidget.find(selector, null, _)
    })
    .protected({
        $can: _.container,
        $selector: selector
    });
})
.$import('com.indigojs.core.Object')
.$implements('IWidget')
.$extends('com.indigojs.core.Object', {
        protected: {
            redraw: function(_) {
                return _.me;
            }
        },

        public: {
            move: function(_, x, y) {
                return _.x(x).y(y);
            },
            size: function(_, width, height) {
                return _.width(width).height(height);
            },
            find: function(_, selector) {
                return _.$can.find(selector);
            },
            offset: function(_) {
                return _.$can.offset();
            },
            x: function(_, value) {
                return _.$can.x(value);
            },
            y: function(_, value) {
                return _.$can.y(value);
            },
            width: function(_, value) {
                return _.$can.width(value);
            },
            height: function(_, value) {
                return _.$can.height(value);
            },
            classed: function(_, value, remove) {
                return _.$can.classed(value, remove);
            },
            css: function(_, value) {
                return _.$can.css(value);
            },
            val: function(_, value) {
                return _.$can.val(value);
            },
            attr: function(_, name, value) {
                return _.$can.attr(name, value);
            },
            prop: function(_, name, value) {
                return _.$can.prop(name, value);
            },
            wrap: function(elem) {
                return _.$can.wrap(elem);
            },
            html: function(_, value) {
                return _.$can.html(value);
            },
            text: function(_, value) {
                return _.$can.text(value);
            },
            bind: function(_, type, listener) {
                return _.$can.bind(type, listener);
            },
            unbind: function(_, type, listener) {
                return _.$can.unbind(type, listener);
            },
            dispatch: function(type, classType) {
                return _.$can.dispatch(type, classType);
            },
            append: function(_, elem, position) {
                return _.$can.append(elem, position);
            }
        }
    }
);
