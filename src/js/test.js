/*
* A utility code to test html5 history API and back stack navigation in
* apache cordova android app.
*/
window.onload = function(){

    var VIEW = document.getElementById('app-main-view'),
        btn = document.createElement('button'),
        clear = document.createElement('button'),
        popup = document.createElement('button'),
        counter = 0,

        history_clone = 0,

        backstack = [];

    btn.textContent = 'Navigate forward';
    clear.textContent = 'Clear stack';
    popup.textContent = 'Add a popup';

    btn.onclick = function(){

        push_a_state();

    };

    function push_a_state(fn){

        counter++;

        if(fn){
            backstack.push(fn);
        } else {
            backstack.push(function(){
                console.log('Binded counter value: ' + this);
            }.bind(counter));
        }

        history_clone++;

        history.pushState({ counter: 'I came to existence on iteration ' + counter }, '', (counter).toString());

    }

    window.onpopstate = function(e){

        history_clone--;

        backstack[backstack.length - 1]();

        backstack.pop();

        console.log('clone: ' + history_clone)

    };

    clear.onclick = function(){

        clearStack();

    };

    function clearStack(){

        history.go(-history_clone);
        history_clone = 0;

    }

    popup.onclick = function(){

        var box = document.createElement('div'),
            frame = document.createElement('div'),
            butt_ton_clear = document.createElement('button'),
            butt_ton = document.createElement('button'),
            butt_ton_close = document.createElement('button');

        push_a_state(function(){

            box.parentElement.removeChild(box);

        });

        box.setAttribute('style', 'background-color: rgba(0,0,0,.5); position: fixed; width: 100%; height: 100%; left: 0; top: 0; color: #fff;');

        box.innerHTML = "<div style='position: absolute; left: 100px; top: 100px;'>A popup</div>";

        /*box.onclick = function(){
            history.back();
        }*/

        butt_ton.textContent = 'Go forward and close this';
        butt_ton_close.textContent = 'Close this popup';
        butt_ton_clear.textContent = 'Clear backstack and go to link';

        butt_ton.onclick = function(){
            history.back();
            push_a_state();
        };

        butt_ton_close.onclick = function(){
            history.back();
        };

        butt_ton_clear.onclick = function(){
            history.back();
            push_a_state();
            clearStack();
        };

        box.appendChild(butt_ton_close);
        box.appendChild(butt_ton);
        box.appendChild(butt_ton_clear);

        document.body.appendChild(box);

    };

    VIEW.appendChild(btn);
    VIEW.appendChild(clear);
    VIEW.appendChild(popup);

};
