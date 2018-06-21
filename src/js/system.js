var TEMPLATE_VERSION = "1.0.0.0";

var CONSTANTS = {
    API_BASE: 'http://api.buyers.staging.tillbilly.com/v1/'
};

var TEMPLATE_BASE_PATH = '';// /android ?\d+.\d/gi.test(navigator.userAgent) ? '/android_asset/www' : '';

(function(scope){

    var requests = [];

    function get(obj){

        var xhr = new XMLHttpRequest(),
            params = obj.params === undefined ? '' : Helpers.serialize(obj.params),
            _session = Session.getSession(),
            success = obj.success || undefined,
            failure = obj.error || undefined;

        if(params !== '') params = '?' + params;

        xhr.open('GET', CONSTANTS.API_BASE + obj.path + params, true);

        if(_session != null){
            var token = 'Bearer ' + _session.token;
            xhr.setRequestHeader('Authorization', token);
        }

        xhr.onreadystatechange = function(){

            if(xhr.readyState === 4){

                if(xhr.status >= 200 && xhr.status < 300){

                    // Declaring this in all instances as ready state keeps changing
                    var response = '';

                    if(xhr.responseText){

                        try{

                            response = JSON.parse(xhr.responseText);

                        } catch(e){

                            console.error('Unexpected response. Status: ' + xhr.status);

                            response = {};

                        }

                    }

                    if(typeof success === 'function') success(response, xhr.status);

                } else {

                    // Declaring this in all instances as ready state keeps changing
                    var response = '';

                    if(xhr.responseText){

                        try{

                            response = JSON.parse(xhr.responseText);

                        } catch(e){

                            console.error('Unexpected response. Status: ' + xhr.status);

                            response = {
                                message: xhr.responseText
                            };

                        }

                    }

                    if(typeof failure === 'function') failure(xhr.status, response.message);

                }

            }

        };

        xhr.send();

        requests.push(xhr);

        return xhr;

    }

    function postPutDelete(method, obj){

        var xhr = new XMLHttpRequest(),
            params = obj.params === undefined ? '' : Helpers.serialize(obj.params),
            _session = Core.Services.Session.getSession(),
            success = obj.success || undefined,
            failure = obj.error || undefined;

        xhr.open(method, Core.Constants.API_BASE + obj.path, true);

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        if(_session != null){
            var token = 'Bearer ' + _session.token;
            xhr.setRequestHeader('Authorization', token);
        }

        xhr.onreadystatechange = function(){

            if(xhr.readyState === 4){

                if(xhr.status >= 200 && xhr.status < 300){

                    // Declaring this in all instances as ready state keeps changing
                    var response = '';

                    if(xhr.responseText){

                        try{

                            response = JSON.parse(xhr.responseText);

                        } catch(e){

                            console.error('Unexpected response. Status: ' + xhr.status);

                            response = {};

                        }

                    }

                    if(typeof success === 'function') success(response, xhr.status);

                } else {

                    // Declaring this in all instances as ready state keeps changing
                    var response = '';

                    if(xhr.responseText){

                        try{

                            response = JSON.parse(xhr.responseText);

                        } catch(e){

                            console.error('Unexpected response. Status: ' + xhr.status);

                            response = {
                                message: xhr.responseText
                            };

                        }

                    }

                    if(typeof failure === 'function') failure(xhr.status, response.message);

                }

            }

        };

        xhr.send(params);

        requests.push(xhr);

        return xhr;

    };

    function clearAll(){

        while(requests.length > 0){
            requests[requests.length - 1].abort();
            requests.pop();
        }

    };

    scope.XHR = {

        GET: function(xhrObj){
            return get(xhrObj);
        },

        POST: function(xhrObj){
            return postPutDelete('POST', xhrObj);
        },

        PUT: function(xhrObj){
            return postPutDelete('PUT', xhrObj);
        },

        DELETE: function(xhrObj){
            return postPutDelete('DELETE', xhrObj);
        },

        clear: function(){
            clearAll();
        }

    };

})(window); // XHR Service

