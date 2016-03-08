define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');
    var MenuView = require('coreViews/menuView');
    var DragMenuView = require("menu/adapt-dragMenu/js/adapt-dragMenuView");
    
    Adapt.on('router:menu', function(model) {

        $('#wrapper').append(new DragMenuView({model:model}).$el);
    
    });
    
});
