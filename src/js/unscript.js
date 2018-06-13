window.onload = function(){
    
    var Controllers = Object.create(null),
        View = document.getElementById('app-main-view'),
        Modules = {};
    
    /*
	(function(){
        
        var panel = document.getElementById('app-drawer-panel'),
            overlay = panel.getElementsByClassName('app-drawer-overlay')[0],
            slider = panel.getElementsByClassName('app-drawer-slider')[0],
            back = document.getElementById('drawer-back'),
            maxX = 0,
            minX = -320;
        
        slider.addEventListener('click', function(e){
            e.stopPropagation();
            if(panel.classList.contains('active')) { close(); }
        });
        
        slider.children[0].addEventListener('click', function(e){
            e.stopPropagation();
        });
        
        overlay.addEventListener('click', function(e){
            close();
        });
        
        panel.addEventListener('click', function(e){
            e.stopPropagation();
        });
        
        slider.addTouchListeners({
            
            onstart: function(e){
                slider.CSS({
                    transition: 'none'
                });
                overlay.CSS({
                    transition: 'none'
                });
            },
            
            onmove: function(e){
                if(e.axis === 'vertical') return;
                
                var currentX = slider.get2DTransforms().x,
                    moveBy = e.delta.x + currentX,
                    range = 0;
                
                if(moveBy > maxX) moveBy = maxX;
                if(moveBy < minX) moveBy = minX;
                
                range = 1 - MathHelper.range(minX, maxX, moveBy);
                overlay.style.opacity = range;
                
                slider.CSS({
                    transform: 'translateX(' + moveBy + 'px)'
                });
            },
            
            onend: function(e){
                var currentX = slider.get2DTransforms().x,
                    range = 1 - MathHelper.range(minX, maxX, currentX);
                
                if(e.axis === 'horizontal'){
                    var time = 300,
                        velocity = Math.abs(e.velocity.x),
                        dist = 0,
                        to = 0;
                    
                    if(e.direction === 'right'){
                        dist = Math.abs(maxX - currentX);
                        to = 0;
                    } else {
                        dist = Math.abs(minX - currentX);
                        to = minX;
                    }
                    
                    time = dist / velocity;
                    
                    slideTo(to, time);
                    
                }
            }
            
        });
        
        back.onclick = close;
        
        function open(){
            slideTo(maxX, 300);
        }
        
        function close(){
            slideTo(minX, 300);
        }
        
        function slideTo(to, time){
            
            slider.animation().slide({
                to: to,
                duration: time
            });
            
            to = to === 0 ? 1 : 0;
            
            overlay.animation().fade(to, {
                duration: time
            });
        }
        
        window.AppDrawer = {
            open: open,
            close: close
        };
        
    })(); // App Drawer
    */
    
    (function(){
        
        var elems_y = Array.prototype.slice.call(document.getElementsByClassName('verticle-scroll-hide'));
        
        for(let i = 0; i < elems_y.length; i++){
            
            let parent = elems_y[i],
                elem = parent.children[0];
            
            HideScrollBar(elem);
            
        }
        
        /*
        var elems_x = Array.prototype.slice.call(document.getElementsByClassName('sliding-fill'));
        
        for(let i = 0; i < elems_x.length; i++){
            
            let elem = elems_x[i];
            
            HideScrollBar(elem, true);
            
        }
        */
        
    })(); // Hide scrollbars
    
    Controllers.HOME = function(){
        
        View.innerHTML = document.getElementById('home-template').innerHTML;
        
        var contentArea = View.getElementsByClassName('app-content')[0],
            sliderPanel = new SliderPanel(),
            hmbgr = document.getElementById('hamburger-icon'),
            
            cards,
            detailScreen = View.getElementsByClassName('for-content')[0],
            detailArea = detailScreen.getElementsByClassName('content-area')[0];
        
        sliderPanel.add(document.getElementById('receipt-data').innerHTML, 'Receipts');
        sliderPanel.add('<h2 class="padded-20">Offers!!!</h2>', 'Offers');
        
        sliderPanel.appendTo(contentArea);
        
        hmbgr.onclick = AppDrawer.open;
        
        // Cards and actions
        
        cards = Array.prototype.slice.call(contentArea.getElementsByClassName('receipt-card'));
        
        for(var i = 0; i < cards.length; i++){
            var receipt = cards[i];
            
            receipt.addEventListener('click', function(){
                openDetailsScreen();
            });
        }
        
        function openDetailsScreen(){
            var template = document.getElementById('receipt-template');
            detailArea.innerHTML = template.innerHTML;
            
            detailScreen.CSS({
                transform: 'translateX(0%)'
            });
        }
        
        detailScreen.addTouchListeners({
            
            onstart: function(e){
                detailScreen.CSS({
                    transition: 'none'
                });
            },
            
            onmove: function(e){
                if(e.axis === 'vertical') return;
                
                var currentX = 100 * detailScreen.get2DTransforms().x / detailScreen.offsetWidth,
                    deltaX = 100 * e.delta.x / detailScreen.offsetWidth,
                    moveBy = currentX + deltaX;
                
                if(moveBy > 100) moveBy = 100;
                if(moveBy < 0) moveBy = 0;
                
                detailScreen.CSS({
                    transform: 'translateX(' + moveBy + '%)'
                });
            },
            
            onend: function(e){
                if(e.axis === 'horizontal'){
                    var currentX = 100 * detailScreen.get2DTransforms().x / detailScreen.offsetWidth,
                        time = 300,
                        velocity = 100 * Math.abs(e.velocity.x) / detailScreen.offsetWidth,
                        dist = 0,
                        to = 0;
                    
                    if(e.direction === 'right'){
                        dist = Math.abs(100 - currentX);
                        to = 100;
                    } else {
                        dist = Math.abs(0 - currentX);
                        to = 0;
                    }
                    
                    time = dist / velocity;
                    
                    detailsScreenSlide(to, time);
                }
            }
            
        });
        
        function detailsScreenSlide(to, time){
            if(time > 500) time = 500;
            
            detailScreen.CSS({
                transition: 'all ' + time + 'ms ease'
            });
            
            detailScreen.CSS({
                transform: 'translateX(' + to + '%)'
            });
            
            setTimeout(function(){
                detailScreen.CSS({
                    transition: 'all .3s ease'
                });
            }, time + 10);
        }
        
    };
    
    (function(){
        
        ScreenManager.addScreen('app-home',{
            name: 'app-home',
            pathname: '/app-home',
            templateURI: '/partials/app-home.html',
            view: View,
            preloadFn: function(callback){
                
                var xhr = new XMLHttpRequest(),
                    uri = location.origin + '/partials/temp-receipts.html';
                
                xhr.open('GET', uri, true);
                
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4){
                        if(xhr.status === 200 || xhr.status === 0){
                            
                            this.data.html = xhr.responseText;
                            callback();
                            
                        }
                    }
                }.bind(this);
                
                xhr.send();
                
            },
            enter_anim: 'fadeIn',
            exit_anim: 'slideOutRight',
            controller: function(){
                var list = document.getElementById('receipts-list'),
                    sliderPanel = new SliderPanel(),
                    cards;
                
                sliderPanel.add(this.data.html, 'Receipts');
                sliderPanel.add('<h2 class="padded-20">Offers!!!</h2>', 'Offers');
                
                sliderPanel.appendTo(list);
                
                Modules.AppDrawer.initialize();
                
                cards = Array.prototype.slice.call(list.getElementsByClassName('receipt-card'));
                
                for(var i = 0; i < cards.length; i++){
                    var receipt = cards[i];

                    receipt.addEventListener('click', function(){
                        openDetailsScreen();
                    });
                }

                function openDetailsScreen(){
                    ScreenManager.goto('single-receipt');
                }
                
            }
        });
        
        ScreenManager.addScreen('single-receipt',{
            name: 'single-receipt',
            pathname: '/single-receipt',
            templateURI: '/partials/single-receipt.html',
            view: View,
            enter_anim: 'slideInLeft',
            exit_anim: 'slideOutRight'
        });
        
    })();
    
    Modules.AppDrawer = (function(){
        
        function checkDrawer(){
            
            var panel = document.getElementById('app-drawer-panel'),
                overlay = panel.getElementsByClassName('app-drawer-overlay')[0],
                slider = panel.getElementsByClassName('app-drawer-slider')[0],
                back = document.getElementById('drawer-back'),
                maxX = 0,
                minX = -320;
            
            slider.addEventListener('click', function(e){
                e.stopPropagation();
                if(panel.classList.contains('active')) { close(); }
            });
            
            slider.children[0].addEventListener('click', function(e){
                e.stopPropagation();
            });
            
            overlay.addEventListener('click', function(e){
                close();
            });
            
            panel.addEventListener('click', function(e){
                e.stopPropagation();
            });
            
            slider.addTouchListeners({
                
                onstart: function(e){
                    slider.CSS({
                        transition: 'none'
                    });
                    overlay.CSS({
                        transition: 'none'
                    });
                },
                
                onmove: function(e){
                    if(e.axis === 'vertical') return;
                    
                    var currentX = slider.get2DTransforms().x,
                        moveBy = e.delta.x + currentX,
                        range = 0;
                    
                    if(moveBy > maxX) moveBy = maxX;
                    if(moveBy < minX) moveBy = minX;
                    
                    range = 1 - MathHelper.range(minX, maxX, moveBy);
                    overlay.style.opacity = range;
                    
                    slider.CSS({
                        transform: 'translateX(' + moveBy + 'px)'
                    });
                },
                
                onend: function(e){
                    var currentX = slider.get2DTransforms().x,
                        range = 1 - MathHelper.range(minX, maxX, currentX);
                    
                    if(e.axis === 'horizontal'){
                        var time = 300,
                            velocity = Math.abs(e.velocity.x),
                            dist = 0,
                            to = 0;
                        
                        if(e.direction === 'right'){
                            dist = Math.abs(maxX - currentX);
                            to = 0;
                        } else {
                            dist = Math.abs(minX - currentX);
                            to = minX;
                        }
                        
                        time = dist / velocity;
                        
                        slideTo(to, time);
                        
                    }
                }
                
            });
            
            back.onclick = close;
            
            function open(){
                slideTo(maxX, 300);
            }
            
            function close(){
                slideTo(minX, 300);
            }
            
            function slideTo(to, time){
                
                slider.animation('slide', {
                    to: to,
                    duration: time
                });
                
                to = to === 0 ? 1 : 0;
                
                overlay.animation('fade', {
                    to: to,
                    duration: time
                });
            }
            
        }
        
        return {
            
            initialize: checkDrawer
            
        }
        
    })();
    
    ScreenManager.run();
    
};