(function(scope){

    var key = "session";

    function createSession(_token, _user, _callback){

        var token = _token,
            user = _user,
            ttl = 24;

        window.localStorage.setItem(key, JSON.stringify({
            token: token,
            user: user,
            ttl: new Date().getTime() + (ttl * 86400000)
        }));

        if(typeof _callback === 'function'){
            _callback();
        }

    }

    function destroySession(_callback){
        window.localStorage.removeItem(key);
        if(typeof _callback === 'function'){
            _callback();
        }
    }

    function getSession(){
        var _session = JSON.parse(localStorage.getItem(key));
        if(_session != null){
            return _session;
        } else {
            return null;
        }
    }

    function getUser(){
        var _session = JSON.parse(localStorage.getItem(key));
        if(_session != null){
            return _session.user;
        } else {
            return null;
        }
    }

    function getTTL(){
        var _session = JSON.parse(localStorage.getItem(key));
        if(_session != null){
            return _session.ttl;
        } else {
            return undefined;
        }
    }

    function updateUser(_user, _callback){
        var _session = JSON.parse(localStorage.getItem(key)),
            to = _session.token,
            ttl = _session.ttl;

        window.localStorage.setItem(key, JSON.stringify({
            token: to,
            user: _user,
            ttl: ttl
        }));

        if(typeof _callback === 'function'){
            _callback();
        }

    }

    function updateToken(_token, _user, _callback){

        var _session = JSON.parse(localStorage.getItem(key));

        window.localStorage.setItem(key, JSON.stringify({
            token: _token,
            user: _user,
            ttl: new Date().getTime() + (6 * 86400000)
        }));

        if(typeof _callback === 'function'){
            _callback();
        }

    }

    function updateOnLoad(callback){

        var user = getUser();

        if(user !== undefined && user != null){

            if(getTTL() === undefined || getTTL() === null){

                destroySession(callback);

            } else {

                var _ttl = getTTL() - new Date().getTime();

                if(_ttl <= 0 ){

                    destroySession(callback);

                //} else if(_ttl > 0 && _ttl < 3 * 86400000){ // To check token validity
                } else {

                    XHR.GET({
                        path: 'buyers/me/',
                        success: function(tData){
                            updateUser(tData.user, callback);
                        },
                        error: function(){
                            // Show Error Popup
                            if(typeof callback === 'function') callback();
                        }
                    });

                }

            }

        } else {

            if(typeof callback === 'function'){
                callback();
            }

        }

    }

    function isActive(){
        var s = getSession();
        if(s == null){
            return false;
        }
        return true;
    }

    scope.Session = {

        create: function(token, user, callback){
            createSession(token, user, callback);
        },

        destroy: function(callback){
            destroySession(callback);
        },

        getSession: getSession,

        getUser: getUser,

        update: function(user, callback){
            updateUser(user, callback);
        },

        onLoad: function(callback){
            updateOnLoad(callback);
        },

        isActive: isActive

    }

})(window); // Session Service

(function(scope){

    var system = {
            click: [],
            scroll: [],
            resize: []
        },
        temp = {
            click: [],
            scroll: [],
            resize: []
        };

    function init(){

        //Core.Router.onBeforeContentUnload(clearPageEvents);
        //ScreenManager.addUnloadEvent(clearPageEvents);

        window.addEventListener('resize', function(e){

            for(var fn in temp.resize){

                if(typeof temp.resize[fn] === 'function'){

                    temp.resize[fn].call(this, e);

                }

            }

            for(var fn in system.resize){

                if(typeof system.resize[fn] === 'function'){

                    system.resize[fn].call(this, e);

                }

            }

        });

        window.addEventListener('click', function(e){

            for(var fn in temp.click){

                if(typeof temp.click[fn] === 'function'){

                    temp.click[fn].call(this, e);

                }

            }

            for(var fn in system.click){

                if(typeof system.click[fn] === 'function'){

                    system.click[fn].call(this, e);

                }

            }

        });

        window.addEventListener('scroll', function(e){

            for(var fn in temp.scroll){

                if(typeof temp.scroll[fn] === 'function'){

                    temp.scroll[fn].call(this, e);

                }

            }

            for(var fn in system.scroll){

                if(typeof system.scroll[fn] === 'function'){

                    system.scroll[fn].call(this, e);

                }

            }

        });

    }

    function clearPageEvents(){
        temp.click.length = 0;
        temp.resize.length = 0;
        temp.scroll.length = 0;
    }

    scope.Events = {

        addToSystem: function(type, fn){
            system[type].push(fn);
        },

        addEvent: function(type, fn){
            temp[type].push(fn);
        },

        windowScroll: function(fn){
            temp.scroll.push(fn);
        },

        windowResize: function(fn){
            temp.resize.push(fn);
        },

        windowClick: function(fn){
            temp.click.push(fn);
        },

        clearAll: function(){
            temp.click.length = 0;
            temp.resize.length = 0;
            temp.scroll.length = 0;
        },

        clearScroll: function(){
            temp.scroll.length = 0;
        },

        clearClick: function(){
            temp.click.length = 0;
        },

        clearResize: function(){
            temp.resize.length = 0;
        },

        init: function(){
            init();
        }

    }

})(window); // Events Service

(function(scope){

    var COLLECTION = {};

    function addType(type){
        COLLECTION[type] = [];
    }

    function addItem(type, item, props){
        if(!COLLECTION.hasOwnProperty(type)){
            COLLECTION[type] = [];
        }

        if(getItemById(type, item.id)) return false;

        var _coll = COLLECTION[type];

        item.pos_in_array = _coll.length;

        if(props && typeof props === 'object'){

            for(var p in props){

                if(props.hasOwnProperty(p)){

                    item[p] = props[p];

                }

            }

        }

        _coll.push(item);

        return item;
    }

    function addItems(type, arr){
        if(!COLLECTION.hasOwnProperty(type)){
            COLLECTION[type] = [];
        }

        if(getItemById(type, item.id)) return;

        var _coll = COLLECTION[type];

        for(var i = 0; i < arr.length; i++){
            var item = arr[i];

            item.pos_in_array = _coll.length;
            _coll.push(item);
        }

        return arr;
    }

    function getItem(type, pos){
        if(!COLLECTION.hasOwnProperty(type)){
            return null;
        }

        var item = COLLECTION[type][pos];

        return item ? item : null;
    }

    function getItemById(type, id){
        if(!COLLECTION.hasOwnProperty(type)){
            return null;
        }

        var _coll = COLLECTION[type],
            match = false;

        for(var i = 0; i < _coll.length; i++){
            var item = _coll[i];

            if(item.id === id){
                match = i;
                break;
            }
        }

        return match ? _coll[match] : null;
    }

    function getCollection(type){
        if(COLLECTION.hasOwnProperty(type)){
            return COLLECTION[type];
        }
        return null;
    }

    function clearCollection(type){
        if(COLLECTION.hasOwnProperty(type)){
            COLLECTION[type] = [];
        }
    }

    function save(){



    }

    function clear(){



    }

    scope.Collection = {

        addType: addType,

        addItem: addItem,

        addItems: addItems,

        getItem: getItem,

        getItemById: getItemById,

        getCollection: getCollection,

        clearCollection: clearCollection,

        saveToStorage: save,

        clearStorage: clear

    };

})(window); // Data Collection

