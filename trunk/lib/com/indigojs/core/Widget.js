/**
 *
 * Copyright © 2013 Softigent Inc. All rights reserved.
 *
 *   Permission is granted to copy, and distribute verbatim copies
 *   of this license document, but changing it is not allowed.
 *
 *   Author: David Gofman
 */

register('com.indigojs.core::Widget', function(selector, name) {
    this.super(name)

    .final({
        container: IWidget.find(selector, null, true, this)
    })
    .protected({
        $can: this.container,
        $selector: selector
    });
})
.import('com.indigojs.core.Object')
.implements('IWidget')
.extends('com.indigojs.core.Object', {
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
            css: function(_, value) {
                return _.$can.css(value);
            },
            bind: function(type, listener) {
                return _.$can.bind(type, listener);
            },
            unbind: function(type, listener) {
                return _.$can.unbind(type, listener);
            },
            append: function(elem) {
                return _.$can.append(elem);
            },
            destroy: function(_) {
                _.super();
                return _.$can.remove();
            }
        }
    }
);