(function(scope){
    
    var pages = [],
        events = {
            onload: [],
            onBeforeContentUnload: [],
            onBeforePageChange: []
        },
        isAndroid = navigator.userAgent.match(/android/gi),
        androidPathFix = '/android_asset/www';
    
    function goto(name, opts){
        
        var _found = null,
            _route = null;
        
        for(var i = 0; i < this.pages.length; i++){
            var _name = this.pages[i].name;
            
            if(_name === name){
                _found = i;
                break;
            }
        }
        
        if(opts.clearBackStack){
            var _length = history.length;
            history.go(_length - 1);
            history.replaceState({}, '', _route[_found].pathname);
        }
        
    }
    
    function route(obj){
        this.templateURI = obj.templateURI || null;
        this.view = obj.view || document.body;
        this.pathname = obj.pathname || '';
        this.redirection = obj.redirection || null;
        this.search = obj.search || "";
        this.hash = obj.hash || "";
        this.preloadFn = obj.preloadFn || null;
        this.controller = obj.controller || null;
        this.data = obj.data || {};
        this.name = obj.name || this.pathname;
        
        if(isAndroid){
            this.templateURI = androidPathFix + this.templateURI;
            this.pathname = androidPathFix + this.pathname;
        }
    }
    
    route.prototype.loadTemplate = function(){
        var xhr = new XMLHttpRequest(),
            uri = this.templateURI;
        
        xhr.open('GET', uri, true);
        
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200 || xhr.status === 0){
                    this.view.innerHTML = xhr.responseText;
                }
            }
        }.bind(this);
        
        xhr.send();
    };
    
    scope.Router = {
        
        addPage: function(obj){
            var r = new route(obj);
            pages.push(r);
        },
        
        goto: goto,
        
        clearBackStack: function(){
            
        }
        
    };
    
})(window); // Router