(function(scope){

    var helpers = {},
        math = {};

    helpers.extendDefaults = function(source, properties){

        var property;

        for(property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }

        return source;

    };

    helpers.serialize = function(queryObject){
        var paramArray = [],
            queryString = "";

        for(var p in queryObject){
            if (queryObject.hasOwnProperty(p)){
                paramArray.push(encodeURIComponent(p) + "=" + encodeURIComponent(queryObject[p]));
            }
        }

        queryString = paramArray.join("&");
        return queryString;
    };

    math.easeInOut = function (currentTime, start, change, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }

    math.range = function(min, max, val){
        return Math.abs(val / (max - min));
    };

    helpers.Math = math;

    scope.Helpers = helpers;

})(window); // Helper functions

/**
 * DOM Enhancers
 * Adds additional properties to native DOM objects
 */
(function(scope){

    HTMLElement.prototype.CSS = function(css){
        var prefixedProps = ['transform', 'transition', 'flex'];
        for(var prop in css){
            if(css.hasOwnProperty(prop)){
                if(prefixedProps.includes(prop)){
                    let _prop = prop[0].toUpperCase() + prop.substring(1, prop.length);
                    this.style['webkit' + _prop] = css[prop];
                    this.style['ms' + _prop] = css[prop];
                    this.style['moz' + _prop] = css[prop];
                }
                this.style[prop] = css[prop];
            }
        }
        return this.style;
    };

    HTMLElement.prototype.get2DTransforms = function(){
        var style = getComputedStyle(this),
            transform = style.transform || style.webkitTransform || style.mozTransform;

        transform = transform.replace('matrix(', '');
        transform = transform.replace(')', '');
        transform = transform.split(',');

        return {
            x: parseInt(transform[4]),
            y: parseInt(transform[5])
        };
    };

    Date.prototype.getDayName = function(full){
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            days_full = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return full ? days_full[this.getDay()] : days[this.getDay()];
    };

    Date.prototype.getMonthName = function(full){
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            months_full = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return full ? months_full[this.getMonth()] : months[this.getMonth()];
    };

    scope.createElement = function(_tag, _class){
        var elem = document.createElement(_tag);
        if(_class) elem.className = _class;
        return elem;
    };

})(window); // DOM enhancers

(function(scope){

    function panel(){

        this.slides = {
            total: 0,
            current: 0,
            width: 0,
            xPos: 0,
            maxXPos: 0
        };

        this.touchEvents = null;

        this.parent = createElement('div', 'slider_panel single');
        this.slider = createElement('div', 'slider_panel-slider');
        this.nav = createElement('div', 'slider_panel-nav');

        this.slider.CSS({
            transition: 'all .3s ease'
        });
        this.nav.style.visibility = 'hidden';

        this.parent.appendChild(this.slider);
        this.parent.appendChild(this.nav);
    }

    panel.prototype.add = function(slide_elem, nav_elem){

        var _slide, _nav;

        if(typeof slide_elem === 'string'){
            _slide = createElement('div', 'slider_panel-panel');
            _slide.innerHTML = slide_elem;
        } else {
            _slide = slide_elem;
            _slide.classList.add('slider_panel-panel');
        }

        if(typeof nav_elem === 'string'){
            _nav = createElement('a');
            _nav.innerHTML = nav_elem;
        } else {
            _nav = nav_elem;
        }

        this.slider.appendChild(_slide);
        this.nav.appendChild(_nav);

        _nav.onclick = slideTo.bind(this, this.slides.total);

        this.slides.total++;

        readjustWidth.call(this);

        if(this.slides.total > 1){
            this.parent.classList.remove('single');
            this.nav.style.visibility = 'visible';
            setupTouch.call(this);
        }

    };

    panel.prototype.appendTo = function(elem){
        elem.appendChild(this.parent);
    };

    function readjustWidth(){

        this.slides.width = 100 / this.slides.total;
        this.slides.maxXPos = this.slides.width * (this.slides.total - 1)

        this.slider.style.width = (this.slides.total * 100) + '%';

        for(let i = 0; i < this.slider.children.length; i++){
            this.slider.children[i].style.width = this.slides.width + '%';
        }

        slideTo.call(this, this.slides.current);

    }

    function slideTo(num, _time){
        var slider = this.slider,
            total = this.slides.total,
            translateX = (num / total) * -100,
            time = typeof _time === 'number' ? _time : 300;

        if(time > 500) time = 500;

        slider.CSS({
            transition: 'all ' + time + 'ms ease'
        });

        slider.CSS({
            transform: 'translateX(' + translateX + '%)'
        });

        this.slides.current = num;
        this.slides.xPos = translateX;
    }


    // Setup touch

    function setupTouch(){
        var slider = this.slider,
            _this = this;

        slider.addTouchListeners({

            onstart: function(e){
                slider.CSS({
                    transition: 'none'
                });
            },

            onmove: function(e){

                if(e.axis === 'vertical') return;

                //e.event.preventDefault();

                var percentage = (e.delta.x / slider.offsetWidth) * 100,
                    max = -1 * _this.slides.maxXPos,
                    distance = _this.slides.xPos + percentage;

                if(distance >= 0) distance = 0;
                if(distance < max) distance = max;

                _this.slides.xPos = distance;

                slider.CSS({
                    transform: 'translateX(' + distance + '%)'
                });
            },

            onend: function(e){

                if(e.axis === 'horizontal'){
                    var time = 300,
                        dist = 0,
                        total = _this.slides.total,
                        jump_to = _this.slides.current,
                        velocity = Math.abs(e.velocity.x / _this.slider.offsetWidth) * 100;

                    if(e.direction === 'left'){
                        if(jump_to < total - 1) jump_to++;
                    } else if(e.direction === 'right'){
                        if(jump_to > 0) jump_to--;
                    }

                    dist = -100 * (jump_to / total);
                    dist = Math.abs(dist - _this.slides.xPos);

                    if(dist > .9 * _this.slides.width){
                        jump_to = _this.slides.current;
                    }

                    if(dist > 0) time = dist / velocity;

                    slideTo.call(_this, jump_to, time);
                }
            }

        });
    }

    scope.SliderPanel = panel;

})(window); // Slider panels

