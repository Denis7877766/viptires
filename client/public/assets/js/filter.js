var UTIL = {
  isInPage: function(node){
    return (node === document.body) ? false : document.body.contains(node);
  },
  observable: function(value){
    var listeners = [];

    function notify(newValue){
      listeners.forEach(function(listener){ listener(newValue) });
    }

    function accessor(newValue){
      if (arguments.length && newValue !== value) {
        value = newValue;
        notify(newValue);
      };

      return value;
    }

    accessor.subscribe = function(listener){ listeners.push(listener); };

    return accessor;
  }
};


var APP = {};

APP.Search = function(){
  this.init();
};

APP.Search.prototype = {
  init: function(){
    this.handleComponent();
  },
  handleComponent: function(){
    var that   = this;
    var filter = document.getElementById('product-filter');
    var ob     = UTIL.observable('nombre');
    var mutate = function(value){
      that.printTemplate(value);
    };

    if (UTIL.isInPage(filter)) {
      ob.subscribe(mutate);

      window.addEventListener('DOMContentLoaded', function(){
        var val  = filter.options[filter.selectedIndex].value;

        ob(val);
      });

      filter.addEventListener('change', function(evt){
        var self = this;
        var val  = self.options[self.selectedIndex].value;
        var text = self.options[self.selectedIndex].text;

        ob(val);
      })
    };
  },
  printTemplate: function(id){
    var template  = document.getElementById(id);
    var clone     = document.importNode(template.content, true);
    var container = document.querySelector('.js-search-mutable');

    container.innerHTML = "";
    container.appendChild(clone);
  }
}

new APP.Search();