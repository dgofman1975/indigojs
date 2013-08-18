/**
 *
 * Copyright © 2013 Softigent Inc.
 *
 * Author: David Gofman
 */

'use strict';

register('com.indigojs.controls::EditableComboBox', function(selector, name) {
    this.$super(selector, name)

    .protected({
        $margin: {top: 2, left: 3, right: 24, bottom: 2},
        $outline: 'none',
        $attrName: 'selectedValue',
        $input: IWidget.create('<input class="editableSelect"/>')
    })
    .callLater('init');
})
.$extends('com.indigojs.controls.ComboBox', {
        protected: {
            init: function(_) {
                _.$super();
                var offset = (window.webkitURL ? 1 : 0),
                    margin = _.$margin;

                var span = IWidget.create('<span style="position: relative"/>').
                            css( { 'top': _.$can.css('margin-top'),
                                   'left': _.$can.css('margin-left') });

                _.$can.wrap(span);

                _.$can.css({'margin':0});

                _.$can.append(_.$input, 'after');

                _.$input.css({
                    'position': 'absolute',
                    'border': '0 none',
                    'height': (_.$can.height() - margin.top - margin.bottom - offset) + 'px',
                    'width': (_.$can.offset().width -  margin.right) + 'px',
                    'left': margin.left + 'px',
                    'top': (margin.top + offset) + 'px'
                });

                _.$input.bind('change', function(e) {
                    _.$changeEventHandler(e, _.$input);
                    _.$input.dispatch('focusout');
                });

                if (_.$outline != null)
                    _.$can.css({'outline':_.$outline}); //remove in FireFox selected outline (dotted)

                _.editable(true);
            },
            redraw: function(_) {
                _.$super();

                var option = _.getOption(_.$can.val());
                _.text(option.text());
                _.value(option.val());
                return _.me;
            }
        },

        public: {
            editable: function(_, value) {
                if (undef(value)) return  _.$editable;
                _.$editable = value;
                _.$input.css({'display': value ? 'block' : 'none'});
                return _.me;
            },
            text: function(_, value) {
                return undef(value) ? _.$input.val() : _.$input.val(value);
            },
            value: function(_, value) {
                return undef(value) ? _.$input.attr(_.$attrName) : _.$input.attr(_.$attrName, value);
            },
            destroy: function(_) {
                _.$input.remove();
                _.$super();
            }
        }
    }
);