(function(scope){

    function touchEvents(elem, events){
        if(elem && events){
            setup.call(this, elem, events);
        }
    }

    function setup(elem, events){
        this.timestamp = null;

        this.elem = elem;

        this.touchObj = getTouchObj();

        this.events = events;

        if(!elem.getAttribute('data-touch-active')){
            elem.addEventListener("touchstart", onTouchStart.bind(this), {passive: true});
            elem.addEventListener("touchmove", onTouchMove.bind(this), {passive: true});
            elem.addEventListener("touchend", onTouchEnd.bind(this), {passive: true});
            elem.setAttribute('data-touch-active', true);
        }
    };

    function getTouchObj(){
        return{
            x: null,
            y: null,
            initialTouch: {
                x: null,
                y: null,
                timestamp: null
            },
            finalTouch: {
                x: null,
                y: null,
                timestamp: null
            },
            delta: {
                x: 0,
                y: 0,
            },
            velocity: {
                x: 0,
                y: 0
            },
            event: null,
            gestureType: null,
            axis: null,
            direction: null
        }
    }

    function onTouchStart(e){
        var touch = e.changedTouches[0],
            obj = this.touchObj;

        obj.x = obj.initialTouch.x = touch.pageX;
        obj.y = obj.initialTouch.y = touch.pageY;
        obj.event = e;

        //this.state.prev_touch.x = touch.pageX;
        //this.state.prev_touch.y = touch.pageY;

        obj.initialTouch.timestamp = this.timestamp = new Date().getTime();

        if(this.events.onstart && typeof this.events.onstart === 'function'){
            this.events.onstart.call(this.elem, obj);
        }
    }

    function onTouchMove(e){
        var touch = e.changedTouches[0],
            obj = this.touchObj,

            delta = {
                x: touch.pageX - obj.x,
                y: touch.pageY - obj.y
            },

            timestamp = new Date().getTime(),

            time = (timestamp - this.timestamp),

            velocity = {
                x: delta.x / time,
                y: delta.y / time
            };

        if(Math.abs(delta.x) > Math.abs(delta.y) && obj.axis !== 'vertical'){

            obj.axis = 'horizontal';

            if(velocity.x > 0){
                obj.direction = 'right';
            } else {
                obj.direction = 'left';
            }

        } else if(obj.axis !== 'horizontal'){

            obj.axis = 'vertical';

            if(velocity.y > 0){
                obj.direction = 'down';
            } else {
                obj.direction = 'up';
            }

        }

        obj.x = touch.pageX;
        obj.y = touch.pageY;
        obj.velocity = velocity;
        obj.delta = delta;
        obj.event = e;

        this.timestamp = new Date().getTime();

        if(this.events.onmove && typeof this.events.onmove === 'function'){
            this.events.onmove.call(this.elem, obj);
        }
    }

    function onTouchEnd(e){
        var touch = e.changedTouches[0],
            obj = this.touchObj;

        obj.finalTouch.x = e.pageX;
        obj.finalTouch.y = e.pageY;
        obj.finalTouch.timestamp = new Date().getTime();

        if(this.events.onend && typeof this.events.onend === 'function'){
            this.events.onend.call(this.elem, obj);
        }

        reset.call(this);
    }

    function reset(){
        this.touchObj = getTouchObj();
    }

    HTMLElement.prototype.addTouchListeners = function(events){
        var _listeners = new touchEvents(this, events);
        return this;
    };

})(window); // Touch Events

