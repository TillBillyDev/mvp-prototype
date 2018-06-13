var App = function(){
    
    var VIEW = document.getElementById('app-main-view'),
        MODULES = {},
        CONTROLLERS = {},
        BUILDERS = {},
        MISC = {},
        ASSETS = {};
    
    
    
    /* 
    // Misc
    // -------------------------------------------------------------------
    */ 
    
    MISC.putZigzagGraphic = function(elem, direction, opts){
        
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            opts = opts || {},
            defaults = {
                lineWidth: 1.5,
                strokeStyle: "#21232a",
                fillStyle: "#fff",
                width: 20,
                height: 20
            },
            src = '';
        
        Helpers.extendDefaults(defaults, opts);
        
        canvas.width = defaults.width;
        canvas.height = defaults.height;

        context.lineWidth = defaults.linewidth;
        context.strokeStyle = defaults.strokeStyle;
        context.fillStyle = defaults.fillStyle;
        
        if(direction === 'up'){
            
            context.beginPath();
            context.moveTo(0, defaults.height);
            context.lineTo(defaults.width / 2, 0);
            context.lineTo(defaults.width, defaults.height);
            context.closePath();
            context.fill();
            
            context.beginPath();
            context.moveTo(0, defaults.height);
            context.lineTo(defaults.width / 2, 0);
            context.lineTo(defaults.width, defaults.height);
            context.stroke();
            
        } else if(direction === 'down'){
            
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(defaults.width / 2, defaults.height);
            context.lineTo(defaults.width, 0);
            context.closePath();
            context.fill();

            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(defaults.width / 2, defaults.height);
            context.lineTo(defaults.width, 0);
            context.stroke();
            
        }
        
        src = canvas.toDataURL();
        
        elem.style.backgroundImage = 'url("' + src + '")';
        
    };
    
    MISC.RandomStoreGen = function(){
        
        var names = [
            'Almighty',
            'Aaloo',
            'Butter Knuckles',
            'Best',
            'Curiosity',
            'Cucumberback',
            'Doomsday',
            'Dragonstone',
            'Egg Shells',
            'Eeelongated',
            'Fruity',
            'Flounder',
            'Goosebumps',
            'Glorified',
            'Horrible',
            'Hanaconda',
            'Isometric',
            'Ipoop',
            'JFC',
            'Jackle',
            'Krackle',
            'Knifey-Wifey',
            'Lumberjack',
            'Lubba',
            'Mangosteen',
            'Masterdate',
            'Nincompoop',
            'Nostradamus',
            'Oyster',
            'Oober',
            'Plutonium',
            'Pizza Butt',
            'Qcumber',
            'Quest',
            'Ranger',
            'Ragnarock',
            'Sarthak',
            'Samwell Tarly',
            'Tyrion',
            'Teslah',
            'Ultrashort',
            'Ummmm',
            'Valar Morghulis',
            'Voolies',
            'Wubba Lubba Dub Dub',
            'Westeros',
            'XAM',
            'Xenon',
            'Yuckies',
            'Youngs',
            'Zappy',
            'ZzZzZ',
        ];
        
        var types = [
            'Inc.',
            'Pty. Ltd.',
            'Corporation',
            'Foods',
            'Cabs',
            'Labs',
            'PC Ltd.',
            'Transports',
            'Services',
            'Brothers',
            'and Sons',
            'Electronics',
            'Deptt.',
            'Cafe',
            'Restaurant',
        ];
        
        return names[Math.floor(Math.random() * names.length)] + ' ' + types[Math.floor(Math.random() * types.length)];
        
    };
    
    
    
    /* 
    // Builders
    // -------------------------------------------------------------------
    */ 
    
    BUILDERS.link = function(tc, href, class_name, qp){
        
        var l = createElement('a', class_name ? class_name : '');
        
        l.innerHTML = tc;
        
        if(qp){
            
            l.setAttribute('data-query', qp);
            
        }
        
        if(href){
            
            l.setAttribute('data-href', href);
            
            Router.buildLink(l);
            
        }
        
        return l;
        
    };
    
    BUILDERS.button = function(opts){
        
        var d = {
            textContent: '',
            class: '',
            uri: null,
            svg: false,
            svg_on_right: false,
            query_params: false,
            data: null
        };
        
        Helpers.extendDefaults(d, opts)
        
        var b = createElement('a', 'site-button ' + d.class),
            t = createElement('span', 'text'),
            i = createElement('span', 'icon');
        
        t.textContent = d.textContent;
        
        if(d.query_params){
            
            b.setAttribute('data-query', d.query_params);
            
        }
        
        if(d.uri){
            
            b.setAttribute('data-href', d.uri);
            
            Router.buildLink(b);
            
        }
        
        if(d.data){
            
            b.setAttribute('data-data', d.data);
            
        }
        
        if(d.svg){
            
            i.innerHTML = d.svg;
            
            if(d.svg_on_right){
                
                b.appendChild(t);
                b.appendChild(i);
                
            } else {
                
                b.appendChild(i);
                b.appendChild(t);
                
            }
            
        } else {
            
            b.appendChild(t);
            
        }
        
        return b;
        
    }
    
    BUILDERS.ReceiptTile = function(receipt){
        
        var box = createElement('div', 'receipt-tile'),
            
        /*
        var box = BUILDERS.link('', 'single-receipt', 'receipt-tile', JSON.stringify({
                pos: receipt.pos_in_array,
                id: receipt.id
            })),
        */
        
            head = createElement('div', 'head'),
            title = createElement('p', 'small title text-nowrap'),
            date = createElement('p', 'date x-small text-nowrap'),
            amount = createElement('p', 'amount text-nowrap'),
            graphic = createElement('div', 'graphic'),
            button = createElement('a', 'button-60 flex flex-all-center');
        
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
        
        
        title.textContent = receipt.store.name; // + ' - (ID: ' + receipt.id + ')';
        
        if(receipt.store.name === 'Emoji Cafe'){

            box.classList.add('emoji-cafe');

        } else if(receipt.store.name === 'Acme Supermarket'){

            box.classList.add('acme-supermarket');

        }  else if(receipt.store.name === 'Next Fashion'){

            box.classList.add('next-fashion');

        }
        
        amount.textContent = '$' + (receipt.parsed.total ? receipt.parsed.total : 0.00);
        date.textContent = new Date(receipt.createdAt).toLocaleDateString();
        
        head.appendChild(graphic);
        head.appendChild(title);
        //head.appendChild(date);
        head.appendChild(amount);
        head.appendChild(button);
        
        box.appendChild(head);
        
        box.onclick = ASSETS.SingleReceipt.show.bind(null, receipt.pos_in_array);
        
        return box;
    };
    
    BUILDERS.ReceiptCard = function(lines){
        
        var box = createElement('div', 'detailed-receipt-view margin-auto'),
            top_graphic = createElement('div', 'receipt-design top'),
            bot_graphic = createElement('div', 'receipt-design bottom'),
            html = '';
        
        for(var i = 0; i < lines.length; i++){
            
            var line = lines[i];
            
            if(line.type === 'general'){
                
                html += '<p>' + line.data + '</p>';
                
            } else if(line.type === 'general_center'){
                
                html += '<p class="center-align">' + line.data + '</p>';
                
            } else if(line.type === 'separator'){
                
                html += '<div class="separator"></div>';
                
            } else if(line.type === 'keyvalue'){
                
                html += '<p><span>' + line.data.key + '</span>: <span>' + line.data.val + '</span></p>';
                
            } else if(line.type === 'cost_line'){
                
                html += '<div class="flex cost-line"><div class="name"><p>' + line.data.name + '</p></div><div class="unit"><p>' + (line.data.unit_cost ? ' ' + line.data.unit_cost : '') + '</p></div><div class="cost"><p>' + line.data.cost + '</p></div></div>';
                
            } else if(line.type === 'footer_cost_line'){
                
                html += '<p class="clearfix"><span class="float-left">' + line.data.left + '</span><span class="float-right">' + line.data.right + '</span></p>';
                
            } else if(line.type === 'footer_cost_line_with_total'){
                
                html += '<h2 class="clearfix "><span class="float-left">' + line.data.left + '</span><span class="float-right">' + line.data.right + '</span></h2>';
                
            }
            
        }
        
        box.innerHTML = html;
        
        box.appendChild(top_graphic);
        box.appendChild(bot_graphic);
        
        MISC.putZigzagGraphic(top_graphic, 'up', {
            strokeStyle: '#e4e4e4',
            fillStyle: '#fff',
            width: 25,
            height: 10,
        });
        
        MISC.putZigzagGraphic(bot_graphic, 'down', {
            strokeStyle: '#e4e4e4',
            fillStyle: '#fff',
            width: 25,
            height: 10,
        });
        
        return box;
        
    };
    
    
    
    /*
    // Controllers
    // -------------------------------------------------------------------
    */
    
    CONTROLLERS.Receipts = function(){
        
        var hmbgr = this.container.getElementsByClassName('hamburger-icon')[0],
            search = this.container.getElementsByClassName('search-icon')[0],
            filter = this.container.getElementsByClassName('filter-icon')[0],
            list = this.container.getElementsByClassName('receipts-listing')[0],
            loader_top = this.container.getElementsByClassName('update-loader')[0],
            loader_bottom = this.container.getElementsByClassName('infinite-loader')[0],
            
            collection = Collection.getCollection('receipt'),
            date_counter = new Date(1980, 1, 1),
            date_list = [],
            today = new Date(),
            state = history.state.state,
            screen = this.container,
            
            touchState = {
                active: false,
                height: 0,
                limit: 100,
                is_refreshing: false
            },
            
            loaderState = {
                params: {
                    page: 1,
                    expand: 'store'
                },
                loading: false,
                end_of_list: false
            };
        
        init();
        
        function init(){
            
            hmbgr.onclick = MODULES.AppDrawer.show;
            filter.onclick = MODULES.ReceiptFilter.show;
            search.onclick = MODULES.ReceiptFilter.show.bind(null, true);
            
            if(collection){
                
                getReceiptFromCollection();
                
            } else {
                
                getReceiptFromAPI();
                
            }
            
            if(state && state.has_state){
                //screen.scrollTo(0, state.scroll_pos);
                screen.scrollTop = state.scroll_pos;
            }
            
        }
        
        
        
        // Receipt 
        
        function getReceiptFromAPI(){
            
            if(loaderState.end_of_list) return;
            
            if(loaderState.loading) return;
            
            loaderState.loading = true;
            
            loader_bottom.classList.add('loading');
            
            XHR.GET({
                path: 'receipts',
                params: loaderState.params,
                success: addToCollection,
                error: errorOut
            });
            
        }
        
        function addToCollection(receipts){
            
            loaderState.params.page++;
            loaderState.loading = false;
            
            loader_bottom.classList.remove('loading');
            
            if(receipts.length === 0){
                loaderState.end_of_list = true;
            }
            
            for(var i = 0; i < receipts.length; i++){
                
                var current = receipts[i],
                    rawData = current.rawData,
                    decoded = atob(rawData),
                    parsed = new ParserV2(decoded).getData(),
                    receipt = null,
                    bg_color = '';
                
                if(current.store.name === 'Emoji Cafe'){
                    
                    bg_color = '#4d5da9';
                    
                } else if(current.store.name === 'Acme Supermarket'){
                    
                    bg_color = '#c4be18';
                    
                }  else if(current.store.name === 'Next Fashion'){
                    
                    bg_color = '#e6226e';
                    
                } else {
                    
                    current.store.name = 'Generic Store';
                    bg_color = '#333';
                    
                }
                
                receipt = Collection.addItem('receipt', current, {
                    parsed: parsed,
                    bg_color: bg_color
                });
                
                if(receipt) addReceiptToView(receipt);
                
            }
        }
        
        function getReceiptFromCollection(){
            
            var receipts = collection;
            
            for(var i = 0; i < receipts.length; i++){
                
                var receipt = receipts[i];
                
                addReceiptToView(receipt);
                
            }
            
        }
        
        function addReceiptToView(receipt){
            
            var box = BUILDERS.ReceiptTile(receipt),
                current_date = new Date(receipt.createdAt);
            
            if(!isSameDay(date_counter, current_date)){
                
                var date_row = createElement('div', 'date-separator'),
                    date_helper = createElement('div', 'date-separator-helper');
                
                if(isSameDay(today, current_date)){
                    
                    date_row.innerHTML = 'TODAY';
                    date_helper.innerHTML = 'TODAY';
                    
                } else {
                    
                    var str = current_date.getDayName(true) + ', ' + current_date.getMonthName() + ' ' + (current_date.getDate() < 10 ? '0' : '') + current_date.getDate() + ' ' + current_date.getFullYear();
                    
                    date_row.innerHTML = str;
                    date_helper.innerHTML = str;
                    
                }
                
                date_list.push(date_helper);
                
                list.appendChild(date_helper);
                list.appendChild(date_row);
                
            }
            
            list.appendChild(box);
            
            date_counter = new Date(receipt.createdAt);
            
        }
        
        function isSameDay(d1, d2){
            if(d1.getDate() == d2.getDate()){
                if(d1.getMonth() == d2.getMonth()){
                    if(d1.getFullYear() == d2.getFullYear()){
                        return true;
                    }
                }
            }
            return false;
        }
        
        function errorOut(){
            
            loaderState.loading = false;
            
            loader_top.classList.remove('loading');
            
        }
        
        list.addTouchListeners({
            
            onstart: function(e){
                
                if(screen.scrollTop <= 0 && !touchState.active){
                    
                    touchState.active = true;
                    
                }
                
            },
            
            onmove: function(e){
                
                if(touchState.active){
                    
                    var dy = e.delta.y,
                        opacity;

                    touchState.height = touchState.height + (dy / 2);
                    
                    if(touchState.height > touchState.limit){
                        touchState.height = touchState.limit;
                    }

                    if(touchState.height < 0){
                        touchState.height = 0;
                    }
                    
                    opacity = Helpers.Math.range(0, touchState.limit, touchState.height);
                    
                    loader_top.style.opacity = opacity;
                    loader_top.style.height = touchState.height + 'px';
                    
                }
                
            },
            
            onend: function(e){
                
                if(touchState.active){
                    
                    var top = touchState.height;
                    
                    if(top >= touchState.limit){
                        
                        triggerRefresh();
                        
                    } else {
                        
                        resetTouchState();
                        
                    }
                    
                } else {
                    
                    resetTouchState();
                    
                }
                
            }
            
        });
        
        function triggerRefresh(){
            
            if(touchState.is_refreshing) return;
            
            touchState.is_refreshing = true;
            
            loader_top.classList.add('refresh');
            
            loader_top.style.height = (touchState.height - 10) + 'px';
            
            refreshList(function(){
                
                touchState.is_refreshing = false;
                loader_top.classList.remove('refresh');
                resetTouchState();
                
            });
            
        }
        
        function resetTouchState(){
            
            loader_top.classList.add('set-transitions');
            loader_top.style.height = 0 + 'px';
            loader_top.style.opacity = 0;
            
            touchState.active = false;
            touchState.height = 0;
            
            setTimeout(function(){
                loader_top.classList.remove('set-transitions');
            }, 300);
            
        }
        
        function refreshList(callback){
            
            loaderState.params.page = 1;
            
            date_counter = new Date(1980, 1, 1);
            date_list = [];
            
            XHR.GET({
                path: 'receipts',
                params: loaderState.params,
                success: function(receipts){
                    
                    list.innerHTML = '';
                    
                    Collection.clearCollection('receipt');
                    
                    addToCollection(receipts);
                    
                    callback();
                    
                },
                error: function(){
                    
                    callback();
                    
                }
            });
            
        }
        
        
        
        screen.onscroll = function(){
            
            var y = this.scrollTop;
            
            if(!loaderState.loading || !loaderState.end_of_list){
                if(this.scrollHeight - y <= 2 * this.clientHeight){
                    getReceiptFromAPI();
                }
            }
            
            for(var d = 0; d < date_list.length; d++){
                
                var elem = date_list[d];
                
                if(y > elem.offsetTop){
                    if(!elem.classList.contains('fixed')){
                        elem.classList.add('fixed');
                    }
                } else {
                    elem.classList.remove('fixed');
                }
                
            }
            
        };
        
        Router.onBeforePageChange(function(){
            
            Router.setStateData({
                has_state: true,
                scroll_pos: screen.scrollTop
            });
        });
        
    };
    
    CONTROLLERS.Generic = function(){
        
        var hmbgr = this.container.getElementsByClassName('hamburger-icon')[0];
        
        hmbgr.onclick = MODULES.AppDrawer.show;
        
    };
    
    CONTROLLERS.ViewReceipt = function(){
        
        var slide = this.container.getElementsByClassName('single-receipt-frame')[0],
            header = this.container.getElementsByClassName('app-header')[0],
            
            store_name = this.container.getElementsByClassName('store-name')[0],
            store_logo = this.container.getElementsByClassName('store-logo')[0],
            receipt_cost = this.container.getElementsByClassName('receipt-cost')[0],
            receipt_date = this.container.getElementsByClassName('receipt-date')[0],
            zigzag_graphic = this.container.getElementsByClassName('zigzag-graphic')[0],
            view = this.container.getElementsByClassName('receipt-items')[0],
            back = this.container.getElementsByClassName('go-back')[0],
            options = this.container.getElementsByClassName('options')[0],
            
            query = JSON.parse(history.state.query_params),
            collection = Collection.getCollection('receipt'),
            receipt = collection[query.pos],
            
            maxX = 100,
            minX = 0,
            slide_styles = getComputedStyle(slide);
        
        back.onclick = function(){
            
            history.back();
            
        }
        
        options.onclick = MODULES.Overlay.show.bind(null, { data: "Available Options<br>Coming Soon" });
        
        display();
        
        function display(){
            
            var parsed_lines = receipt.parsed.lines,
                
                date = new Date(receipt.createdAt),
                str = date.getMonthName() + ' ' + (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' + date.getFullYear(),
                
                html = '';
            
            store_name.textContent = receipt.store_name;
            
            if(receipt.store_name === 'Emoji Cafe'){
                store_logo.classList.add('emoji-cafe');
            }
            
            header.style.backgroundColor = receipt.bg_color;
            receipt_cost.textContent = receipt.parsed.total ? receipt.parsed.total : 0.00;
            
            receipt_date.textContent = str;
            
            MISC.putZigzagGraphic(zigzag_graphic, 'up', {
                strokeStyle: '#e4e4e4',
                fillStyle: '#fff',
                width: 25,
                height: 10,
            });
            
            for(var l = 0; l < parsed_lines.length; l++){
                
                var line = parsed_lines[l];
                
                if(line.type === 'cost_line'){
                    
                    html += '<div class="flex cost-line"><div class="name"><p>' + line.data.name + '</p></div><div class="unit"><p>' + (line.data.unit_cost ? ' ' + line.data.unit_cost : '') + '</p></div><div class="cost"><p>' + line.data.cost + '</p></div></div>';
                    
                }
                
            }
            
            view.innerHTML = html;
            
            //view.appendChild(BUILDERS.ReceiptCard(receipt.parsed.lines));
            
        }
        
        setTimeout(function(){
            
            slide.classList.add('go');
            
        }, 20);
        
        this.defaults.onExitFn = function(cb){
            
            slide.classList.remove('go');
            
            setTimeout(function(){
                
                cb();
                
            }, 400);
            
        }.bind(this);
        
        
        /*
        function setupTouchEvents(){
            
            slide.addTouchListeners({
                
                onstart: function(e){
                    
                    slide.classList.add('no-transition');
                    
                },
                
                onmove: function(e){

                    if(e.axis === 'vertical') return;

                    var dx = e.delta.x,
                        currentX = parseFloat(slide_styles.left) / slide.offsetWidth,
                        moveBy = (dx / slide.offsetWidth) + currentX;

                    moveBy = moveBy * 100;

                    if(moveBy > maxX) moveBy = maxX;
                    if(moveBy < minX) moveBy = minX;

                    slide.style.left = moveBy + '%';

                },

                onend: function(e){

                    slide.classList.remove('no-transition');
                    slide.setAttribute('style', '');

                    if(e.axis === 'horizontal' && e.direction === 'right'){

                        history.back();

                    }

                }

            });
            
        }
        */
        
    };
    
    
    
    /*
    // Adding screens
    // -------------------------------------------------------------------
    */
    
    (function(){
        
        ScreenManager.addScreen('splash', {
            view: VIEW,
            templateData: '<p>Loading App</p><a href="#" class="app-nav" data-href="receipts">Go to receipts</a>'
        });
        
        ScreenManager.addScreen('receipts', {
            view: VIEW,
            templateURI: '/partials/receipts.html',
            controller: CONTROLLERS.Receipts
        });
        
        ScreenManager.addScreen('offers', {
            view: VIEW,
            templateURI: '/partials/offers.html',
            controller: CONTROLLERS.Generic
        });
        
        ScreenManager.addScreen('archives', {
            view: VIEW,
            templateURI: '/partials/archives.html',
            controller: CONTROLLERS.Generic
        });
        
        ScreenManager.addScreen('insights', {
            view: VIEW,
            templateURI: '/partials/insights.html',
            controller: CONTROLLERS.Generic
        });
        
        ScreenManager.addScreen('cards', {
            view: VIEW,
            templateURI: '/partials/cards.html',
            controller: CONTROLLERS.Generic
        });
        
        ScreenManager.addScreen('settings', {
            view: VIEW,
            templateURI: '/partials/settings.html',
            controller: CONTROLLERS.Generic
        });
        
        ScreenManager.addScreen('single-receipt', {
            view: VIEW,
            templateURI: '/partials/single-receipt.html',
            controller: CONTROLLERS.ViewReceipt,
            preserveView: true
        });
        
    })();
    
    
    
    /*
    // Real time screens
    // -------------------------------------------------------------------
    */
    
    ASSETS.SingleReceipt = (function(){
        
        function show(pos){
            
            var frame = createElement('div', 'single-receipt-frame'),
                
                html = '<div class="head"><div class="app-header no-pad"><div class="flex"><span class="button-box"><a class="button-60 flex flex-all-center go-back"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></a></span><div class="title flex-auto flex flex-center text-nowrap"><div class="margin-auto">Tax Invoice</div></div><div class="flex-none"><span class="button-box"><a class="button-60 flex flex-all-center options"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="20" r="2"/></svg></a></span></div></div></div></div><div class="receipt-viewer"><div class="upper"><div class="store-details"><div class="store-logo"></div><p class="store-name">Store name</p><p class="small store-address text-nowrap">Store address</p><p class="small store-abn">ABN102030405</p></div><div class="receipt-details"></div></div><div class="lower pad-updown-20"><div class="zigzag-graphic"></div><div class="receipt-table pad-side-20"><div class="flex cost-line receipt-head"><div class="name">Item</div><div class="cost">Price</div></div><div class="receipt-items"></div></div><div class="receipt-total pad-side-20 flex"><div class="flex-auto"><p class="right-align">Total</p></div><div class="flex-none"><p class="right-align receipt-cost">$00.00</p></div></div></div></div>';
            
            frame.innerHTML = html;
            
            extract(frame, pos);
            
        }
        
        function extract(frame, pos){
            
            var header = frame.getElementsByClassName('app-header')[0],
                
                store_name = frame.getElementsByClassName('store-name')[0],
                store_logo = frame.getElementsByClassName('store-logo')[0],
                store_address = frame.getElementsByClassName('store-address')[0],
                store_abn = frame.getElementsByClassName('store-abn')[0],
                receipt_cost = frame.getElementsByClassName('receipt-cost')[0],
                receipt_details = frame.getElementsByClassName('receipt-details')[0],
                zigzag_graphic = frame.getElementsByClassName('zigzag-graphic')[0],
                viewer = frame.getElementsByClassName('receipt-items')[0],
                back = frame.getElementsByClassName('go-back')[0],
                options = frame.getElementsByClassName('options')[0],
                
                collection = Collection.getCollection('receipt'),
                receipt = collection[pos];
            
            back.onclick = function(){
                history.back();
            }

            options.onclick = MODULES.Overlay.show.bind(null, { 
                data: "Available Options<br>Coming Soon"
            });

            function show(){
                
                var parsed_lines = receipt.parsed.lines,

                    date = new Date(receipt.createdAt),
                    date_str = date.getMonthName() + ' ' + (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' + date.getFullYear(),

                    html = '';

                store_name.textContent = receipt.store.name;

                if(receipt.store.name === 'Emoji Cafe'){

                    store_logo.classList.add('emoji-cafe');

                } else if(receipt.store.name === 'Acme Supermarket'){

                    store_logo.classList.add('acme-supermarket');

                }  else if(receipt.store.name === 'Next Fashion'){

                    store_logo.classList.add('next-fashion');

                }
                
                store_address.textContent = receipt.store.location.addressLine1 + ' ' + receipt.store.location.addressLine2 + ' ' + receipt.store.location.postalCode;
                
                header.style.backgroundColor = receipt.bg_color;
                receipt_cost.textContent = '$' + (receipt.parsed.total ? receipt.parsed.total : 0.00);

                //receipt_date.textContent = str;

                MISC.putZigzagGraphic(zigzag_graphic, 'up', {
                    strokeStyle: '#e4e4e4',
                    fillStyle: '#fff',
                    width: 25,
                    height: 10,
                });

                for(var l = 0; l < parsed_lines.length; l++){

                    var line = parsed_lines[l];

                    if(line.type === 'cost_line'){

                        html += '<div class="flex cost-line"><div class="name"><p>' + line.data.name + '</p></div><div class="cost"><p>$' + line.data.cost + '</p></div></div>';

                    }

                }
                
                receipt_details.appendChild(getReceiptDetailLine(
                    'Date',
                    date_str
                ));
                
                receipt_details.appendChild(getReceiptDetailLine(
                    'Receipt total',
                    '$' + (receipt.parsed.total ? receipt.parsed.total : 0.00)
                ));

                viewer.innerHTML = html;
                
                VIEW.appendChild(frame);
                
                setTimeout(function(){
                    frame.classList.add('go');
                }, 15);
                
            }
            
            function getReceiptDetailLine(key, val){
                
                var d = createElement('div', 'keyvalues flex'),
                    k = createElement('div', 'key flex-auto'),
                    v = createElement('div', 'value flex-none');
                
                k.textContent = key;
                v.textContent = val;
                
                d.appendChild(k);
                d.appendChild(v);
                
                return d;
                
            }
            
            function hide(){
                
                frame.classList.remove('go');
                
                setTimeout(function(){
                    
                    VIEW.removeChild(frame);
                    
                }, 300);
                
            }
            
            Router.pushState({
                
                name: 'view-receipt',
                
                onPush: show,
                
                onBack: hide,
                
                isPopup: true
                
            });
            
        }
        
        return {
            
            show: show
            
        };
        
    })();
    
    
    
    /*
    // Modules
    // -------------------------------------------------------------------
    */
    
    MODULES.AppDrawer = (function(){
        
        var frame = createElement('div', '_app_drawer-frame'),
            overlay = createElement('div', '_app_drawer-overlay'),
            sidebar = createElement('div', '_app_drawer-sidebar'),
            sidebar_inner = createElement('div', '_app_drawer-sidebar-inner'),
            
            header = createElement('div', '_app_drawer-sb_header flex flex-all-center'),
            body = createElement('div', '_app_drawer-sb_body'),
            
            ad_sb_link = 'text-left full-width clear _app_drawer-sb_link',
            
            links = {
                receipts: BUILDERS.button({
                    textContent: 'Receipts',
                    class: ad_sb_link,
                    data: 'receipts',
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 l0 20 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l0 -20 l-3 3 l-3 -3 l-3 3 l-3 -3 l-3 3z"/></svg>'
                }),
                offers: BUILDERS.button({
                    textContent: 'Offers',
                    class: ad_sb_link,
                    data: 'offers',
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7" y2="7"/></svg>'
                }),
                archives: BUILDERS.button({
                    textContent: 'All Receipts',
                    class: ad_sb_link,
                    data: 'archives',
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><polyline points="2.32 6.16 12 11 21.68 6.16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><line x1="12" y1="22.76" x2="12" y2="11" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><line x1="7" y1="3.5" x2="17" y2="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>'
                }),
                insights: BUILDERS.button({
                    textContent: 'Insights',
                    class: ad_sb_link,
                    data: 'insights',
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="10" y="3" width="4" height="18" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><rect x="18" y="8" width="4" height="13" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><rect x="2" y="13" width="4" height="8" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>'
                }),
                cards: BUILDERS.button({
                    textContent: 'Cards',
                    class: ad_sb_link,
                    data: 'cards',
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><line x1="1" y1="10" x2="23" y2="10" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>'
                }),
                settings: BUILDERS.button({
                    textContent: 'Settings',
                    class: ad_sb_link,
                    data: 'settings',
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke-miterlimit="10" stroke-width="1.5"/></svg>'
                }),
            },
            
            is_open = false,
            maxX = 0,
            minX = -280;
        
        
        header.innerHTML = '<div class="logo"></div>';
        
        //header.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"/><circle cx="12" cy="7" r="4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"/></svg>';
        
        body.appendChild(links.receipts);
        body.appendChild(links.offers);
        body.appendChild(links.archives);
        body.appendChild(links.insights);
        body.appendChild(links.cards);
        body.appendChild(links.settings);
        
        sidebar_inner.appendChild(header);
        sidebar_inner.appendChild(body);
        
        sidebar.appendChild(sidebar_inner);
        
        frame.appendChild(overlay);
        frame.appendChild(sidebar);
        
        build();
        
        
        
        function build(){
            
            for(var l in links){
                
                links[l].addEventListener('click', function(e){
                    
                    history.back();
                    
                    ScreenManager.goto(this.getAttribute('data-data'));
                    
                }, true);
                
            }
            
        }
        
        function show(){
            
            is_open = true;
            
            Router.pushState({
                
                name: 'app-drawer',
                
                onPush: function(){
                    frame.classList.add('open');
                },
                
                onBack: hide,
                
                isPopup: true
                
            });
            
        }
        
        function hide(){
            
            is_open = false;
            
            frame.classList.remove('open');
            
        }
        
        overlay.onclick = function(){
            
            history.back();
            
        }
        
        sidebar.addTouchListeners({
            
            onstart: function(e){
                
                sidebar.classList.add('no-transition');
                overlay.classList.add('no-transition');
                
            },
            
            onmove: function(e){
                
                if(e.axis === 'vertical') return;
                
                var dx = e.delta.x,
                    currentX = sidebar.get2DTransforms().x,
                    moveBy = dx + currentX,
                    range = 0;
                
                if(moveBy > maxX) moveBy = maxX;
                if(moveBy < minX) moveBy = minX;
                
                range = 1 - Helpers.Math.range(minX, maxX, moveBy);
                overlay.style.opacity = range;
                
                sidebar.CSS({
                    transform: 'translateX(' + moveBy + 'px)'
                });
                
            },
            
            onend: function(e){
                
                sidebar.classList.remove('no-transition');
                overlay.classList.remove('no-transition');
                sidebar.setAttribute('style', '');
                overlay.setAttribute('style', '');
                
                if(e.axis === 'horizontal'){
                    
                    if(e.direction === 'right'){
                        
                        if(!is_open){
                            
                            show();
                            
                        }
                        
                    } else {
                        
                        if(is_open){
                            
                            history.back();
                            
                        }
                        
                    }
                    
                }
                
            }
            
        });
        
        
        ScreenManager.addLoadEvent(function(){
            
            var drawer = this.container.getElementsByClassName('insert-app-drawer')[0];
            
            if(drawer){
                
                drawer.appendChild(frame);
                
            }
            
        });
        
        
        
        return {
            
            show: show,
            
            hide: hide
            
        }
        
    })();
    
    MODULES.Overlay = (function(){
        
        function add(opts){
            
            var frame = createElement('div', 'overlay flex flex-center flex-mid'),
                bg = createElement('div', 'background'),
                container = createElement('div', 'container'),
                
                defaults = {
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    bgclose: true,
                    data: false
                };
            
            Helpers.extendDefaults(defaults, opts);
            
            if(typeof defaults.data === 'object'){
                
                // do nothing
                
            } else if(typeof defaults.data === 'string'){
                
                var text = defaults.data;
                
                defaults.data = createElement('div', 'default-popup');
                defaults.data.innerHTML = text;
                
            } else {
                
                defaults.data = createElement('div', 'default-popup');
                defaults.data.innerHTML = "Empty Popup";
                
            }
            
            bg.style.backgroundColor = defaults.bgcolor;
            
            container.appendChild(defaults.data);
            
            frame.appendChild(bg);
            frame.appendChild(container);
            
            if(defaults.bgclose){
                bg.onclick = function(){
                    history.back();
                }
            }
            
            function show(){
                
                document.body.appendChild(frame);
                
                setTimeout(function(){
                    frame.classList.add('activate');
                }, 5);
                
            }
            
            function hide(){
                
                frame.classList.add('deactivate');
                
                setTimeout(function(){
                    document.body.removeChild(frame);
                }, 300);
                
            }
            
            Router.pushState({
                
                name: 'overlay',
                
                onPush: show,
                
                onBack: hide,
                
                isPopup: true
                
            });
            
        }
        
        return {
            
            show: add
            
        }
        
    })();
    
    MODULES.ReceiptFilter = (function(){
        
        var frame = createElement('div', '_filter_drawer-frame'),
            overlay = createElement('div', '_filter_drawer-overlay'),
            sidebar = createElement('div', '_filter_drawer-sidebar'),
            sidebar_inner = createElement('div', '_filter_drawer-sidebar-inner'),
            
            header = createElement('div', '_filter_drawer-sb_header'),
            search = createElement('input', ''),
            search_btn = createElement('a', 's-button button-60 flex flex-all-center'),
            
            body = createElement('div', '_filter_drawer-sb_body'),
            
            ad_sb_link = 'text-left full-width clear _filter_drawer-sb_link',
              
            is_open = false,
            maxX = 280,
            minX = 0;
        
        search_btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<circle cx="10.5" cy="10.5" r="7.5"/>' +
                            '<line x1="21" y1="21" x2="15.8" y2="15.8"/>' +
                        '</svg>';
        
        search.setAttribute('type', 'text');
        search.setAttribute('placeholder', 'Search');
        
        header.appendChild(search);
        header.appendChild(search_btn);
        
        body.innerHTML = '' +
            '<div class="pad-side-20 date-filter">' +
                '<p>Select a date range</p>' +
                '<p class="small">From</p>' +
                '<input type="date" class="begin-date">' +
                '<p class="small">Through</p>' +
                '<input type="date" class="end-date">' +
                '<div class="pad-updown-20">' + 
                    '<a class="site-button full-width text-center">' + 
                        '<span class="text">Apply</span>' +
                    '</a>' +
                '</div>' +
            '</div>';
        
        sidebar_inner.appendChild(header);
        sidebar_inner.appendChild(body);
        
        sidebar.appendChild(sidebar_inner);
        
        frame.appendChild(overlay);
        frame.appendChild(sidebar);
        
        function show(){
            
            is_open = true;
            
            Router.pushState({
                
                name: 'filter-drawer',
                
                onPush: function(){
                    frame.classList.add('open');
                },
                
                onBack: hide,
                
                isPopup: true
                
            });
            
        }
        
        function hide(){
            
            is_open = false;
            
            frame.classList.remove('open');
            
        }
        
        overlay.onclick = function(){
            
            history.back();
            
        }
        
        sidebar.addTouchListeners({
            
            onstart: function(e){
                
                sidebar.classList.add('no-transition');
                overlay.classList.add('no-transition');
                
            },
            
            onmove: function(e){
                
                if(e.axis === 'vertical') return;
                
                var dx = e.delta.x,
                    currentX = sidebar.get2DTransforms().x,
                    moveBy = dx + currentX,
                    range = 0;
                
                if(moveBy > maxX) moveBy = maxX;
                if(moveBy < minX) moveBy = minX;
                
                range = 1 - Helpers.Math.range(minX, maxX, moveBy);
                overlay.style.opacity = range;
                
                sidebar.CSS({
                    transform: 'translateX(' + moveBy + 'px)'
                });
                
            },
            
            onend: function(e){
                
                sidebar.classList.remove('no-transition');
                overlay.classList.remove('no-transition');
                sidebar.setAttribute('style', '');
                overlay.setAttribute('style', '');
                
                if(e.axis === 'horizontal'){
                    
                    if(e.direction === 'left'){
                        
                        if(!is_open){
                            
                            show();
                            
                        }
                        
                    } else {
                        
                        if(is_open){
                            
                            history.back();
                            
                        }
                        
                    }
                    
                }
                
            }
            
        });
        
        
        ScreenManager.addLoadEvent(function(){
            
            var drawer = this.container.getElementsByClassName('insert-filter-drawer')[0];
            
            if(drawer){
                
                drawer.appendChild(frame);
                
            }
            
        });
        
        
        
        return {
            
            show: show,
            
            hide: hide
            
        }
        
    })();
    
    
    
    /*
    // Run the app
    // -------------------------------------------------------------------
    */
    
    ScreenManager.run(function(){
        
        //Events.init();
        
        if(Session.isActive()){
            
            ScreenManager.gotoAndReplace('receipts', true);
            
        } else {
            
            ScreenManager.gotoAndReplace('receipts', true);
            
        }
        
        //Events.init();
        
        var splash = document.getElementById('app-splash');
        
        splash.classList.add('hide');
        
        setTimeout(function(){
            
            splash.parentElement.removeChild(splash);
            
        }, 400);
        
    });
    
};























