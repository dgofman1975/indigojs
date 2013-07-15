/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

register('com.indigojs.controls::MenuBar', function(selector, name) {
    var mc;

    this.super(selector, name)

    .final({
        menu_container: mc = IWidget.create('<div class="menubar-container" style="height:100%">' +
                                       '   <ul class="menubar" style="margin:0">' +
                                       '   </ul>' +
                                       '</div>', this),
        menubar: mc.find(".menubar")
    })
    .protected({
        $selectedIndex: -1,
        $selectedItem:  null, //MenuItem;
        $items: [],     //Array<MenuItem>
        $menuItems: [], //Array<MenuItem>
        $menuLI: null   //JQuery
    })
    .callLater('init');
})
.import('com.indigojs.core.Utils')
.extends('com.indigojs.core.Widget', {
        static: {
            MENU_ITEM_TEMPLATE: '<li data="<%=data%>" index="<%=index%>">' +
                                '  <span class="unselect">' +
                                '     <span style="display: inline-block"><%=label%></span>' +
                                '  </span>' +
                                '</li>',

            createItem: function(data, label, icon, hide, selectable) {
                return {data:data, label:label, icon:icon, hide:hide, selectable:selectable, children:[]};
            }
        },
        protected: {
            init: function(_) {
                _.$can.append(_.menu_container);

                _.$itemClickEventHandler = function(item, li) {
                    console.log(item.index, item.data, li);
                };
            },
            createMenus: function(_) {
                _.$menuItems = [];

                var index = 0;

                var createMenus = function(parent, items, parentItem) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        item.index = index++;
                        item.parent = parentItem;
                        if (item.selectable == null)
                            item.selectable = true;
                        _.$menuItems.push(item);

                        if (item.hide == true)
                            continue;

                        var menu = IWidget.create(Utils.template(MenuBar.MENU_ITEM_TEMPLATE, item));
                        if (item.icon != null)
                            menu.find('span.unselect>span')
                                .append(IWidget.create('<div class="' + item.icon + '"></div>'));

                        parent.append(menu);

                        if (item.children != null && item.children.length > 0) {
                            var ul = createMenus(IWidget.create('<ul></ul>'), item.children, item);
                            menu.append(ul);
                        }
                    }
                    return parent;
                };

                createMenus(_.menubar.html(''), _.items());

                var onMenuClickHandler = function(e) {
                    e.preventDefault();
                    var index = _.menubar.find(e.currentTarget).attr('index');
                    if (_.$menuItems[index].children == null || _.$menuItems[index].children.length == 0) {
                        if (self.selectedIndex() != index) {
                            _.$itemClickEventHandler(_.$menuItems[index], $(e.currentTarget));
                            _.selectedIndex(index);
                            _.$menuLI.find('ul').css({'visibility':'hidden'});
                        }
                    }
                };

                var onOpenSubMenuHandler = function(e) {
                    e.preventDefault();
                    _.menubar.find(e.currentTarget).findAll('ul').css({'visibility':'visible'});
                };

                var onCloseSubMenuHandler = function(e) {
                    e.preventDefault();
                    _.menubar.find(e.currentTarget).find('ul').css({'visibility':'hidden'});
                };

                _.menubar.find('li')
                         .bind('click', onMenuClickHandler)
                         .bind('mouseover', onOpenSubMenuHandler)
                         .bind('mouseout', onCloseSubMenuHandler);
                return _.me;
            }
        },

        public: {
            itemClickEventHandler: function(_, value) {
                return !arguments.length ? _.$itemClickEventHandler : (_.$itemClickEventHandler = value) != value || _.me;
            },
            items: function(_, value) {
                if (undef(value)) return _.$items;
                _.$items = value;
                return _.createMenus();
            },
            selectedItem: function(_, data) {
                if (undef(data)) return _.$selectedItem;
                _.$selectedItem = _.getItemByData(data);
                if (_.$selectedItem != null) {
                    _.selectedIndex(_.$selectedItem.index);
                } else {
                    _.selectedIndex(-1);
                }
                return _.$selectedItem;
            },
            selectedIndex: function(_, index) {
                if (undef(index)) return _.$selectedIndex;
                // Un-select previous menu
                var selectedItem = _.$selectedItem;
                if (selectedItem != null) {
                    _.menubar.find('li[data="' + selectedItem.data + '"]').find('span:first-child').classed('menuSelected', null);
                    if (selectedItem.parent != null)
                        _.menubar.find('li[data="' + selectedItem.parent.data + '"]').find('span:first-child').classed('menuSelected', null);
                }

                if (_.$menuItems[index] != null) {
                    selectedItem = _.$menuItems[index];
                    _.$selectedIndex = index;

                    if (selectedItem.selectable == true)
                        _.menubar.find('li[data="' + selectedItem.data + '"]').find('span:first-child').classed('menuSelected');
                    if (selectedItem.parent != null && selectedItem.parent.selectable == true)
                        _.menubar.find('li[data="' + selectedItem.parent.data + '"]').find('span:first-child').classed('menuSelected');
                } else {
                    selectedItem = null;
                    _.$selectedIndex = -1;
                }
                return _.$selectedItem = selectedItem;
            },
            getItemByData: function(_, data) {
                for (var i = 0; i < _.$menuItems.length; i++) {
                    if (_.$menuItems[i].data == data)
                        return _.$menuItems[i];
                }
                return null;
            },
            getItemByIndex: function(_, index) {
                return _.$menuItems[index];
            }
        }
    }
);