(function(scope){

    // Private variables
    var HISTORY = ['entry_point'],
        CLEARSTACK_FLAG = false,
        STATE_DATA = null,
        ON_BEFORE_CHANGE = [];



    // Push/replace state functions

    function pushState(state){

        beforePageChange();

        var obj = getStateObject();

        Helpers.extendDefaults(obj, state);

        HISTORY.push(obj);

        /*
        // If the object has a stateData property, this means that the current
        // screen (before the new one is pushed) has some state information it needs
        // to keep saved
        */
        if(obj.stateData){
            history.replaceState({ state: obj.stateData }, null, null);
        }

        history.pushState({ query_params: obj.queryParams }, '', obj.name);

        obj.onPush();

    }

    function replaceState(state){

        beforePageChange();

        var obj = getStateObject();

        Helpers.extendDefaults(obj, state);

        HISTORY.pop();

        HISTORY.push(obj);

        history.replaceState({}, '', obj.name);

        obj.onPush();

    }

    function getStateObject(){

        var data = null;

        if(STATE_DATA){

            data = JSON.parse(JSON.stringify(STATE_DATA));

            STATE_DATA = null;

        }

        return {
            name: 'screen',
            onPush: null,
            onPop: null,
            onBack: null,
            queryParams: null,
            stateData: data,
            isPopup: false
        }

    }

    function beforePageChange(){

        // This allows controllers to run functions before the page changes

        for(var fn = 0; fn < ON_BEFORE_CHANGE.length; fn++){
            if(typeof ON_BEFORE_CHANGE[fn] === 'function'){
                ON_BEFORE_CHANGE[fn]();
            }
        }

        // Clears the functions after the above loop is completed

        ON_BEFORE_CHANGE.length = 0;

    }



    // Stack and popstate management functions

    function clearStack(){

        CLEARSTACK_FLAG = true;

        history.go(-HISTORY.length);

    }

    window.onpopstate = function(){

        if(!CLEARSTACK_FLAG){

            if(HISTORY.length > 1){

                var last_entry = HISTORY[HISTORY.length - 1],
                    is_popup = last_entry.isPopup,
                    back_entry;

                /*
                // Run the onBack function of the current screen
                */
                last_entry.onBack();
                HISTORY.pop();

                /*
                // Run the onPop function of the previous screen
                */
                back_entry = HISTORY[HISTORY.length - 1];
                back_entry.onPop(is_popup);

            }

        } else {

            /*
            // If history length is greater than 2 then we have to remove entries but last
            */
            if(HISTORY.length > 2){

                HISTORY.splice(0, HISTORY.length - 1);

            }

            /*
            // Reset the clear stack flag
            */
            CLEARSTACK_FLAG = false;

        }

    }



    // Link builders

    function buildLinks(){

        var _length = document.links.length;

        for (var _next = 0; _next < _length; _next++){

            if(!document.links[_next].getAttribute('site-nav')){

                var link = document.links[_next];

                if(link.classList.contains('app-nav')){

                    link.setAttribute('site-nav', true);

                    link.onclick = function(){

                        var qp = false;

                        if(this.getAttribute('data-query')){
                            qp = this.getAttribute('data-query');
                        }

                        ScreenManager.goto(this.getAttribute('data-href'), qp);

                        return false;

                    }

                }

            }

        }

    }

    function buildLink(link){

        if(!link.getAttribute('site-nav')){

            link.setAttribute('site-nav', true);

            link.onclick = function(){

                var qp = false;

                if(this.getAttribute('data-query')){
                    qp = this.getAttribute('data-query');
                }

                ScreenManager.goto(this.getAttribute('data-href'), qp);

                return false;

            }

        }

    }

    function setStateData(obj){

        STATE_DATA = obj;

    }



    // Expose accessible methods

    scope.Router = {

        pushState: pushState,

        replaceState: replaceState,

        clearStack: clearStack,

        setStateData: setStateData,

        buildLinks: buildLinks,

        buildLink: buildLink,

        onBeforePageChange: function(fn){

            ON_BEFORE_CHANGE.push(fn);

        },

        log: function(){ console.log(HISTORY); }

    };

})(window); // Router and history manager

