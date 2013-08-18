/**
 *
 * Copyright © 2013 Softigent Inc.
 *
 * Author: David Gofman
 */

'use strict';

register('com.indigojs.controls::ComboBox', function(selector, name) {
    if (document.all && IWidget.package != 'impl.jquery') // IE
        throw new Error('is not compatable for your browser try using JQuery 1.9');

    this.$super(selector, name)

    .protected({
        $options: []
    })
    .callLater('init');
})
.$extends('com.indigojs.core.Widget', {
        protected: {
            init: function(_) {
                _.$can.bind('change', function(e) {
                    _.redraw();
                    _.$changeEventHandler(e, _.$can);
                });

                _.$changeEventHandler = function(event, target) {
                    window.console && console.log(event.type, target);
                };
            },
            redraw: function(_) {
                return _.$super();
            }
        },

        public: {
            select: function(_, data) {
                var option = _.$can.find('option:checked');
                if(undef(data)) return option;
                option.attr('selected', null);
                option = _.getOption(data);
                if (option.length() != 0)
                    option.prop('selected', true);
                return _.redraw();
            },
            options: function(_, items, val, text) {
                if (undef(items)) return _.$options;
                val = val || 'data';
                text = text || 'label';
                _.$options = [];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var option = '<option value="' + item[val] + '"';
                    for (var key in item) {
                        if (key != val && key != text)
                        option += ' ' + key + '="' + item[key] + '"';
                    }
                    option += '>' + item[text] + '</option>';
                    _.$options.push(option);
                }
                _.$can.html(_.$options.join('\n'));
                return _.redraw();
            },
            getOption: function(_, data) {
                return _.$can.find('option[value=' + data + ']');
            },
            changeEventHandler: function(_, value) {
                return undef(value) ? _.$changeEventHandler : (_.$changeEventHandler = value) != value || _.me;
            }
        }
    }
);
