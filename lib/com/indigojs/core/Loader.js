/**
 *
 * Copyright © 2013 Softigent Inc..
 *
 * Author: David Gofman
 */

register('com.indigojs.core::Loader', function() {
    this.uid = Indigo.inner.genUUID();
    Indigo.inner.instances[this.uid] = this;
})
.define({
    static: {
        libDir: null,
        lang: null,
        classMap: {},
        autoInclude:true,
        list: function() {
            return Object.keys(Loader.classMap);
        },
        import: function() {
            var Loader = com.indigojs.core.Loader,
                callBack = null, length = arguments.length;

            if (Loader.libDir == null){
                var scripts = document.getElementsByTagName('script');
                for(var i = 0; i < scripts.length; i++) {
                    var index, script = scripts[i];
                    if((index = script.src.indexOf('com/indigojs/indigo.js')) != -1) {
                        Loader.libDir = script.src.substr(0, index);

                        Loader.lang = script.lang;
                        if (!Loader.lang || Loader.lang == '@LANG@')
                             Loader.lang = 'native';
                        if (Loader.autoInclude && Loader.lang != 'native') {
                            var script = document.createElement('script');
                            script.setAttribute('type', 'text/javascript');
                            script.src = Loader.libDir + '../vendor/' + Loader.lang + '.js';
                            document.getElementsByTagName('head')[0].appendChild(script);
                        }
                        break;
                    }
                }
            }

            if ((callBack = arguments[length - 1]) instanceof Function)
                 length--;

            var loader = new Loader();
            loader.load([].slice.call(arguments, 0, length), callBack);
        }
    },
    protected: {
        loader: function(_, src, cls, listeners) {
            var scripts = document.getElementsByTagName('script');
            for(var i = 0; i < scripts.length; i++){
                var script = scripts[i];
                if(script.src.indexOf(src) != -1)
                    return _.ready(cls, listeners);
            }

            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.src = src;

            var loadHandler = function() {
                if (script.detachEvent) {
                    script.detachEvent('onreadystatechange', loadHandler);
                } else {
                    script.removeEventListener('load', loadHandler);
                }
                _.ready(cls, listeners);
            };

            if (script.attachEvent) {
                script.attachEvent('onreadystatechange', loadHandler);
            } else {
                script.addEventListener('load', loadHandler);
            }

            document.getElementsByTagName('head')[0].appendChild(script);
        },
        ready: function(_, cls, listeners) {
            Loader.classMap[cls].ready = true;
            for(var i = 0; i < listeners.length; i++)
                listeners[i].call(this, cls);
            return true;
        }
    },
    public: {
        load: function(_, classes, callBack) {
            var map = Loader.classMap, self = this;
            for (var i = 0; i < classes.length; i++) {
                var cls = classes[i];
                if (undef(map[cls]))
                    map[cls] = {listeners:[], import:0, implements:0, ready:false};
            }

            var complete = function(cls) {
                for (var i = 0; i < classes.length; i++) {
                    var o = map[classes[i]];

                    if(!o.ready || o.import || o.implements)
                        return;
                }
                if(callBack instanceof Function)
                   callBack();

                //clean
                for (var i = 0; i < classes.length; i++)
                    map[classes[i]] = null;
                delete Indigo.inner.instances[self.uid];
            };

            for (var i = 0; i < classes.length; i++) {
                var cls = classes[i];
                if (!map[cls].ready) {
                    map[cls].listeners.push(complete);

                    var src = Loader.libDir + cls.replace(/\./g, '/') + '.js';
                    _.loader(src, cls, map[cls].listeners);
                }
            }
        }
    }
});

var loaderComplete = function(me, args, prop) {
    var cls = me.package + '.' + me.className,
        map = Loader.classMap[cls];
    map[prop]++;
    args.push(
        function() {
            map[prop]--;
            if (!map.import && !map.implements) {
                var ci = me.__ci__;
                delete me.__ci__;
                if (ci instanceof Array)
                    me.extends.apply(me, ci);

                for(var i = 0; i < map.listeners.length; i++)
                    map.listeners[i].call(me, cls);
            }
        }
    );
    Loader.import.apply(me, args);
    return me;
};

Loader.extends = Function.prototype.extends; //save Indigo.js implementation
Function.prototype.extends = function(superClass, apis) {
    if (undef(Loader.classMap[superClass])) {
        try {
            eval(superClass);
        }catch(e) {}
        this.import(superClass);
    }
    Loader.extends.apply(this, [superClass, apis]);
};

Function.prototype.import = function() {
    return loaderComplete(this, [].slice.call(arguments), 'import');
};

Function.prototype.implements = function() {
    var args = [].slice.call(arguments);
    for(var i = 0; i < args.length; i++)
        args[i] = 'impl.' + Loader.lang + '.' + args[i];
    return loaderComplete(this, args, 'implements');
};