(function(scope){

    var SCREENS = {},
        HISTORY = [],
        EVENTS = {
            ON_SCREEN_LOAD: [],
            ON_SCREEN_KILL: []
        },
        QUERY_PARAMS = null,
        Z_INDEX_COUNTER = 200;



    // Screens class

    function screen(name, opts){

        opts = opts || {};

        this.name = name;
        this.container = createElement('div', 'screen-frame');

        this.defaults = {
            templateURI: null,
            view: document.body,
            templateData: null,
            controller: null, // When screen is added to the view
            onPop: null, // When screen is re-entered via browser history
            onExitFn: null, // Executed before screen is removed from view
            onBackFn: null, // When back is pressed while screen is active
            preserveView: false,
        };

        this.stateData = {};

        this.container.style.zIndex = Z_INDEX_COUNTER++;

        Helpers.extendDefaults(this.defaults, opts)

        return this;

    }

    screen.prototype.push = function(){

        this.load(function(){

            addState.call(this);

            this.onLoad();

        }.bind(this));

    };

    screen.prototype.replace = function(){

        this.load(function(){

            this.onLoad();

            addState.call(this, true);

        }.bind(this));

    };



    screen.prototype.load = function(callback){

        if(this.defaults.templateURI){

            this.loadFromURI(callback);

        } else if(this.defaults.templateData){

            this.loadFromProps(callback);

        }

    };

    screen.prototype.loadFromURI = function(callback){

        var xhr = new XMLHttpRequest(),
            props = this.defaults,
            uri = TEMPLATE_BASE_PATH + props.templateURI;

        xhr.open('GET', uri, true);

        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200 || xhr.status === 0){
                    this.container.innerHTML = xhr.responseText;
                    callback();
                }
            }
        }.bind(this);

        xhr.send();

    };

    screen.prototype.loadFromProps = function(callback){

        var props = this.defaults;

        if(typeof props.templateData === 'object'){

            this.container.appendChild(props.templateData);

        } else {

            this.container.innerHTML = this.defaults.templateData;

        }

        callback();

    };



    function addState(replace){

        var obj = {
            name: this.name,
            onPush: this.runContoller.bind(this),
            onPop: this.onAfterPop.bind(this),
            onBack: this.onBack.bind(this),
            queryParams: QUERY_PARAMS
        }

        if(replace){

            Router.replaceState(obj);

        } else {

            Router.pushState(obj);

        }

    }

    screen.prototype.remove = function(){

        this.container.innerHTML = '';

        this.defaults.view.removeChild(this.container);

    };

    screen.prototype.show = function(){

        this.defaults.view.appendChild(this.container);

    }



    screen.prototype.onLoad = function(){

        this.show();

        Router.buildLinks();

        if(!this.defaults.preserveView){

            if(HISTORY.length > 0){

                var to_remove = HISTORY[HISTORY.length - 1];

                to_remove.remove();

            }

        }

        HISTORY.push(this);

    };

    screen.prototype.onAfterPop = function(via_popup){

        if(!via_popup){

            // Last screen was NOT a popup. So running controllers

            if(HISTORY.length > 0){

                HISTORY.pop();

            }

            this.load(function(){

                this.show();

                Router.buildLinks();

                this.runContoller();

            }.bind(this));

        } else {

            // console.log('on after pop, via popup')

            // Last screen was a popup, do nothing

        }

    };

    screen.prototype.runContoller = function(){

        var props = this.defaults;

        if(typeof props.controller === 'function'){

            props.controller.call(this);

        }

        for(var i = 0; i < EVENTS.ON_SCREEN_LOAD.length; i++){

            EVENTS.ON_SCREEN_LOAD[i].call(this);

        }

    };

    screen.prototype.onBack = function(){

        if(typeof this.defaults.onBackFn === 'function'){

            this.defaults.onBackFn();

        }

        if(typeof this.defaults.onExitFn === 'function'){

            this.defaults.onExitFn(function(){

                this.remove();

            }.bind(this));

        } else {

            this.remove();

        }

    };



    function goto(name, qp){

        if(HISTORY[HISTORY.length - 1].name === name){

            return;

        }

        if(qp){
            QUERY_PARAMS = qp;
        } else {
            QUERY_PARAMS = null;
        }

        if(SCREENS.hasOwnProperty(name)){

            var _screen = SCREENS[name];

            _screen.push();

        }

    };

    function gotoAndReplace(name, qp){

        if(qp){
            QUERY_PARAMS = qp;
        } else {
            QUERY_PARAMS = null;
        }

        if(SCREENS.hasOwnProperty(name)){

            var _screen = SCREENS[name];

            _screen.replace();

        }

    };



    // Private functions

    function add(name, opts){

        if(checkDuplicate(name)){

            throw '"' + name + '" already exists';
            return null;

        } else {

            var S = new screen(name, opts);
            SCREENS[name] = S;

        }

    };

    function create(opts){

        return new screen('temp', opts);

    }

    function checkDuplicate(name){
        for(var i in SCREENS){
            if(SCREENS.hasOwnProperty(name)){
                return true;
            }
        }
        return false;
    }

    function firstRun(fn){

        fn();

    };



    scope.ScreenManager = {

        run: firstRun,

        addScreen: add,

        create: create,

        goto: goto,

        gotoAndReplace: gotoAndReplace,

        addLoadEvent: function(fn){

            if(typeof fn === 'function'){

                EVENTS.ON_SCREEN_LOAD.push(fn);

            }

        },

        addUnloadEvent: function(fn){

            if(typeof fn === 'function'){

                EVENTS.ON_SCREEN_KILL.push(fn);

            }

        },

        history: HISTORY

    };

})(window); // Screen manager

