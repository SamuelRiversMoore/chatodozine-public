
function Editor(){
	this.init();
};

Editor.prototype = {

	init: function(){ var self = this;

		A.ajaxCall('get_items_templates', null, function(data){
			self.templates = data;
		});

		self.dom = {
			thumb : d3.select("#draggable-thumb"),
		}
		self.btn = {}

		// table params
		//A.table.btn.update = d3.select('#table-update');
		//A.table.btn.update.on('click', A.table.update)

		// params
		self.items.selected = null;
		self.shiftKeyPressed = false;

		self.enableFiches();
		self.enableControls();
		self.changes();
		self.items();

		//console.log('Editor ok');
	},
	enableControls: function(){ var self = this;

		// enable ux
		self.ux();

		A.zoom.dom.container
			.on("touchstart", function(){ d3.event.preventDefault() })
			.on("touchmove", function(){ d3.event.preventDefault() })
			.on('click', function(){ 
				if (self.changes.hasChanged == false) {
					self.items.unselect(); 
				} 
			})

		self.enableIndexButtons = function(){
			self.btn.index.select('button.increase')
				.on('click', function(){
					if (self.items.selected) { self.setIndex(self.items.selected,	1)}
				});

			self.btn.index.select('button.decrease')
				.on('click', function(){
					if (self.items.selected) { self.setIndex(self.items.selected, -1)}
				});

			self.setIndex = function($element, modif){
				self.changes.storeOriginal($element.node(), false)
				var index = parseInt(self.items.selected.style('z-index'))
				if (isNaN(index)) {index = 0}
				$element.style('z-index', index+modif);
				self.changes.storeState($element.node())
			}
		}

	},
	enableFiches: function(){ var self = this;
		self.fiches = {};
		self.fiches.open = function(target){
			self.fiches.opened = self.fiches[target];
			self.fiches.opened.open();
			A.admin.utils.hideButtons();
		}
		self.fiches.close = function(){
			if (self.fiches.opened) {
				A.admin.utils.showButtons();
				self.fiches.opened.close();
				self.fiches.opened = null;
			}	
		}
		self.fiches.refresh = function(){
			if (self.fiches.opened) {
				self.fiches.opened.refresh();
			}			
		}
	},
	items: function() { var self = this;
		self.items.get = function(){ 
			self.dom.items = A.zoom.dom.wrapper.selectAll('div.item')
							 .on("mouseenter", function(){ self.ux.hover(this, 'enter') })
							 .on("mouseleave", function(){ self.ux.hover(this, 'leave') })
							 .on("click", function(){ self.ux.click(this) });
		}
		self.items.select = function($item){ 
			if (A.admin.editmode.enabled !== true) return;
			if (self.items.selected && self.items.selected !== $item) {
				self.items.unselect();
			}
			if(self.items.selected === null || self.items.selected !== $item){
				self.btn.edit.classed('hidden', true);
				self.btn.cancel.classed('hidden', false);
				self.btn.index.classed('hidden', false);

				self.items.selected = $item;
				A.zoom.dom.wrapper.classed("ghostly", true);
				if (self.items.selected.classed('arrow') == true) {
					A.table.outils.arrow.select(self.items.selected);
				} else {
					var $selected = self.items.selected.classed("selected", true).call( self.behaviour.drag );
					self.elemRatio = parseInt($selected.style('width')) / parseInt($selected.style('height'));
					$selected.selectAll('.bar').call( self.behaviour.frame );
					$selected.selectAll('.spot').call( self.behaviour.spot );	
					$selected.selectAll('.handle').call( self.behaviour.resize );
					if ($selected.classed('text') == true) {
						$selected.selectAll('.handle').on('dblclick', function(){
							var direction = $(this).hasClass('top') ? 'bottom' : 'top';
							self.ux.adjust_to_text_content($selected, direction);
						})
					}
					
				}

				self.fiches.refresh();

				if (self.items.new == null) {
					// enable remove Button
					self.btn.remove.on('click', function(){
						d3.event.stopPropagation();
						self.items.remove();
					})					
				}
				self.btn.cancel.on('click', function(){
					self.changes.restore();
				})
				self.btn.save.on('click', function(){
					self.changes.save();
					self.items.unselect();
				});
				self.btn.ctrls.classed('hidden', false);

			}
		}
		self.items.unselect = function(){ 
			self.items.unclick();
			if(self.items.selected){
				if (self.items.selected.classed('arrow')) {A.table.outils.arrow.removePoints();}
				A.zoom.dom.wrapper.classed("ghostly", false);
				self.items.selected.classed('selected', false);
				self.items.selected.on(".drag", null); // total unbind
				self.items.selected = null;
			}
		}
		self.items.click = function($item){ 
			if (A.admin.editmode.enabled !== true) {
				A.zoom.actions.setView($item);
				return;
			}
			if (self.items.selected === null) {
				if (self.items.clicked && self.items.clicked != $item) {
					self.items.unclick();
				}
				if(self.items.clicked === null || self.items.clicked !== $item){		
					self.items.clicked = $item;
					self.fiches.open(self.items.clicked.attr('data-fiche'));
					var fiche = self.fiches.opened.dom;
					self.btn = {
						edit   : fiche.select(".edit-button"),
						remove : fiche.select(".remove-button"),
						save   : fiche.select(".save-button"),
						cancel : fiche.select(".cancel-button"),
						index  : fiche.select(".index-buttons"),
						ctrls  : fiche.select(".fiche-controls"),
					}	
					A.zoom.dom.wrapper.classed("transparently", true);
					self.items.clicked.classed('clicked', true);
					self.enableIndexButtons();

					// enable edit Button
					self.btn.edit.classed('hidden', false);
					self.btn.edit.on('click', function(){
						d3.event.stopPropagation();
						self.items.select(self.items.clicked);
					})
					self.items.clicked.on('click', function(e){
						d3.event.stopPropagation();
						self.items.select(self.items.clicked);
					})

				}
			}
		}
		self.items.unclick = function(){ 
			if(self.items.clicked){
				// to do : enable double click
				A.zoom.dom.wrapper.classed("transparently", false);
				self.fiches.close();
				self.dom.items.classed("clicked", false);
				self.btn.ctrls.classed('hidden', true);
				self.btn.remove.on("click", null);
				self.btn.edit.classed('hidden', true);
				self.btn.edit.on("click", null);
				self.items.clicked.on("click", null);
				self.items.clicked = null;
				self.items.get();
			}
		}
		self.items.remove = function(){ 
			if (A.admin.editmode.enabled !== true) return;
			var target = self.items.clicked;
			if (target) {
				var call = 'remove_item';
				var element = target.attr('data-elem');				
				var uniqid = target.attr('data-uniqid');
				var datas = {
					'page': A.table.id,
					'element': element,
					'uniqid': uniqid,
					'field': target.classed('note') ? 'notes' : 'items',
				}
				var callback = function(data){
					target.remove();
					if (target.classed('arrow')) A.table.outils.arrow.removePoints()
					self.items.unselect();
					self.changes.reset();
				};
				if (uniqid) {
					A.ajaxCall(call, datas, callback);
				} else {
					callback();
				}	

			}
		}
		self.items.clip = null;
		self.items.copy = function(){
			if (self.items.selected) {
				self.items.clip = { 
					dom: $(self.items.selected.node()).clone().attr('style', '').attr('data-uniqid', ''),
					w: parseFloat(self.items.selected.style('width')),
					h: parseFloat(self.items.selected.style('height')),
				}
			}
		}
		self.items.paste = function(){
			var callback = function(){
				self.items.unselect();
				var item = self.items.clip;
				var center = A.zoom.utils.getCenter();
				var coords = { 
					x: center.x - (item.w * A.zoom.pos.z) /2, 
					y: center.y - (item.h * A.zoom.pos.z) /2, 
					w: item.w * A.zoom.pos.z, 
					h: item.h * A.zoom.pos.z
				};
				self.ux.item_to_table(item.dom, coords); 
			}
			self.changes.save(callback);
			//self.items.clipboard = null;
		}
		self.items.duplicate = function(drag = false){
			self.items.copy();
			self.items.paste();
		}
		// init
		self.items.new = null;
		self.items.get();
	},

	// Fonction pour sauvegarder des changements sur la table (uniquement)
	changes: function(){ var self = this;
		self.changes.buffer = null;
		self.changes.hasChanged = false;
		self.changes.storeOriginal = function($this, storage){ 
			self.changes.target = $this;
			if (typeof storage === 'undefined') { storage = true}
			if (storage == true) {
				if (self.changes.hasChanged == false) {
					self.changes.original = $this.cloneNode(true);
					self.changes.original.className = self.changes.original.className
															.replace('hovered','').replace('clicked','').replace('selected','');
				}
			} else {
				self.changes.original = null;
			}
		}
		self.changes.storeState = function($this){
			self.changes.buffer = $this.cloneNode(true);
			self.changes.buffer.className = self.changes.buffer.className
												.replace('hovered','').replace('clicked','').replace('selected','');
			if ($(self.changes.original).prop('outerHTML') !== $(self.changes.buffer).prop('outerHTML')){
				self.changes.hasChanged = true;
				self.btn.save.classed('hidden', false);
			}
		}
		self.changes.restore = function(){
			if (self.items.new) {
				self.items.remove(self.items.clicked);
			} else {
				self.btn.save.classed('hidden', true);
				if(self.changes.target){
					$(self.changes.target).replaceWith($(self.changes.original));
				}
				self.changes.reset();
				self.items.unselect();
			}
		}
		self.changes.save = function(savecallback){
			if (self.changes.hasChanged == true) {
				var $wrapper = $(self.changes.buffer);
				var data = {
					'uniqid': 		$wrapper.data('uniqid'),
					'wrapleft':	 	parseFloat($wrapper.css('left')),
					'wraptop':		parseFloat($wrapper.css('top')),
					'wrapheight': 	parseFloat($wrapper.css('height')),
					'wrapwidth':	parseFloat($wrapper.css('width')),
					'zindex': 		isNaN(parseInt($wrapper.css('z-index'))) ? 0 : parseInt($wrapper.css('z-index')),
					'index': 0,
				}
				var $content = $wrapper.find('.hold');
				if ($content.length) {
					data['itemleft']	= parseFloat($content.css('left'));
					data['itemtop']		= parseFloat($content.css('top'));
					data['itemheight']	= parseFloat($content.css('height'));
					data['itemwidth']	= parseFloat($content.css('width'));
				}	

				if ($wrapper.hasClass('note')) {
					if ($wrapper.hasClass('text')) {
						data['type'] = 'text';
						var formData = self.fiches.text.getFormData();
						$.each(formData, function(key,value){ data[key] = value; });
					}
					if ($wrapper.hasClass('arrow')) {
						data['type'] = 'arrow';
						data['transform'] =  $wrapper.get(0).style.transform;
					}
				}
				var datas = {
					'page':A.table.id,
					'element': $wrapper.data('elem'),
					'data':data,
					'field':$wrapper.hasClass('note')?'notes':'items',
				}

				if ($wrapper.data('uniqid')) {
					var call = 'update_item';
					var callback = function(data){ 
						self.changes.reset(); 
						if ($wrapper.hasClass('arrow')) A.table.outils.arrow.removePoints()
						if (typeof savecallback != "undefined") savecallback();
					};
				} else {
					if (self.items.new) {
						var call = 'create_item';
						var target = self.changes.target;
						var callback = function(data){
							if ('uniqid' in data) { 
								var $item = $(self.changes.target);
								self.changes.target.setAttribute('data-uniqid', data['uniqid']);
								if ($item.hasClass('audio')) A.table.audios.init();
								if ($item.hasClass('video')) A.table.videos.loadSingle($item.find('.video-player'));
								if ($item.hasClass('arrow')) A.table.outils.arrow.removePoints();
							}
							self.changes.reset();
							if (typeof savecallback != "undefined") savecallback();
						};				
					}
				}
				A.ajaxCall(call, datas, callback);
			} else {
				if (typeof savecallback != "undefined") savecallback();
			}
		}
		self.changes.reset = function(){
			self.btn.save.classed('hidden', true);
			self.btn.cancel.classed('hidden', true);
			self.changes.hasChanged = false;
			self.changes.target = null;
			self.changes.original = null;
			self.items.new = null;
			self.items.get();
		}

	},

	/*----------	INTERACTION	----------*/
	
	ux: function(){ var self = this;

		// liste les items et load le listener
		self.behaviour = {}
		self.behaviour.drag 	= d3.drag().on("start drag end", function(){ self.ux.drag(this)});
		self.behaviour.resize 	= d3.drag().on("start drag end", function(){ self.ux.resize(this)});
		self.behaviour.spot 	= d3.drag().on("start drag end", function(){ self.ux.spot(this)});
		self.behaviour.frame 	= d3.drag().on("start drag end", function(){ self.ux.frame(this)});


		self.ux.hover = function($this, action) {
			if (A.admin.editmode.enabled !== true) return;
			if (A.table.outils.text.enabled === true) return;
			if (A.table.outils.arrow.enabled === true) return;
			if( self.items.selected === null && d3.select($this).classed('clicked') == false){
				if (action == 'enter') {
					if (self.hovered) { self.hovered.classed('hovered', false); self.hovered = null; }
					if (self.items.clicked !== d3.select($this)) {
						self.hovered = d3.select($this).classed('hovered', true);					
					}
				}
				if (action == 'leave') {
					if (self.hovered) { self.hovered.classed('hovered', false); self.hovered = null;}
				}
			}
		}

		self.ux.click = function($this) {
			self.ux.hover($this, 'leave');
			d3.event.stopPropagation();
			if (d3.event.defaultPrevented) return;// dragged
			self.items.click(d3.select($this));
		}

		self.ux.drag = function($this) {
			if (A.admin.editmode.enabled !== true) return;
			// récupération des coordonnées d'interaction 
			var d = self.ux.getCoords($this);
			switch(d3.event.type) {
				case 'start':
					var $item = A.admin.utils.getParent($this,'.item');
					self.changes.storeOriginal($item)
					self.items.originalpos = d
					break;
				case 'drag':
					// application des coordonnées
					var o = self.items.originalpos;
					if (d.control.element.classed('selected')) {
						if (self.shiftKeyPressed) { 
							if (Math.abs(d.control.dx - o.control.dx) > Math.abs(d.control.dy - o.control.dy)) {
								// horizotal uniquement
								d.control.element.style('top', o.control.dy+'px').style('left', d.control.dx+'px');						
							} else {
								// vertical uniquement
								d.control.element.style('top', d.control.dy+'px').style('left', o.control.dx+'px');						
							}
						} else {
							d.control.element.style('top', d.control.dy+'px').style('left', d.control.dx+'px');						
						}
					}
					break;
				case 'end':
					var $item = A.admin.utils.getParent($this,'.item');
					self.changes.storeState($item)
					self.items.originalpos = null;
					break;
			}
		}

		self.ux.spot = function($this) {
			// récupération des données d'interaction 
			var d = self.ux.getCoords($this);
			switch(d3.event.type) {
				case 'start':
					var $item = A.admin.utils.getParent($this,'.item');
					self.changes.storeOriginal($item)
					break;
				case 'drag':
					if (d.wrapper.element.classed('selected')) {
						d.control.element.classed('moved', true);

						// limites de déplacement du contenu : on stop quand le bord est atteint
						if (d.content.dx >= 0) { d.content.dx = 0 }
						if (d.content.dy >= 0) { d.content.dy = 0 }
						if (d.content.dx <= (d.content.width - d.wrapper.width) * -1 ) { d.content.dx = (d.content.width - d.wrapper.width) * -1; }
						if (d.content.dy <= (d.content.height - d.wrapper.height) * -1 ) { d.content.dy = (d.content.height - d.wrapper.height) * -1; }

						// application des coordonnées à la poignée
						d3.select($this).style('top', d.control.dy+'px').style('left', d.control.dx+'px');

						// conversion des coordonnées en pourcentages
						d.content.dx = (d.content.dx * 100 / d.wrapper.width);
						d.content.dy = (d.content.dy * 100 / d.wrapper.height);

						// application des coordonnées au contenu
						d.content.element.style('top', d.content.dy+'%').style('left', d.content.dx+'%')
								.attr('data-top', d.content.dy).attr('data-left', d.content.dx);
					}
					break;
				case 'end':
					if (d.control.element.classed('moved')) {
					d.control.element.classed('moved', false);
					d.control.element
						.transition().duration(100).style("top", d.wrapper.height/2+"px").style("left", d.wrapper.width/2+"px")
						.transition().duration(0).style("top", '50%').style("left", '50%');

					}
					var $item = A.admin.utils.getParent($this,'.item');
					self.changes.storeState($item)
					break;
			}
		}
		self.ux.moveItem = function($item, move){
			self.changes.storeOriginal($item.node());
			if (self.shiftKeyPressed) { var factor = 10 } else { var factor = 1 }
			if (A.zoom.pos.z >= 1) { var zoomLevel = 1 } else { var zoomLevel = A.zoom.pos.z }
			var newCoords = {
				'x': parseFloat($item.style('left')) + (move['x'] * factor / zoomLevel), 
				'y': parseFloat($item.style('top'))	+ (move['y'] * factor / zoomLevel)
			}
			$item.style('top', newCoords['y']+'px').style('left', newCoords['x']+'px');
			self.changes.storeState($item.node())
		}

		self.ux.resize = function($this) { 
			// récupération des coordonnées d'interaction 
			var d = self.ux.getCoords($this, 'sides');
			var $item = A.admin.utils.getParent($this,'.item');

			switch(d3.event.type) {
				case 'start':
					self.changes.storeOriginal($item)
					break;
				case 'drag':
					// si on garde le ratio
					if (self.shiftKeyPressed == false && $($item).hasClass('text') === false) {
						if (d.decalage.x > d.decalage.y) { 
							// drag Y
							d.wrapper.newTop = d.wrapper.top + d.pointer.y;
							d.wrapper.newWidth = d.wrapper.newHeight * self.elemRatio;
							if (d.control.element.classed('top left')){ 
								d.wrapper.newLeft = d.wrapper.left + (d.wrapper.width - d.wrapper.newWidth); 
							}
						} else {
							// drag X
							d.wrapper.newLeft = d.wrapper.left + d.pointer.x;
							d.wrapper.newHeight = d.wrapper.newWidth / self.elemRatio;
							if (d.control.element.classed('top left')){ 
								d.wrapper.newTop = d.wrapper.top + (d.wrapper.height - d.wrapper.newHeight);
							} 
						}
					}
					d.wrapper.element.style('width', d.wrapper.newWidth+'px').style('height', d.wrapper.newHeight+'px')
									 .style('top', d.wrapper.newTop+'px').style('left', d.wrapper.newLeft+'px');
					break;
				case 'end':
					var $item = A.admin.utils.getParent($this,'.item');
					self.changes.storeState($item)
					break;
			}

		}
		self.ux.adjust_to_text_content = function($this, direction = 'bottom'){
			var margin_bottom = 14, contentHeight = 0 - margin_bottom;

			$this.select('.text-container').selectAll('p').each(function(){
				contentHeight += parseFloat(d3.select(this).style('height')) + margin_bottom;
			});
			if (direction == 'bottom') {
				var originalHeight = parseFloat($this.style('height')),
					originalTop = parseFloat($this.style('top')),
					newTop = originalTop + (originalHeight - contentHeight);
				$this.style('top', newTop+'px').style('height', contentHeight+'px')
			} else {
				$this.style('height', contentHeight+'px')
			}
		}
		self.ux.frame = function($this) {
			
			// récupération des coordonnées d'interaction 
			var d = self.ux.getCoords($this, 'sides');
			// blocage du cadre pour ne pas dépasser le contenu 
			var limitX = false, limitY = false;
			if (d.wrapper.newWidth >= d.content.width) {
				d.wrapper.newWidth = d.content.width, d.wrapper.newLeft = d.wrapper.left, limitX = true;
				if (d.control.element.classed('top') || d.control.element.classed('left')){ d.wrapper.newLeft = (d.wrapper.left + d.wrapper.width - d.content.width) }
			}
			if (d.wrapper.newHeight >= d.content.height) {
				d.wrapper.newHeight = d.content.height, d.wrapper.newTop = d.wrapper.top, limitY = true; 
				if (d.control.element.classed('top') || d.control.element.classed('left')){ d.wrapper.newTop = (d.wrapper.top + d.wrapper.height - d.content.height) }
			}

			// pour empêcher l'element de se déplacer quand on drag les barres top ou left
			if (d.control.element.classed('top') || d.control.element.classed('left')){
				d.content.left = d.content.left - d.pointer.x;
				d.content.top = d.content.top - d.pointer.y;
				if (d.content.left > 0) d.content.left = 0;
				if (d.content.top > 0) d.content.top = 0;
			}

			// pour cacher le spot si les limites sont atteintes
			if (limitX == true && limitY == true) { d.wrapper.element.classed('limits', true) } else { d.wrapper.element.classed('limits', false) }

			// pour déplacer le contenu si il est hors cadre d'un coté et que la limite n'est pas atteinte
			if (d.control.element.classed('top') || d.control.element.classed('left')){
				if (d.control.left <= (d.content.width - d.wrapper.width)  * -1 ) { d.control.left = (d.content.width - d.wrapper.width) * -1; }
				if (d.control.top <= (d.content.height - d.wrapper.height) * -1 ) { d.control.top  = (d.content.height - d.wrapper.height) * -1; }
			}			
			if (d.control.element.classed('bottom') || d.control.element.classed('right')){
				if (d.wrapper.width >= (d.content.width + d.content.left) ) { d.content.left = d.wrapper.width - d.content.width; }
				if (d.wrapper.height >= (d.content.height + d.content.top) ) { d.content.top = d.wrapper.height - d.content.height; }
			}

			// actualisation du cadre
			d.wrapper.element.style('width', d.wrapper.newWidth+'px').style('height', d.wrapper.newHeight+'px')
				.style('top', d.wrapper.newTop+'px').style('left', d.wrapper.newLeft+'px');

			switch(d3.event.type) {
				case 'start':
					var $item = A.admin.utils.getParent($this,'.item');
					self.changes.storeOriginal($item)
					break;
				case 'drag':
					// application des coordonnées
					d.content.element.style('top', d.content.top+'px')
									 .style('left', d.content.left+'px')
									 .style('height', d.content.height+'px')
									 .style('width', d.content.width+'px');
					break;
				case 'end':
					// calcule en % et on actualisation de l'élément
					d.content.left 	 = d.content.left * 100 / d.wrapper.newWidth;
					d.content.top 	 = d.content.top * 100 / d.wrapper.newHeight;
					d.content.width  = d.content.width * 100 / d.wrapper.newWidth;
					d.content.height = d.content.height * 100 / d.wrapper.newHeight;

					d.content.element.style('top', d.content.top+'%').style('left', d.content.left+'%')
							.style('height', d.content.height+'%').style('width', d.content.width+'%')
							.attr('data-top', d.control.top).attr('data-left', d.control.left)
							.attr('data-height', d.content.height).attr('data-width', d.content.width);

					self.elemRatio = parseFloat(d.wrapper.element.style('width')) / parseFloat(d.wrapper.element.style('height'));	

					var $item = A.admin.utils.getParent($this,'.item');
					self.changes.storeState($item)
					break;
			}
		}


		// ajout d'élémént depuis la médiathèque
		self.ux.dragMedia = function($media) { 
			if (self.items.selected) {
				// a debuger -> quand multiple items draggés à la suite
				self.items.unselect();
			}

			var viewportOffset = A.admin.utils.getAbsolutePosition($media);
			var top = viewportOffset.top, left = viewportOffset.left;
			var scrollY = $('#panel-medias .medias-wrapper').scrollTop();
			var pointer = {'x':d3.event.x + left, 'y': top + d3.event.y - scrollY};
			var $media = d3.select($media);

			switch(d3.event.type) {
				case 'start':
					self.dom.thumb.select('img').attr('src', $media.attr('data-thumb'));
					self.dom.thumb.style('top', '-1000px').style('left', '-1000px').classed('hidden', false);
					break;
				case 'drag':
					// application des coordonnées au thumb
					var thumbCenter = {'x':parseFloat(self.dom.thumb.style('width')) / 2, 'y':parseFloat(self.dom.thumb.style('height')) / 2};
					self.dom.thumb.style('left', pointer.x - thumbCenter.x +'px').style('top', pointer.y	- thumbCenter.y +'px');
					$media.classed('selected', true);
					if(d3.event.x <= -10){
						// pour cacher le panel (à débuger)
						// A.table.medias.dom.container.classed('hidden', true);
					} 
					break;
				case 'end':
					if(d3.event.x >= -10){
						// retour à la position originale
						self.dom.thumb.transition()
							.duration(100)
							.style("top", top+'px')
							.style("left", left+'px')
							.transition()
							.duration(0)
							.style('top', '-1000px').style('left', '-1000px').on("end", function(){
								self.dom.thumb.classed('hidden', true);
								$media.classed('selected', false);				
							});

					} else {
						// add media on table
						self.ux.addMedia($media, pointer);						
					}
					break;
			}
		}
		self.ux.addText = function(coords){
			var $new_item = $(self.templates['element-note-text']);
			$new_item.attr('data-elem', 'text')
			$new_item.attr('data-title', 'Texte')
			self.ux.item_to_table($new_item, coords);
		}
		self.ux.addMedia = function($media, coords) { 
			if (typeof $media !== "undefined"){
				// if not dragged
				if (self.dom.thumb.classed('hidden') == true){
					self.dom.thumb.select('img').attr('src', $media.attr('data-thumb'));
					self.dom.thumb.style('top', '-1000px').style('left', '-1000px').classed('hidden', false);				
				}

				// taille de l'item basée sur le thumb
				var itemRatio = parseFloat($media.attr('data-ratio')),
					itemWidth = parseFloat(self.dom.thumb.select('img').style('width')),
					itemHeight = itemWidth / itemRatio;
				
				var thumbSize = {w:parseFloat(self.dom.thumb.style('width')), h:parseFloat(self.dom.thumb.style('height'))};

				// get from template
				var $new_item = self.ux.media_to_item($media);

				if (typeof coords === "undefined"){
					var center = A.zoom.utils.getCenter();
					var coords = { x:center.x, y:center.y, w:thumbSize.w, h:thumbSize.h };
				}

				// remplissage pour les fiches
				$new_item.attr('data-elem', $media.attr('data-elem'))
				$new_item.attr('data-title', $media.select('h3').text())
				
				// hide thumb
				$media.classed('selected', false);				
				self.dom.thumb.classed('hidden', true).style('top', '-1000px').style('left', '-1000px');

				coords = {x: coords.x - thumbSize.w/2, y: coords.y - thumbSize.h/2, w: itemWidth, h: itemHeight,};

				// add to table
				self.ux.item_to_table($new_item, coords);
			}
		}
		self.ux.media_to_item = function($media){
			var template = $media.attr('data-template');
			var $new_item = $(self.templates[template]);
			var $content  = $new_item.find('.hold');

			switch(template){
				case 'element-image':
					$content.attr('src', $media.attr('data-full'))
					break;
				case 'element-video':
					$content.append('<div class="placeholder"><img style="background:url('+$media.attr('data-full')+') no-repeat center center;"></div>');
					$new_item.find('.video-player').addClass($media.attr('data-type')).attr('data-video_id', $media.attr('data-video-id'));
					break;
				case 'element-audio':
					$content.find('audio').attr('src', $media.attr('data-file'));
					break;
				default:
					break;
			}
			return $new_item;

		}
		self.ux.item_to_table = function($new_item, coords) {

			var coords = A.zoom.utils.screenToTableSquare(coords.x, coords.y, coords.w, coords.h);
			//newcoords = A.zoom.utils.screenToTableSquare(coords.x, coords.y);
			// convertir x y avec zoom (ou pas?)

								//x:center.x-item.w/2, y:center.y-item.h/2,
								//var center = A.zoom.utils.getCenter();

			self.items.new = $new_item;
			self.items.new.css('width', coords.w).css('height', coords.h).css('left', coords.x).css('top', coords.y );
			self.items.new.find('.hold').css('width', '100%').css('height', '100%').css('top', '0%').css('left', '0%');

			self.items.new.appendTo(A.zoom.dom.wrapper.node());

			self.items.get();
			self.items.click(d3.select(self.items.new.get(0)))
			self.items.select(d3.select(self.items.new.get(0)));

			// save
			var $item = A.admin.utils.getParent(self.items.new.get(0), '.item');
			self.changes.storeOriginal($item, false)
			self.changes.storeState($item)

		}
		self.ux.getCoords = function($this, params){
			if (typeof params == 'undefined') params = [];
			var d = {};

			// enveloppe de l'élément ciblé
			d['wrapper'] = {};
			d['wrapper']['element'] = d3.select(A.admin.utils.getParent($this, '.item'));
			d['wrapper']['width'] 	= parseFloat(d.wrapper.element.style('width'));
			d['wrapper']['height'] 	= parseFloat(d.wrapper.element.style('height'));
			d['wrapper']['left'] 	= parseFloat(d.wrapper.element.style('left'));
			d['wrapper']['top'] 	= parseFloat(d.wrapper.element.style('top'));

			// contenu de l'élément ciblé
			d['content'] = {};
			d['content']['element'] = d.wrapper.element.select('.hold');
			d['content']['left'] 	= parseFloat(d.content.element.style('left'));
			d['content']['top'] 	= parseFloat(d.content.element.style('top'));
			d['content']['width']	= parseFloat(d.content.element.style('width'));
			d['content']['height']	= parseFloat(d.content.element.style('height'));

			// élément ciblé par le click (poignée ou élément draggé)
			d['control'] = {};
			d['control']['element']	= d3.select($this);
			d['control']['left'] 	= parseFloat(d.control.element.style('left'));
			d['control']['top']		= parseFloat(d.control.element.style('top'));


			// pointeur de la souris (si souris il y a)
			if (d3.event) {
				d['pointer'] = {};
				d['pointer']['x']	= Math.round(d3.event.x	/ A.zoom.pos.z );
				d['pointer']['y']	= Math.round(d3.event.y	/ A.zoom.pos.z );
				d['pointer']['dx'] 	= Math.round(d3.event.dx / A.zoom.pos.z );
				d['pointer']['dy'] 	= Math.round(d3.event.dy / A.zoom.pos.z );				

				d['content']['dx'] 	= d.content.left + d.pointer.dx;
				d['content']['dy'] 	= d.content.top	+ d.pointer.dy;

				d['control']['x']	= d.control.left + d.pointer.x,
				d['control']['y']	= d.control.top	+ d.pointer.y,
				d['control']['dx'] 	= d.control.left + d.pointer.dx,
				d['control']['dy'] 	= d.control.top	+ d.pointer.dy
			}


			// 
			if(params == 'sides'){
				d['decalage'] = {'x':d.wrapper.width, 'y':d.wrapper.height},	d['compensation'] = {'x':0, 'y':0};

				var $el = d.control.element;
				if ($el.classed('top')) 	{ d.decalage.y = d.pointer.y * -1; 	d.compensation.y = d.wrapper.height; }
				if ($el.classed('left')) 	{ d.decalage.x = d.pointer.x * -1; 	d.compensation.x = d.wrapper.width;	}
				if ($el.classed('bottom')) 	{ d.decalage.y = d.pointer.y; 		d.compensation.y = 0; d.pointer.y = 0;}
				if ($el.classed('right')) 	{ d.decalage.x = d.pointer.x; 		d.compensation.x = 0; d.pointer.x = 0;}				

				// si on tient un bord
				if ( ($el.classed('top') || $el.classed('bottom')) == true	&& ($el.classed('left') || $el.classed('right')) == false ){ d.pointer.x = 0; }
				if ( ($el.classed('top') || $el.classed('bottom')) == false && ($el.classed('left') || $el.classed('right')) == true	){ d.pointer.y = 0; }

				d['wrapper']['newHeight'] 	= d.decalage.y + d.compensation.y;
				d['wrapper']['newWidth']	= d.decalage.x + d.compensation.x;
				d['wrapper']['newTop']		= d.wrapper.top + d.pointer.y;
				d['wrapper']['newLeft']		= d.wrapper.left + d.pointer.x;

			}
			return d;

		}

	},

};

