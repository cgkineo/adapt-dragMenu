define(function(require) {

	var Backbone = require('backbone');
	var Adapt = require('coreJS/adapt');
	var MenuView = require('coreViews/menuView');

	var DragMenuQuicknavItemView = MenuView.extend({

		events: {
			'click .menu-quicknav-item-pin': 'onMenuItemClicked'
		},

		className: function() {
			return [
				'menu-quicknav-item',
				'menu-quicknav-item-' + this.model.get('_id')
			].join(' ');
		},

		preRender: function() {
			this.model.set("_isLoaded", false);
		},

		postRender: function() {
			this.model.set("_isLoaded", true);
			this.setAriaLabel();
		},

		setAriaLabel: function() {
			var currentItem = this.$('.menu-quicknav-item-pin');
			var itemTitle = this.model.get('title');
			var ariaLabels = Adapt.course.get('_globals')._accessibility._ariaLabels;

			var visitedLabel = ariaLabels.visited;
			var completedLabel = ariaLabels.complete;
			var incompleteLabel = ariaLabels.incomplete;

			if (this.model.get('_isComplete')) {
				currentItem.attr('aria-label', itemTitle + '. ' + completedLabel);
			} else if (this.model.get('_isVisited')) {
				currentItem.attr('aria-label', itemTitle + '. ' + visitedLabel);
			} else {
				currentItem.attr('aria-label', itemTitle + '. ' + incompleteLabel);
			}
		},

		onMenuItemClicked: function(event) {
			if(event && event.preventDefault) event.preventDefault();
			Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
		}

	}, {
		template:'dragMenuQuicknavItem'
	});

	return DragMenuQuicknavItemView;

});
