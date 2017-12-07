

function Zoom(wrapper){

	this.init();

};
Zoom.prototype = {

	destroy: function(){
		// delete events listeners
	},
	init: function(){ var self = this;

		self.logged = $('body').hasClass('logged');
		self.utils();
		self.actions();

		self.params = {} 
		self.params.scale = {
			initial : 1.4,
			minlimit: .6,	
			maxlimit: 3, // stop rasterizing limit	
			min : .1, 
			max : 3,
		}
		self.params.zoom = {
			initial : self.utils.getZoom(self.params.scale.initial),
			min : self.utils.getZoom(self.params.scale.min),
			max : self.utils.getZoom(self.params.scale.max),
		}
		self.pos = {
			x : 0,
			y : 0,
			z :self.params.scale.initial,
		}
		self.behavior = d3.zoom().scaleExtent([self.params.scale.min, self.params.scale.max])

		self.launch = function(){
			self.dom = {}
			self.dom.container = d3.select("#zoom-container").call(self.behavior);			
			self.dom.wrapper = self.dom.container.select("#zoom-wrapper");

			self.dom.slider = $('input#zoom-slider')
				.attr("value", self.params.zoom.initial)
				.attr("min", self.params.zoom.min)
				.attr("max", self.params.zoom.max)
				.attr("step", (self.params.zoom.max - self.params.zoom.min) / 100)
				.rangeslider({
					polyfill: false,
				})
				.on('input', function(e) {
					self.actions.slide(this.value) 
				});
	
			self.behavior
				.on("start", function(){ self.actions.start() })
				.on('zoom', function(){ self.actions.zoom() })
				.on("end", function(){ self.actions.end() })

			var win = self.utils.getScreen();
			self.actions.zoomToCoords(win.w/2, win.h/2, self.params.scale.initial, 200);

			self.enableKeyboard();
			self.enabled = true;
		}
		self.launch();
	},
	actions: function(){ var self = this;
		self.actions.disableDrag = function(){
			self.dom.container
				.on("mousedown.zoom", null)
				.on("touchstart.zoom", null)
				.on("touchmove.zoom", null)
				.on("touchend.zoom", null);		
		}
		self.actions.reset = function(){
			self.dom.container.call(self.behavior)
		}
		self.actions.slide = function(zoomvalue){
			self.behavior.scaleTo(self.dom.container, self.utils.getScale(zoomvalue));
		}
		self.actions.zoom = function(e) {
			self.utils.getPos();
			var current = self.pos.z+1, start = .5, addition = 4, end = self.params.scale.max;
			var easing = self.utils.easeInOut( current, start, addition, end);
			self.ratio = (1/self.pos.z) * easing * 500;

			self.logged = $('body[logged]').length ? true : false;
			var styles = 'transform:translate('+self.pos.x+'px, '+self.pos.y+'px) scale('+self.pos.z+');';
			if ( self.logged ) { styles += ' font-size:'+self.ratio+'px;'};

			self.dom.wrapper.attr("style", styles);
			self.dom.wrapper.attr('data-x', self.pos.x).attr('data-y', self.pos.y).attr('data-z', self.pos.z)
			self.dom.slider.val(self.utils.getZoom(self.pos.z)).rangeslider('update', true, false);

			//if (self.pos.z <= self.params.scale.minlimit) { self.dom.wrapper.classed("optimiseSpeed", true) } else { self.dom.wrapper.classed("optimiseSpeed", false) }
			
			/*
			if ((self.pos.z == self.params.scale.min) == true || (self.pos.z == self.params.scale.max) == true || 
				(self.pos.z >= self.params.scale.maxlimit) ) { self.dom.wrapper.classed("zooming", false);}
			*/
			
			if (self.callback && typeof self.callback !== "undefined") self.callback();
		}
		self.actions.start = function(){ 
			//if (self.pos.z <= self.params.scale.maxlimit) self.dom.wrapper.classed("zooming", true); 
		}
		self.actions.end = function(){ 
			//self.dom.wrapper.classed("zooming", false); 
		}
		self.actions.scaleBy = function(num){
			num = self.utils.getScale( self.utils.getZoom(self.pos.z) + num );
			self.behavior.scaleTo(self.dom.container.transition().duration(300), num)
		}
		self.actions.zoomToCoords = function(x, y, z, animation = true){
			if (animation) {
				if (animation === true) animation = 1000;
				self.dom.container.transition().duration(animation)
				    .call( self.behavior.transform, d3.zoomIdentity.translate(x,y).scale(z) );
			} else {
				self.dom.container
				    .call( self.behavior.transform, d3.zoomIdentity.translate(x,y).scale(z) );				
			}
		}
		self.actions.setView = function(item){
			if (item.classed('audio') 	||
				item.classed('video:not(.playing)') ||
				item.classed('arrow') 	){ 
				return;
			}
			var win = self.utils.getScreen();
			var coords = {}
			coords['w'] = parseFloat(item.style('width'));
			coords['h'] = parseFloat(item.style('height'));
			coords['x'] = parseFloat(item.style('left')) + coords.w/2;
			coords['y'] = parseFloat(item.style('top')) + coords.h/2;
			
			var scale = Math.max(self.params.scale.min, Math.min(self.params.scale.max, 0.9 / Math.max(coords.w / win.w, coords.h / win.h)));
			var translate = [win.w / 2 - scale * coords.x, win.h / 2 - scale * coords.y];

			self.dom.container
				.transition()
			    .ease(d3.easeSinInOut)
				.duration(1000)
			    .call( self.behavior.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) )
		}


		function centerTable(){

		}

		// center on resize
		var timeout, resized = false, initial, current;
		$(window).off().on('resize', function() {
			if (!resized) {
				initial = self.utils.getScreen();
				resized = true;	
			};
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				current = self.utils.getScreen();
				var move = {
					x: ((current.w - initial.w)/2)/self.pos.z, 
					y: ((current.h - initial.h)/2)/self.pos.z,
				}
				self.behavior.translateBy(self.dom.container, move.x, move.y);
				resized = false;
			}, 100);
		});


	},
	utils: function(){ var self = this;
		self.utils.getScale = function(z){ // zoom to scale
			return Math.pow(2, z-1);
		}
		self.utils.getZoom = function(s){ // scale to zoom
			return (Math.log(s)/Math.log(2))+1;
		}
		self.utils.getPos = function(shorten=false){
			self.pos = {x : d3.event.transform.x, y : d3.event.transform.y, z : d3.event.transform.k};
			return self.pos;
		}
		self.utils.getScreen = function(){
			return {w: $(window).width(), h: $(window).height()};
		}
		self.utils.getCenter = function(){ // centre of the screen
			var screen = self.utils.getScreen();
			return {'x': screen.w / 2, 'y': screen.h / 2 };
		}
		self.utils.easeInOut = function (t, b, c, d) {
			// t : current time, b : begining - debut, c : change - fin, d : duration
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		}
		self.utils.screenToTable = function(x, y){
			return {
				x: (x - self.pos.x) / self.pos.z, 
				y: (y - self.pos.y) / self.pos.z, 
			};
		}
		self.utils.screenToTableSquare = function(x, y, w, h){
			var coords = {
				x: (x - self.pos.x) / self.pos.z, 
				y: (y - self.pos.y) / self.pos.z, 
				w: (w) / self.pos.z,
				h: (h) / self.pos.z,
			};
			return coords
		}
	},
	enableKeyboard: function(){
		$(document).on('keydown', function(e){
			switch (e.which) {			
				case '+':
				case '=':
				case 187:
					if (e.ctrlKey || e.metaKey){ 
						e.preventDefault();
						A.zoom.actions.scaleBy(1);
					}
					break;
				case '-':
				case 189:
					if (e.ctrlKey || e.metaKey){ 
						e.preventDefault();
						A.zoom.actions.scaleBy(-1);
					}
					break;
				}
		});

	}

};