(function(scope){

    /*
    // storename
    // date
    // time
    // datetime
    //
    // items
    // -name
    // -unitprice
    // -quantity
    // -totalprice
    //
    // itemscount
    // receipttotal
    // tax
    // nettotal
    // currency
    //
    */

    /*
    // Distinguishing factors for each type of receipt
    //
    // Unicenta
    // Item quantitiy starts with an 'x' followed by a number. Ex.: 'x2', 'x6'
    //
    //
    //
    */

    var rules = [
        {
            // Date
            pattern: /(\d{1,2})\s?(\/|\.|-)\s?(\d{1,2}|\w{2,})\s?(\/|\.|-)\s?(\d{2,4})/g,
            fn: setdate
        },
        {
            // Time
            pattern: /(\d{2})\s?:{1}\s?(\d{2})\s?(am|pm|AM|PM|Am|Pm)?/g,
            fn: setTime
        },
        {
            // Price
            pattern: /-?(\$|€|£|�| )?\d+(\.|,)\d{1,2}\s/g,
            fn: setItem
        },
        {
            // Line division
            pattern: /(---|===){3,}/g,
            fn: onLineDivision
        },
        {
            // Total etc.
            pattern: /cash|(sub)?total|nett?|tax(es)?|fare|send|gst/g
        },
        {
            pattern: /./g,
            fn: setLines
        }
    ];

    function parser(stream, type){

        var _lowercase_stream = stream.toLowerCase(),

            // Remove all illegal characters
            _lines = stream.replace(/\n\s*\n/g, '\n');
            //_lines = stream.replace(/[^a-zA-Z0-9 *$€£#@©&%:=,\/\\\n \.\-\(\)]/g, '');
            //_lines = stream.replace(/[^a-zA-Z0-9 *$€£#@©&%:=,\/\\\n \.\-\(\)]/g, '\n');

        //_lines = _lines.replace(/\n+/g, '\n')
        _lines = _lines.split('\n');

        this.stream = stream;
        this.lines = _lines;
        this.props = {
            date: null,
            time: null,
            items: [],
            total: 0,
            tax: 0,
            keyvalues: [],
            lines: []
        };

        for(var i = 0; i < this.lines.length; i++){

            var line = this.lines[i];

            for(var r = 0; r < rules.length; r++){

                var rule = rules[r];

                if(line.match(rule.pattern)){
                    if(typeof rule.fn === 'function'){
                        rule.fn.call(this, line);
                    }
                }

            };

        }

        return this;

    }

    parser.prototype.getData = function(){
        return this.props;
    };

    function onLineDivision(text){

    }

    function setdate(line){
        var pattern = rules[0].pattern;
        this.props.date = line.match(pattern)[0];
    }

    function setTime(line){
        var pattern = rules[1].pattern;
        this.props.time = line.match(pattern)[0];
    }

    function setItem(lineitem){

        if(rules[4].pattern.test(lineitem.toLowerCase())){
            setTotal.call(this, lineitem);
            return;
        }

        var line = lineitem.trim().replace(/ +/g, ' '),

            item = {
                amount: null,
                name: '',
                quantity: 0,
                unit_price: null
            },

            tokens = line.split(' ');

        for(var i = 0; i < tokens.length; i++){

            var token = tokens[i];

            if(/-?(\$|€|£|�| )?\d+(\.|,)\d{1,2}/.test(token)){

                // token appears to be a cost
                if(item.unit_price == null){

                    item.unit_price = token;

                } else if(item.amount == null){

                    item.amount = token;

                }

            } else if(/^.?\d+$/.test(token)){

                // token appears to be a number, hence quantity
                token = token.replace(/\D/g, '');
                item.quantity = parseInt(token);

            } else if(/^\w+/.test(token)){

                item.name += token + ' ';

            }

        }

        if(item.amount == null){
            item.amount = item.unit_price;
        }

        if(item.quantity > 1 && item.amount === item.unit_price){
            item.unit_price = parseFloat(item.amount) / item.quantity;
        }

        this.props.items.push(item);

    }

    function setTotal(lineitem){

        var line = lineitem.toLowerCase(),
            p_total = /cash|(sub)?total|nett?|fare|send/g,
            p_tax = /tax(es)?|gst/g;

        if(p_total.test(line)){
            this.props.total = line.match(rules[2].pattern)[0];
        }

        if(p_tax.test(line)){
            this.props.tax = line.match(rules[2].pattern)[0];
        }

        // cash|(sub)?total|nett?|tax(es)?|fare

        // /tax(es)?/g
        // /total/g
        // /nett?/g
        // /cash/g
        // subtotal
        // fare

    }

    function setLines(lineitem){

        var kv_pattern = /.+?:/,
            line = lineitem.trim();

        if(kv_pattern.test(line)){
            var key = kv_pattern.exec(line)[0].replace(':', ''),
                val = line.substring(key.length + 1, line.length).trim(),
                obj = {
                    key: key,
                    value: val
                };

            this.props.keyvalues.push(obj);

        } else {
            this.props.lines.push(line);
        }

    }

    scope.Parser = parser

})(window); // Parsers