// Create your own implementation of browser back and backstack and do not
// rely on html5 pushstate solely


(function(scope){
    
    var screen_id = 0,
        screens = {},
        backstack = [],
        isAndroid = navigator.userAgent.match(/android/gi),
        //_root = isAndroid ? '/android_asset/www' : '/';
        _root = isAndroid ? '' : '';
    
    
    
    // Screens class and member functions
    
    function Screen(opts){
        screen_id++;
        
        this.id = screen_id;
        this.name = opts.name || 'path-name-' + screen_id;;
        this.pathname = opts.pathname || '/path-id-' + screen_id;
        this.container = createElement('div', 'app-screen');
        this.templateURI = opts.templateURI || null;
        this.view = opts.view || document.body;
        this.preloadFn = opts.preloadFn || null;
        this.controller = opts.controller || null;
        this.is_popup = opts.is_popup || false;
        this.query_string = opts.query_string || "";
        this.data = opts.data || {};
        
        this.enter_anim = opts.enter_anim || false;
        this.exit_anim = opts.exit_anim || false;
        
        if(isAndroid){
            this.pathname = location.origin + _root + this.pathname;
            this.templateURI = location.origin + _root + this.templateURI;
        }
    };
    
    Screen.prototype.loadTemplate = function(browser_back){
        
        var xhr = new XMLHttpRequest(),
            uri = this.templateURI;
        
        xhr.open('GET', uri, true);
        
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200 || xhr.status === 0){
                    
                    this.container.innerHTML = xhr.responseText;
                    this.view.appendChild(this.container);
                    
                    if(this.controller){
                        this.controller.call(this);
                    }
                    
                    if(browser_back){
                        if(this.exit_anim){
                            this.container.animation(this.exit_anim);
                        }
                    } else {
                        if(this.enter_anim){
                            this.container.animation(this.enter_anim);
                        }
                    }
                    
                }
            }
        }.bind(this);
        
        if(typeof this.preloadFn === 'function'){
            
            var promise = new Promise((resolve, reject) => {
                this.preloadFn.call(this, resolve);
            });
            
            promise.then(function(){
                xhr.send();
            });
            
        } else {
            
            xhr.send();
            
        }
        
    };
    
    
    
    
    // Private methods
    
    function addScreen(name, opts){
        var _screen = new Screen(opts);
        screens[name] = _screen;
    }
    
    function checkPath(browser_back){
        var pathname = location.pathname,
            _screen;
        
        if(pathname === '/'){
            
        } else {
            for(var s in screens){
                if(screens[s].pathname === '/'){
                    continue;
                }
                console.log(screens[s].pathname);
                if(screens[s].pathname.match(pathname)){
                    _screen = screens[s];
                }
            }
        }
        console.log(pathname);
        loadPath(_screen, browser_back);
    }
    
    function loadPath(name, browser_back, clearStack){
        var _screen = screens[name];
        if(_screen.templateURI){
            _screen.loadTemplate();
        }
        if(clearStack){
            var _length = history.length;
            history.go(_length - 1);
            history.replaceState({}, '', _screen.pathname);
        } else {
            if(!browser_back){
                history.pushState({}, '', _screen.pathname);
            }
        }
    }
    
    function clearBackStack(){
        
    }
    
    function firstRun(){
        var splash = document.getElementById('app-splash');
        
        /*splash.animation('fadeOut', {
            duration: 300,
            onend: function(){
                this.parentNode.removeChild(this);
            }
        });
        */
        
        window.onpopstate = function(){
            checkPath(true);
        };
        
        loadPath('app-home');
    }
    
    
    
    // Public methods
    
    scope.ScreenManager = {
        
        addScreen: addScreen,
        
        run: firstRun,
        
        goto: loadPath
        
    };
    
})(window); // Screen buffer/manager

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
    
    HTMLElement.prototype.animation = function(name, opts){
        var a = new elementAnim(name, opts);
        a.run.call(this);
    };
    
    function elementAnim(name, opts){
        
        function animate(prop, opts){
            var opts = opts || {},
                timing_function = opts.timing_function || 'ease',
                duration = opts.duration || 300,
                max_duration = opts.max_duration || 500,
                onstart = opts.onstart || null,
                onend = opts.onend || null,
                css = prop || {};
            
            
            // Set a max time limit if duration is too long
            if(duration > max_duration) duration = max_duration;
            
            
            // Reset any existing trnasition property
            /*this.CSS({
                transition: 'none'
            });*/
            
            
            // Execute transition start callback
            if(typeof onstart === 'function') onstart.call(this);
            
            
            // Setup styles
            this.CSS({
                transition: 'all ' + duration + 'ms ' + timing_function
            })
            //css['transition'] = 'all ' + duration + 'ms ' + timing_function;
            
            
            // Set css properties and start the transition
            setTimeout(function(){
                this.CSS(css);
            }.bind(this), 10);
            
            
            // Reset transitions and execute end transition callback
            setTimeout(function(){
                /*this.CSS({
                    transition: 'none'
                });*/
                if(typeof onend === 'function') onend.call(this);
            }.bind(this), duration + 10);
        }
        
        function run(){
        switch(name){
                
            case 'slide':
                
                var unit = opts.unit || 'px',
                    axis = opts.axis || 'X',
                    to = opts.to,
                    prop = {};
                
                prop['transform'] = 'translate' + axis + '(' + to + unit + ')';
                
                animate.call(this, prop, opts);
                
                break;
                
            case 'slideInLeft':
                
                this.CSS({transform: 'translateX(100%)'});
                animate.call(this, {transform: 'translateX(0%)'}, opts);
                
                break; 
                
            case 'slideOutLeft':
                this.CSS({transform: 'translateX(0%)'});
                animate.call(this, {transform: 'translateX(-100%)'}, opts);
                break;
                
            case 'slideInRight':
                this.CSS({transform: 'translateX(-100%)'});
                animate.call(this, {transform: 'translateX(0%)'}, opts);
                break;    
                
            case 'slideOutRight':
                this.CSS({transform: 'translateX(0%)'});
                animate.call(this, {transform: 'translateX(100%)'}, opts);
                break;
                
            case 'fade':
                animate.call(this, {opacity: opts.to}, opts);
                break; 
                
            case 'fadeOut':
                this.style.opacity = 1;
                animate.call(this, {opacity: 0}, opts);
                break;   
                
            case 'fadeIn':
                this.style.opacity = 0;
                animate.call(this, {opacity: 1}, opts);
                break;
                
           }
        }
        /*
        return {
            
            //
            // Generic slide to a value animation
            //
            slide: function(data, opts){
                var unit = data.unit || 'px',
                    axis = data.axis || 'X',
                    to = data.to,
                    prop = {};
                
                prop['transform'] = 'translate' + axis + '(' + to + unit + ')';
                opts = opts || {};
                
                animate.call(this, prop, opts);
            }.bind(this),
            
            
            //
            // Slide X from 100% to 0
            //
            slideInLeft: function(opts){
                this.CSS({transform: 'translateX(100%)'});
                animate.call(this, {transform: 'translateX(0)'}, opts);
            }.bind(this),
            
            
            //
            // Slide X from 0 to 100%
            //
            slideOutLeft: function(opts){
                this.CSS({transform: 'translateX(0)'});
                animate.call(this, {transform: 'translateX(100%)'}, opts);
            }.bind(this),
            
            
            //
            // Slide X from -100% to 0
            //
            slideInRight: function(opts){
                this.CSS({transform: 'translateX(-100%)'});
                animate.call(this, {transform: 'translateX(0)'}, opts);
            }.bind(this),
            
            
            //
            // Slide X from 0 to -100%
            //
            slideOutRight: function(opts){
                this.CSS({transform: 'translateX(0)'});
                animate.call(this, {transform: 'translateX(-100%)'}, opts);
            }.bind(this),
            
            
            //
            // Generic fade to a value animation
            //
            fade: function(opacity, opts){
                animate.call(this, {opacity: opacity}, opts);
            }.bind(this),
            
            
            //
            // Fade from opacity 1 to 0
            //
            fadeOut: function(opts){
                this.style.opacity = 1;
                animate.call(this, {opacity: 0}, opts);
            }.bind(this),
            
            
            //
            // Fade from opacity 0 to 1
            //
            fadeIn: function(opts){
                this.style.opacity = 0;
                animate.call(this, {opacity: 1}, opts);
            }.bind(this)
            
        };
        */
        
        return {
            run: run
        }
        
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
            this.events.onstart(obj);
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
            this.events.onmove(obj);
        }
    }
    
    function onTouchEnd(e){
        var touch = e.changedTouches[0],
            obj = this.touchObj;
        
        obj.finalTouch.x = e.pageX;
        obj.finalTouch.y = e.pageY;
        obj.finalTouch.timestamp = new Date().getTime();
        
        if(this.events.onend && typeof this.events.onend === 'function'){
            this.events.onend(obj);
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
    
    var requests = [],
        API_BASE = "";
    
    function get(obj){

        var xhr = new XMLHttpRequest(),
            params = obj.params === undefined ? '' : Core.Helpers.Parameters.serialize(obj.params),
            _session = JSON.parse(localStorage.getItem('sessionv2')),
            success = obj.success || undefined,
            failure = obj.error || undefined;

        if(params !== '') params = '?' + params;

        xhr.open('GET', API_BASE + obj.path + params, true);

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
            params = obj.params === undefined ? '' : Core.Helpers.Parameters.serialize(obj.params),
            _session = JSON.parse(localStorage.getItem('sessionv2')),
            success = obj.success || undefined,
            failure = obj.error || undefined;

        xhr.open(method, API_BASE + obj.path, true);

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

    var barWidth = 0;
    
    scope.HideScrollBar = function(elem, hideX){
        
        hide(elem, hideX);
        
    };
    
    function hide(elem, hideX){
        
        var parent = elem.parentNode;
        
        barWidth = getBarWidth();
        
        if(hideX){
            
            elem.style.overflowX = 'scroll';
            elem.style.height = parent.offsetHeight + barWidth + 'px';
            
            setTimeout(function(){
                if(elem.offsetHeight < parent.offsetHeight + barWidth){
                    hide(elem, hideX);
                }
            }, 20);
            
        } else {
            
            elem.style.overflowY = 'scroll';
            elem.style.width = parent.offsetWidth + barWidth + 'px';
            
            setTimeout(function(){
                if(elem.offsetWidth < parent.offsetWidth + barWidth){
                    hide(elem, hideX);
                }
            }, 20);
            
        }
        
    }
    
    function getBarWidth(){
        
        var _p = document.createElement('div'),
            _c = document.createElement('div'),
            _w = 0;
        
        _p.style.width = '50px';
        _p.style.height = '50px';
        _p.style.top = '-50px';
        _p.style.left = '-50px';
        _p.style.overflow = 'scroll';
        _p.style.position = 'fixed';
        
        _c.style.width = '100%';
        _c.style.height = '100px';
        
        _p.appendChild(_c);
        
        document.body.appendChild(_p);
        
        _w = _c.offsetWidth - 50;
        
        document.body.removeChild(_p);
        
        return (_w < 0 ? -1 * _w : _w);
        
    }
    
    scope.getHiddenScrollPanel = function(optional_class){
        var parent = createElement('div', 'verticle-scroll-hide'),
            child = createElement('div');
        
        parent.appendChild(child);
        HideScrollBar(child);
        
        return child;
    };
    
})(window); // Plugin to hide scrollbars

(function(scope){
    
    function animScroll(elem, to, duration, horizontal){
        
        let start = elem === window ? (horizontal === true ? window.scrollX : window.scrollY) : (horizontal === true ? elem.scrollLeft : elem.scrollTop),
            change = to - start,
            increment = 20;
        
        let animate = function(elapsedTime){
            
            elapsedTime += increment;
            
            let position = MathHelper.easeInOut(elapsedTime, start, change, duration);
            
            if(elem === window){
                
                if(horizontal){
                    
                    window.scrollTo(position, 0);
                    
                } else {
                    
                    window.scrollTo(0, position);
                    
                }
                
            } else {
                
                if(horizontal){
                    
                    elem.scrollLeft = position;
                    
                } else {
                    
                    elem.scrollTop = position;
                    
                }
                
            }
            
            if (elapsedTime < duration){
                
                setTimeout(function(){
                    
                    animate(elapsedTime);
                    
                }, increment);
                
            }
            
        };
        
        animate(0);
        
    }
    
    scope.AnimatedScroll = animScroll;
    
})(window); // Animated scroll plugin

(function(scope){
    var mathHelper = {};
    
    mathHelper.easeInOut = function (currentTime, start, change, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }
    
    mathHelper.range = function(min, max, val){
        return Math.abs(val / (max - min));
    };
    
    scope.MathHelper = mathHelper;
    
})(window); // Math Helpers




/*

"use strict";

var _createClass = function () { 
    
    function defineProperties(target, props) {
        
        for (var i = 0; i < props.length; i++) { 
            
            var descriptor = props[i]; 
            
            descriptor.enumerable = descriptor.enumerable || false; 
            
            descriptor.configurable = true; 
            
            if ("value" in descriptor) descriptor.writable = true; 
            
            Object.defineProperty(target, descriptor.key, descriptor); 
            
        } 
        
    } 
    
    return function (Constructor, protoProps, staticProps) { 
        
        if (protoProps) defineProperties(Constructor.prototype, protoProps); 
        
        if (staticProps) defineProperties(Constructor, staticProps); 
        
        return Constructor; 
        
    }; 
    
}();

var _get = function get(object, property, receiver) { 
    
    if (object === null) object = Function.prototype; 
    
    var desc = Object.getOwnPropertyDescriptor(object, property); 
    
    if (desc === undefined) { 
        
        var parent = Object.getPrototypeOf(object); 
        
        if (parent === null) { 
            
            return undefined;
            
        } else { 
            
            return get(parent, property, receiver); 
            
        } 
        
    } else if ("value" in desc) {
        
        return desc.value; 
        
    } else { 
        
        var getter = desc.get; 
        
        if (getter === undefined) { 
            
            return undefined; 
        } 
        
        return getter.call(receiver); 
    
    } 

};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SkinnedMesh = function (_THREE$Mesh) {
  _inherits(SkinnedMesh, _THREE$Mesh);

  function SkinnedMesh(geometry, materials) {
    _classCallCheck(this, SkinnedMesh);

    var _this = _possibleConstructorReturn(this, (SkinnedMesh.__proto__ || Object.getPrototypeOf(SkinnedMesh)).call(this, geometry, materials));

    _this.idMatrix = SkinnedMesh.defaultMatrix();
    _this.bones = [];
    _this.boneMatrices = [];
    //...
    return _this;
  }

  _createClass(SkinnedMesh, [{
    key: "update",
    value: function update(camera) {
      //...
      _get(SkinnedMesh.prototype.__proto__ || Object.getPrototypeOf(SkinnedMesh.prototype), "update", this).call(this);
    }
  }], [{
    key: "defaultMatrix",
    value: function defaultMatrix() {
      return new THREE.Matrix4();
    }
  }]);

  return SkinnedMesh;
}(THREE.Mesh);

*/















