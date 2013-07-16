/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

register('com.indigojs.controls::ColorPicker', function(name) {
    this.$super(IWidget.create('<div class="color-picker">' +
                              '  <div class="pallete" style="height: 100px; width: 180px;">'   +
                              '    <div class="cursor"></div>' +
                              '  </div>' +
                              '  <div class="slider">' +
                              '    <div class="cursor"></div>' +
                              '  </div>' +
                              '</div>', false), name)

    .protected({
        $hsv: { h:0, s:0, v:0 },
        $rgb: { r:0, g:0, b:0 },
        $hex: '#000000',
        $sliders: [],

        $slider: null, $scursor: null,
        $pallete: null, $pcursor: null
    })
    .callLater('init');
})
.$extends('com.indigojs.core.Widget', {
        protected: {
            init: function(_) {
                var body = IWidget.find('body');

                _.$slider = _.$can.find('.slider');
                _.$scursor = _.$slider.find('.cursor');

                _.$pallete = _.$can.find('.pallete');
                _.$pcursor = _.$pallete.find('.cursor');

                _.$sliderClickHandler = function(e, y) {
                    e.preventDefault && e.preventDefault();
                    if (undef(y)) {
                        y = e.pageY - _.$slider.offset().top;
                        if (Math.round(y) == _.$scursor.y()) {
                            return;
                        }
                    }

                    _.hsv(_.$hsv.h, _.$hsv.s, 1 - y / _.$slider.height(), null);
                    _.$clickHandler(_.hex(), _.rgb(), _.hsv());
                };

                _.$palleteClickHandler = function(e) {
                    e.preventDefault && e.preventDefault();

                    var x = e.clientX - _.$pallete.offset().left;
                    var y = e.clientY - _.$pallete.offset().top;

                    _.hsv(x * (6 / _.$pallete.width()) * 60, 1 - y / _.$pallete.height(), null);
                    _.$clickHandler(_.hex(), _.rgb(), _.hsv());
                };

                _.$clickHandler = function(hex, rgb, hsv) {
                    console.log('hex:', hex, ', rgb:', rgb, ', hsv:', hsv);
                };

                _.$slider.bind('click', _.$sliderClickHandler);
                _.$pallete.bind('click', _.$palleteClickHandler);

                var e1, e2;
                _.$scursor.bind('mousedown', function(e) {
                    body.unbind('mouseup', e2);
                   _.$slider.unbind('mousemove', e1);

                    _.$slider.bind('mousemove', e1 = function(e) {
                        _.$scursor.y(Math.min(_.$slider.height(), Math.max(0, e.clientY - _.$slider.offset().top)) + 'px');
                    });

                    body.bind('mouseup', e2 = function(e) {
                        body.unbind('mouseup', e2);
                        _.$slider.unbind('mousemove', e1);
                        _.$sliderClickHandler(e, _.$scursor.y());
                    });
                });

                var y = 0;
                var step = 4;

                while(y < _.$pallete.height()) {
                    var div = IWidget.create('<div style="width:16px; height:' + step + 'px; font-size:1px; line-height:0"></div>');
                    _.$slider.append(div);
                    _.$sliders.push(div);
                    y += step;
                }

                return _.hex(_.$hex);
            },
            show: function(_) {
                _.redraw();

                _.$scursor.y(Math.round((1 - _.$hsv.v) * _.$pallete.height()) + 'px');

                var x = Math.round(((_.$hsv.h / 60) / 6) * _.$pallete.width());
                var y = Math.round((1 - _.$hsv.s) * _.$pallete.height());

                _.$pcursor.x(x - _.$pcursor.width() / 2 + 'px');
                _.$pcursor.y(y - _.$pcursor.height() / 2 + 'px');
                return _.me;
            },
            mixHSV: function(_, h, s, v) {
                var i = Math.floor(h);
                var f = (i % 2 != 0) ? h-i : 1-(h - i);
                var m = v * (1 - s);
                var n = v * (1 - s * f);
                switch(i) {
                    case 6:
                    case 0: return { h:v, s:n, v:m };
                    case 1: return { h:n, s:v, v:m };
                    case 2: return { h:m, s:v, v:n };
                    case 3: return { h:m, s:n, v:v };
                    case 4: return { h:n, s:m, v:v };
                    case 5: return { h:v, s:m, v:n };
                }
                return { h:0, s:0, v:0 };
            },
            rgb2hex: function(_, rgb){
                return '#' +
                    (rgb.r > 9 ? '' : '0') + rgb.r.toString(16) +
                    (rgb.g > 9 ? '' : '0') + rgb.g.toString(16) +
                    (rgb.b > 9 ? '' : '0') + rgb.b.toString(16);
            },
            redraw: function(_) {
                _.$super();

                var mix = _.mixHSV(_.$hsv.h / 60, _.$hsv.s, 1);
                var sliders = _.$sliders;
                for (var i = 0; i < sliders.length; i++) {
                    sliders[i].css({'background':
                        'rgb('+
                                    (mix.h * (1 - i / sliders.length) * 100) + '%,'+
                                    (mix.s * (1 - i / sliders.length) * 100) + '%,'+
                                    (mix.v * (1 - i / sliders.length) * 100) + '%)'});
                }
                return _.me;
            }
        },

        public: {
            hsv: function(_, h, s, v) {
                if (arguments.length == 1) return _.$hsv;

                if(_.$hsv.v === 0 && v == null) v = 1;
                var mix = _.mixHSV(
                    h === null ? (_.$hsv.h / 60) : (h / 60),
                    s === null ?  _.$hsv.s : s,
                    v === null ?  _.$hsv.v : v
                );
                var rgb = { r: Math.round(255 * mix.h), g: Math.round(255 * mix.s), b: Math.round(255 * mix.v) };

               _.hex(_.rgb2hex(rgb));
                return _.me;
            },
            hex: function(_, value) {
                if (undef(value)) return _.$hex;

                var m = value.match(/^#([0-9a-f]{6})$/i);
                if (m && m.length) {
                    _.$hex = value;
                    _.rgb(
                            parseInt(value.substr(1, 2), 16),
                            parseInt(value.substr(3, 2), 16),
                            parseInt(value.substr(5, 2), 16)
                    );
                } else {
                    _.$hsv = { h:0, s:0, v:0 };
                    _.redraw();
                }
                return _.me;
            },
            rgb: function(_, r, g, b) {
                if (arguments.length == 1) return _.$rgb;

                 var rgb = _.$rgb = {r:r, g:g, b:b};
                 var hsv = _.$hsv = { h:0, s:0, v:0 };
                 _.$hex = _.rgb2hex(rgb);

                 var R = r / 255, G = g / 255, B = b / 255;
                 var minRGB = Math.min(R, Math.min(G, B));
                 var maxRGB = Math.max(R, Math.max(G, B));

                 // Black-gray-white
                 if (minRGB == maxRGB) {
                    hsv.v = minRGB;
                 } else {
                     // Colors other than black-gray-white:
                     var d = (R == minRGB) ? G - B : ((B == minRGB) ? R - G : B - R);
                     var h = (R == minRGB) ? 3 : ((B == minRGB) ? 1 : 5);

                     hsv.h = 60 * (h - d / (maxRGB - minRGB));
                     hsv.s = (maxRGB - minRGB) / maxRGB;
                     hsv.v = maxRGB;
                 }

                _.show.call(_.me);

                return _.me;
            },
            clickHandler: function(_, value) {
                 return undef(value) ? _.$clickHandler : (_.$clickHandler = value) != value || _.me;
            }
        }
    }
);