/*
* Receipt parser code
*/
(function(scope){

    // Line types
    //  - general
    //  - keyvalue
    //  - table head
    //  - separator
    //  - item
    //    - name
    //    - price
    //    - quantity
    //    - amount
    //  - total
    //  - tax
    //  - header_content
    //  - footer_content

    // Criterias
    // () - Optional but if exists then certain
    //
    // For total and tax
    // keyvalue + cost_line + (after (2nd) separator)
    // Run regex for each - total and tax
    //
    // For items
    // cost_line + (after (1st) separator)
    // Run regex to break it down
    //
    // For header
    // general + (before (1st) separator)
    // No regex necessary
    //
    // For keyvalues
    // keyvalue
    // Regex to check if actual key value pair
    //
    // For separators
    // separator
    // Straight forward
    //

    /*
    * Regex rules to identify types of lines.
    * Parser goes through each line and tries to identify what type of line it is.
    * Each line can have multiple type of matches. Based on the combination of matches, a final line type is deduced.
    */
    var RULES = {
        separator:  /^[ =\-]+$/,
        cost_line: /^.*\d+(\.|,)\d{2} *$/,
        keyvalue: /^.+:.+$/,
        table_head_unicenta: /^ *items? +price +(qty|quantity) +val(ue)? *$/i,
        table_head_posbill: /^ *(qty.?|quantity) +items? +price +total *$/i
    };

    /*
    * Function accepts an input stream (type: string) of data which is NOT base64 encoded
    * Data sent to this function is decoded when retrieved from the server
    */
    function parser(stream){

        /*
        *
        */
        var _stream = stream.replace(/[^€£\x00-\x7F]/g, ' '),
            _lines = _stream.replace(/\n\s+\n/g, '\n');

        _lines = _lines.split('\n');

        this.stream = stream;
        this.parsed_lines = [];
        this.total = null;
        this.taxes = [];

        parse.call(this, _lines);

        return this;

    }

    parser.prototype.getData = function(){
        return {
            total: this.total,
            taxes: this.taxes,
            lines: this.parsed_lines,
        }
    };

    function parse(lines){

        var computed_lines = [],
            flags = {
                separator_count: 0,
                stage: 0, // [0 = Header start], [1 = List item start], [2 = footer start]
                general_in_cost_line: []
            };

        for(var i = 0; i < lines.length; i++){

            var line = lines[i].trim(),
                types = [],
                add_general = true;

            for(var r in RULES){

                if(RULES[r].test(line)){

                    types.push(r);
                    add_general = false;

                }

            }

            if(add_general) types.push('general');

            computed_lines.push({
                line: lines[i], // Not adding trimmed lines, as they're needed for further parsing
                types: types
            });

        }

        for(j = 0; j < computed_lines.length; j++){

            var line = computed_lines[j];

            if(flags.stage === 0){

                // [general] and [keyvalue] checks until we encounter a [separator]

                if(line.types.indexOf('keyvalue') != -1){

                    var kv_pattern = /^(.+?):(.+)$/,
                        key = '',
                        val = '',
                        _line = line.line.trim();

                    _line.replace(kv_pattern, function(){
                        key = arguments[1].trim();
                        val = arguments[2].trim();
                    });

                    this.parsed_lines.push({
                        type: 'keyvalue',
                        data: {
                            key: key,
                            val: val
                        }
                    });

                } else if(line.types.indexOf('general') != -1){

                    var is_center = false;
                    if(/^ {4}/.test(line.line)) is_center = true;

                    this.parsed_lines.push({
                        type: 'general' + (is_center ? '_center' : ''),
                        data: line.line.trim()
                    });

                } else if(line.types.indexOf('separator') != -1){

                    flags.separator_count++;
                    flags.stage++;

                    this.parsed_lines.push({
                        type: 'separator',
                        data: line.line
                    });

                }

            } else if(flags.stage === 1){

                if(line.types.indexOf('cost_line') != -1){

                    var _line = line.line.trim(),
                        _line2 = _line.replace(/ +/g, ' '),
                        price_regex = /^.\d+(\.|,)\d{2}$/,
                        qty_regex = /^(x|-)\d+$/,
                        name = '',
                        item = {
                            name: '',
                            cost: 0,
                            quantity: 0,
                            unit_cost: null
                        },
                        tokens = _line2.split(' ');

                    if(flags.general_in_cost_line.length > 0){

                        item.name += computed_lines[flags.general_in_cost_line[0]].line + ' ';

                        flags.general_in_cost_line = [];

                    }

                    for(var x = 0; x < tokens.length; x++){

                        var token = tokens[x];

                        if(x === tokens.length - 1){

                            item.cost = token;

                        } else {

                            if(item.unit_cost == null && price_regex.test(token)){

                                item.unit_cost = token;

                            } else {

                                item.name += token + ' ';

                            }

                        }

                    }

                    this.parsed_lines.push({
                        type: 'cost_line',
                        data: item
                    });

                } else if(line.types.indexOf('general') != -1){

                    flags.general_in_cost_line.push(j);

                    /*this.parsed_lines.push({
                        type: 'general',
                        data: line.line
                    });*/

                } else if(line.types.indexOf('separator') != -1){

                    if(flags.general_in_cost_line.length > 0){

                        for(var g = 0; g < flags.general_in_cost_line.length; g++){

                            this.parsed_lines.push({
                                type: 'general',
                                data: computed_lines[flags.general_in_cost_line[g]].line
                            });

                        }

                        flags.general_in_cost_line = [];

                    }

                    flags.separator_count++;
                    flags.stage++;

                    this.parsed_lines.push({
                        type: 'separator',
                        data: line.line
                    });

                }

            } else if(flags.stage === 2){

                if(line.types.indexOf('cost_line') != -1){

                    var pattern = /(.+)([ $€£]\d+(\.|,)\d{2})$/,
                        name = '',
                        cost = '',
                        _line = line.line.trim(),
                        is_total = false;

                    _line.replace(pattern, function(){
                        name = arguments[1].trim();
                        cost = arguments[2].trim();
                    });

                    if(/total/i.test(name) && this.total == null){
                        this.total = cost;
                        is_total = true;
                    }

                    if(/tax/i.test(name)){
                        this.taxes.push({
                            name: name,
                            tax: cost
                        });
                    }

                    this.parsed_lines.push({
                        type: 'footer_cost_line' + (is_total ? '_with_total' : ''),
                        data: {
                            left: name,
                            right: cost
                        }
                    });

                } else if(line.types.indexOf('general') != -1){

                    var is_center = false;
                    if(/^ {4}/.test(line.line)) is_center = true;

                    this.parsed_lines.push({
                        type: 'general' + (is_center ? '_center' : ''),
                        data: line.line.trim()
                    });

                } else if(line.types.indexOf('separator') != -1){

                    this.parsed_lines.push({
                        type: 'separator',
                        data: line.line
                    });

                } else if(line.types.indexOf('keyvalue') != -1){

                    var kv_pattern = /^(.+?):(.+)$/,
                        key = '',
                        val = '',
                        _line = line.line.trim();

                    _line.replace(kv_pattern, function(){
                        key = arguments[1].trim();
                        val = arguments[2].trim();
                    });

                    this.parsed_lines.push({
                        type: 'keyvalue',
                        data: {
                            key: key,
                            val: val
                        }
                    });

                }

            }

        }

    }



    scope.ParserV2 = parser;

})(window); // Parsers
