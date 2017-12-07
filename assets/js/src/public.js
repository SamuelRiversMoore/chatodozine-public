

var A;
$(document).ready(function(){
	
	var logo = d3.select('.logo'),
		infobutton = d3.select('#info-button');
	logo.on("mouseenter click", function(){
		skeww(logo.select('img'));
	});

	infobutton.on("mouseenter click", function(){
		skeww(infobutton.select('img'));
	});

	function skeww(item){
		item.transition()
			.duration(600)
			.attr("style", "transform:skewX("+getRand(-50, 40)+"deg);")
	}
	function getRand(min, max){
		var num = Math.random() * (max*2) + min;
		return num;
	}

	/*===================================
	=            INFO PANEL            =
	===================================*/

	if ($('#info-button').length){

		var edito = {
			dom: $('#edito'),
			menu: $("#sticky-sidebar"),
			menuitems:$("#sticky-sidebar").find("a.scroll"),
			btn: {
				open: $('#info-button'),
			},
			opened: false,
			menuclicked: false,
			open: function(){
				this.dom.removeClass('hidden');
				this.opened = true;
				this.sticky = new Waypoint.Sticky({
					element: this.menu[0],
					context: this.dom,
				});
				this.scroll(edito.dom[0]);
			},
			close: function(){
				this.dom.addClass('hidden');
				this.opened = false;
				this.sticky.destroy();		
			},
			topOffset : $(window).height() / 6,
			scrollItems: function(){
				edito.menuitems.map(function(){
					var item = $($(this).attr("href"));
					if (item.length) { return item; }
				})
			},
			scroll: function(target){ var self = this;
				if (self.opened == false) {return;}
				if (self.menuclicked == false) {
					var cur = self.scrollItems.map(function(){
						if ($(this).offset().top < self.topOffset){ 
							return this; 
						}
					});
					// Get the id of the current element
					cur = cur[cur.length-1];
					var id = cur && cur.length ? cur[0].id : "";
					// Set/remove active class
					edito.menuitems.parent().removeClass("active")
						.end().filter("[href='#"+id+"']").parent().addClass("active");
				}
			},
			scrollTo: function(target){ var self = this;
				this.menuclicked = true;
				//calculate destination place
				var dest = $(target.hash).position().top + 25;
				edito.menuitems.parent().removeClass("active");
				$(target).parent().addClass('active');

				//go to destination
				edito.dom.animate({
					scrollTop: dest
				}, 500, 'swing', function(){
					self.menuclicked = false;
				});
			}
		}
		edito.scrollItems = edito.menuitems.map(function(){
			var item = $($(this).attr("href"));
			if (item.length) { return item; }
		});

		var throttled = false;
		window.addEventListener('resize', function() {
			if (!throttled) {

				edito.topOffset = $(window).height() / 6;

			    throttled = true;
				setTimeout(function() {
					throttled = false;
				}, 100);
			}
		});

		edito.menu.on("click touchend", 'a.scroll', function (event) {
			event.preventDefault();
			edito.scrollTo(this)
		});

		// Bind to scroll
		edito.dom.on('scroll', function(){
			edito.scroll(this);
		});

		edito.btn.open.on('click', function(){
			edito.open();
		})
		edito.dom.on('click', '.cross, .clickable-bg', function(){
			edito.close();
		});
		// on load
		if (edito.dom.hasClass('hidden') == false) {
			edito.open();
		}
	}

	A = new Archipels();


});


function Archipels(){
	this.init();
};
Archipels.prototype = {
	init: function(){ var self = this;

		self.utils();
		self.url = rootUrl;
		self.panel	= new Panel();
		self.logged = false;


		if ( document.getElementById('zoom-container') ) { 
			self.zoom = new Zoom(); 
			if(self.zoom.dom.container.classed('table')){
				self.table = new Table();
			}
			if(self.zoom.dom.container.classed('atlas')) {
				self.atlas = new Atlas();
			}
		}

		$( document ).ready(function() {
			//console.log('ready');
			// tooltips
			$('[data-toggle="tooltip"]').each(function(){
				var placement = $(this).data('placement') ? $(this).data('placement') : 'auto';
				$(this).tooltip({
					delay: { "show": 500, "hide": 100 },
					placement: placement,
					viewport: { selector: 'body', padding: 4 },
					trigger : 'hover',
				})
			});

		});

	},
	utils: function(){ var self = this;
		self.ajaxCall = function(request, datas, callback){ 
			if (typeof datas == 'undefined') { datas = ''};
			$.ajax({
				type: 'POST',
				url: self.url+'/ajax', // attention à l'url!!!
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: { request: request, datas:datas },
				success: function(data){
					if (typeof callback != 'undefined') callback(data);
				},
				error: function(data){
					//console.log(data);
				}
			});
		}
		self.formToJson = function(form){
			var o = {};
			var a = form.serializeArray();
			$.each(a, function() {
				if (o[this.name] !== undefined) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		}
	}

}


