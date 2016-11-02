define([
	'coreJS/adapt',
	'coreViews/menuView',
	'./adapt-dragMenuItemView',
	'./adapt-dragMenuQuicknavItemView',
	'./hammer'
], function(Adapt, MenuView, DragMenuItemView, DragMenuQuicknavItemView, Hammer) {

	var DragMenuView = MenuView.extend({

		_isInPan: false,
		_windowHeight: 0,
		_windowWidth: 0,

		events: {
			"click .instruction-overlay": "onInstructionClick"
		},

		onInstructionClick: function() {
			this.$(".instruction-overlay").addClass("display-none");
			Adapt.offlineStorage.set("dmi", true);
		},

		onKeyPress: function() {
			this.onInstructionClick();
		},

		preRender: function() {
			this.onKeyPress = _.bind(this.onKeyPress, this);

			if (!Adapt.offlineStorage.get("dmi")) {
				$(window).on("keypress", this.onKeyPress);
				this.model.set("_shouldDisplayMapInstruction", true);
			} else {
				this.model.set("_shouldDisplayMapInstruction", false);
			}

			var nthChild = 0;
			this.model.getChildren().each(_.bind(function(item) {
				if(item.get('_isAvailable') && item.get('_dragMenuItem')) {
					var assessment = _.find(item.getChildren().toJSON(), function(it) { return typeof it._assessment !== "undefined"; } );
					if (assessment != undefined) {                    
						var assessmentState = Adapt.assessment.get()[0].getState();
						item.set("_assessment", { 
								isComplete : assessmentState.isComplete,
								hasScore: true,
								scoreAsPercentage : assessmentState.scoreAsPercent,
								isPassed : assessmentState.isPass === true,
								isFailed : assessmentState.isPass === false
							});
					}
					item.set("_isLoaded", false);
					this.listenToOnce(item, "change:_isLoaded", this.onCheckChildReady);
					item.set("_locked", false);
					if (item.get("_lock")) {
						var contentObjects = item.get("_lock");
						var completeCount = 0;
						for( var i = 0; i < contentObjects.length; i++) if (Adapt.contentObjects.findWhere({_id:contentObjects[i]}).get("_isComplete")) completeCount++;
						if (completeCount < contentObjects.length) {
							item.set("_locked", true);
						}
					}
				}
			}, this));

			MenuView.prototype.preRender.call(this);
		},

		onCheckChildReady: function() {
			// Filter children based upon whether they are available
			var availableChildren = new Backbone.Collection(this.model.getChildren().where({_isAvailable: true}));
			// Check if any return _isReady:false
			// If not - set this model to _isReady: true
			if (availableChildren.findWhere({_isLoaded: false})) return;

			this.onChildrenReady();
		},

		onChildrenReady: function() {
			if (this.$("img").length > 0) {
				this.$el.imageready(_.bind(function() {
					this.setReadyStatus();
				}, this));  
			} else this.setReadyStatus();
		},
		
		postRender: function() {
			var nthChild = 0;
			this.model.getChildren().each(function(item) {
				if(item.get('_isAvailable') && item.get('_dragMenuItem')) {
					nthChild ++;
					this.$('.menu-item-container-inner').append(new DragMenuItemView({model:item, nthChild:nthChild}).$el);
					this.$('.menu-quicknav-inner').append(new DragMenuQuicknavItemView({model:item, nthChild:nthChild}).$el);
				}
			});
			$(".menu").addClass("drag-menu");
			// Added class to wrapper for max width and navigation override
			$("#wrapper").addClass("wrapper-override");

			this.onPanStart = _.bind(this.onPanStart, this);
			this.onPanMove = _.bind(this.onPanMove, this);
			this.onPanEnd = _.bind(this.onPanEnd, this);

			this._windowWidth = $(window).width();
			this._windowHeight = $(window).height();

			this.setStartPosition();
			this.startTouchMove();
			this.listenTo(Adapt, "device:resize", this.onResize);
			this.listenToOnce(Adapt, 'remove', this.onRemove);
		},

		onResize: function() {
			// Resets the left / top stored values on window resize
			if (this._isInPan) return;
			if (this._windowWidth == $(window).width() && this._windowHeight == $(window).height()) return;

			this.model.set("_left", undefined);
			this.model.set("_top", undefined);
			this._windowWidth = $(window).width();
			this._windowHeight = $(window).height();
			this.setStartPosition();
		},

		setStartPosition: function() { 
			// Sets menu container to height of the window minus navigation height
			$('.drag-menu .menu-inner').css({ "height": $(window).height() - $(".menu-inner").offset()['top'] });

			// Sets the max width of the menu-header to width of the menu-drag-handle
			$('.drag-menu .menu-header').css({ "max-width": $('.menu-drag-handle').width()+"px" })

			var viewPortHeight = $(".menu-inner").height() / 2;
			var viewPortWidth = $(".menu-inner").width() / 2;

			var backgroundHeight = $('.menu-drag-handle').height() / 2;
			var backgroundWidth = $('.menu-drag-handle').width() / 2;

			var startPosX; 
			var startPosY;

			// If _left is undefined, set start position to the middle of the background image minus half window height / width
			// If _left is defined, set start position to defined value
			if (this.model.get("_left") === undefined) {
				startPosX = -(backgroundWidth - viewPortWidth);
			 	startPosY = -(backgroundHeight - viewPortHeight);
			} else {
				startPosX = this.model.get("_left");
				startPosY = this.model.get("_top");
			}

			// 
			if ($(".menu-inner").width() > $('.menu-drag-handle').width()) {
				startPosX = viewPortWidth-backgroundWidth;
			}	

			if ($(".menu-inner").height() > $('.menu-drag-handle').height()) {
				startPosY = viewPortHeight-backgroundHeight;
			}			
			
			// Sets start left / top position
			$('.drag-menu .menu-drag-handle').css({ "left": startPosX, "top": startPosY });
		},

		startTouchMove: function() {
			var myElement = $('.drag-menu .menu-drag-handle')[0];
			var myOptions = {};

			this.mc = new Hammer(myElement, myOptions);

			this.mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

			this.mc.on("panstart", this.onPanStart);
			this.mc.on("panmove", this.onPanMove);		
			this.mc.on("panend", this.onPanEnd);			
		},

		onPanStart: function(ev) {
			// Find starting left / top position as a value
			this_isInPan = true;
			this.startLeft = parseInt($('.drag-menu .menu-drag-handle').css('left'),10);
			this.startTop = parseInt($('.drag-menu .menu-drag-handle').css('top'),10);
		},

		onPanMove: function(ev) {
			// console.log(ev);

			// Defines the boundary of the drag window
			var limit = {
				top: 0,
				right: $('.menu-inner').width() - $('.menu-drag-handle').width(),
				bottom: $('.menu-inner').height() - $('.menu-drag-handle').height(),
				left: 0
			}

			var deltaX = ev.deltaX;
			var deltaY = ev.deltaY;

			var newLeft = this.startLeft + deltaX;
			var newTop = this.startTop + deltaY;

			// If newLeft is greater than limit.left, set newLeft to limit.left
			// Else if newLeft is less than limit.right, set newLeft to limit.right
			// Else set newLeft to newLeft 
			newLeft = newLeft > limit.left 
						? limit.left 
						: newLeft < limit.right 
						? limit.right 
						: newLeft;

			if ($(".menu-inner").width() > $('.menu-drag-handle').width()) {
				newLeft = ($(".menu-inner").width() / 2) - ($('.menu-drag-handle').width() / 2);
			}			

			newTop = newTop > limit.top
						? limit.top
						: newTop < limit.bottom
						? limit.bottom
						: newTop;

			if ($(".menu-inner").height() > $('.menu-drag-handle').height()) {
				newTop = ($(".menu-inner").height() / 2) - ($('.menu-drag-handle').height() / 2);
			}			

			$('.drag-menu .menu-drag-handle').css({ "left": newLeft, "top": newTop });

			// Stores left / top value
			this.model.set("_left", newLeft);
			this.model.set("_top", newTop);
		},

		onPanEnd: function() {
			this._isInPan = false;
		},

		onRemove: function() {
			this.mc.destroy();
		}

	}, {
		template:'dragMenuView'
	});

	return DragMenuView;

});
