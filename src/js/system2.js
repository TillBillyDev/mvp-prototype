(function(scope){
    
    var backstack = [];
    
    function pushState(opts){
        
        var defaults = {
            name: backstack.length.toString(),
            state: {}
        };
        
        Helpers.extendDefaults(defaults, opts);
        
        backstack.push(defaults);
        
    };
    
})(window);