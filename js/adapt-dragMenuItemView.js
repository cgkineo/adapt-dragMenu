define(function(require) {

	var Backbone = require('backbone');
	var Adapt = require('coreJS/adapt');
	var MenuView = require('coreViews/menuView');

	var DragMenuItemView = MenuView.extend({

		events: {
			'click .menu-item-pin': 'onMenuItemClicked'
		},

		className: function() {
			return [
				'menu-item',
				'menu-item-' + this.model.get('_id')
			].join(' ');
		},

		preRender: function() {
			this.model.set("_isLoaded", false);
		},

		postRender: function() {
			this.model.set("_isLoaded", true)
		},

		onMenuItemClicked: function(event) {
			if(event && event.preventDefault) event.preventDefault();
			Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
		}

	}, {
		template:'dragMenuItem'
	});

	return DragMenuItemView;

});
