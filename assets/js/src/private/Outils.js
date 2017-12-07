
function Outils(){
	this.init();
};

Outils.prototype = {

	init: function(){ var self = this;

		self.btn = {
			text   : d3.select("#outil-text-button"),
			arrow   : d3.select("#outil-arrow-button"),
		}
		self.enableText();
		self.enableArrow();
		self.enableControls();
	},
	enableControls: function(){ var self = this;

		self.btn.text.on('click', function(e){
			if (self.btn.text.classed('enabled')) {
				self.text.disable(self.btn.text);
			} else {
				self.text.enable(self.btn.text);
			}
		});

		self.btn.arrow.on('click', function(e){
			if (self.btn.arrow.classed('enabled')) {
				self.arrow.disable(self.btn.arrow);
			} else {
				self.arrow.enable(self.btn.arrow);
			}
		});

	},
	enableText: function(){ var self = this;
		self.text = {}
		self.text.enabled = false;
		$(document).ready(function($) {
			self.text.enableFiche();
			self.text.enableSelection();
		});

		self.text.enable = function(){
			if (A.table.enabledTool) A.table.enabledTool.disable();
			A.table.enabledTool = self.text;
			A.zoom.dom.container.classed('selection-mode', true);
			A.zoom.actions.disableDrag();
			self.btn.text.classed('enabled', true);
			var callback = function(coords){
				A.table.editor.ux.addText
				(coords);
				self.text.disable();
			}
			var element = A.zoom.dom.container.append('div').classed('selection-frame', true);
			self.selection.enable(element, callback);
			self.text.enabled = true;
		}
		self.text.disable = function(){
			A.table.enabledTool = null;		
			self.selection.disable();
			self.btn.text.classed('enabled', false);
			A.zoom.dom.container.classed('selection-mode', false);
			A.zoom.actions.reset();
			self.text.enabled = false;
		}
		self.text.enableFiche = function(){
			$(document).ready(function(){
				A.table.editor.fiches.text = {
					dom : d3.select("#fiche-text"),
					hasChanged : false,
					units : {
							'font-size':'px',
							'line-height':'em',
							'padding':'px',
							'padding-top':'px',
							'padding-right':'px',
							'padding-bottom':'px',
							'padding-left':'px',
						},
					open: function(){ var that = this;
						this.opened = true;
						this.dom.item = A.table.editor.items.clicked;
						this.dom.tabs = $(this.dom.node()).find('ul.tabs li.tab a.btn');
						this.dom.textarea = this.dom.select('textarea');
						this.dom.container = this.dom.item.select('.hold');
						this.dom.form = $(this.dom.node()).find('form');
						this.dom.radioBtn = this.dom.form.find('.radioBtn');
						this.dom.form.find('button').on('click', function(e){
							e.preventDefault();
						})
						this.texte = that.dom.container.attr('data-content');
						this.simplemde = new SimpleMDE({
								element: this.dom.textarea.node(),
								hideIcons: ["image", "preview", "side-by-side", "fullscreen"],
								status: false,
								forceSync: true,
								indentWithTabs: false,
								placeholder: 'Votre texte ici',
								spellChecker: false,
								initialValue : this.texte,
							});

						this.dom.tabs.click(function (e) {
							e.preventDefault();
							$(this).tab('show');
							that.refresh();
						})

						// set fiche apparences
						that.setStyle();

						// fiche interaction
						this.dom.select('.fiche-title').html('Annotation');
						this.dom.classed('hidden', false);
						if (this.dom.form.length > 0) {
							this.dom.form.on('input change', 'input, textarea, button', function(e){
								that.getFormData();
							}).on('change', 'select', function(e){
								that.getFormData();
							});
							this.simplemde.codemirror.on("change", function(){
								that.getFormData();
							});
						}

						this.dom.radioBtn.on('click', 'button', function(){
							var value = $(this).data('title');
							var target = $(this).data('toggle');
							var input = $(this).closest('.radioBtn').parent().find('input.radioInput');
							that.setRadio(input, target, value);
							that.getFormData();
						});
					},
					setStyle: function(){ var that = this;
						// set fiche
						this.dom.form.find('input, select').each(function(){
							var value = that.dom.container.style(this.name);
							switch(this.name){
								case "line-height":
									value = parseFloat(value.replace('em', '').replace(',', '.'));
									break;
								case "font-family":
									if (value.indexOf(", ") !== -1) {value = value.split(", ")[0]}
									break;
								case "text-align":
								case "vertical-align":
									that.setRadio($(this), this.name, value);
									break;
								case "color":
								case "background":
								case "background-color":
									value = value;
									break;
								default:
									value = parseFloat(value).toFixed(0);
									break;
							}
							this.value = value;
						});

						// colorpickers
						this.dom.form.find('.colorpicker-component').each(function(){
							$(this).colorpicker({
								container : $(this).find('.input-group-addon'),
								color: $(this).find('input').val()
							})
						});

					},
					setRadio: function(input, target, value){
						input.prop('value', value);
						$('button[data-toggle="'+target+'"]').not('[data-title="'+value+'"]').removeClass('active').addClass('notActive');
						$('button[data-toggle="'+target+'"][data-title="'+value+'"]').removeClass('notActive').addClass('active');
					},
					close: function(){
						this.dom.select('.fiche-title').html('');
						this.dom.select('form.form').classed('hidden', true);
						this.simplemde.toTextArea();
						this.simplemde = null;
						this.dom.textarea.property('value', '');
						this.dom.classed('hidden', true);
						this.dom.form.find('.colorpicker-component').each(function(){
							$(this).colorpicker('hide');
							$(this).colorpicker('destroy');
						});
					},
					refresh: function(){ var that = this;
						// simplemde "empty until focused" bugfix
						this.dom.select('form.form').classed('hidden', false);
						setTimeout(function() { that.simplemde.codemirror.refresh(); }, 0);
					},
					// update table
					getFormData: function(){ var that = this;
						this.storeOriginal();
						var datas = that.dom.form.serializeArray(), formated_data = {styles:'', content:''};
						$.each(datas, function(){
							switch(this.name){
								case "text":
									if (that.simplemde) {
										var html = that.simplemde.options.previewRender(this.value);
										that.dom.container.select('.text-container').html(html);
										that.dom.container.attr('data-content', this.value);
										formated_data.content = this.value;
									}
									break;
								case "font-family":
									if (this.value.indexOf(", ") !== -1) {this.value = this.value.split(", ")[0]}
									that.dom.container.style(this.name, this.value);
									formated_data.styles += this.name+':'+this.value+';';															
									break;
								default:
									var unit = (this.name in that.units) ? that.units[this.name] : '' ;
									that.dom.container.style(this.name, this.value+unit);
									formated_data.styles += this.name+':'+this.value+unit+';';							
									break;
							}
						});
						A.table.editor.changes.storeState(this.dom.item.node());
						return formated_data;
					},
					storeOriginal: function(){ var that = this;
						if (this.hasChanged == false) {
							A.table.editor.changes.storeOriginal(this.dom.item.node());
							this.hasChanged = true;
						}
					}

				}
			});
		}
		self.text.enableSelection = function(){
			self.selection = { start : false } ;
			self.selection.enable = function(element, callback){
				var origin = null, prev = null;
				A.zoom.dom.container
					.on( "mousedown", function() {
						if (self.selection.frame) self.selection.frame.remove();
						origin = { x: d3.mouse(this)[0], y: d3.mouse(this)[1] };
						prev = origin;
						self.selection.exists = true;
						self.selection.frame = element;
						self.selection.frame.style('left', origin.x+'px').style('top', origin.y+'px');
					})
					.on( "mousemove", function() {
						if (self.selection.exists) {
							var p = { x: d3.mouse(this)[0], y: d3.mouse(this)[1] };
							var el = {
								x: parseFloat(self.selection.frame.style('left')),
								y: parseFloat(self.selection.frame.style('top')),
								w: parseFloat(self.selection.frame.style('width')),
								h: parseFloat(self.selection.frame.style('height')),
							};
							var d = { 
								x: ( p.x < (el.x + el.w) && p.x > prev.x ) || p.x <= el.x ? p.x : origin.x,
								y: ( p.y < (el.y + el.h) && p.y > prev.y ) || p.y <= el.y ? p.y : origin.y,
								w: p.x < el.x || ( p.x < (el.x + el.w) && p.x > prev.x ) ? origin.x - p.x : p.x - origin.x ,
								h: p.y < el.y || ( p.y < (el.y + el.h) && p.y > prev.y ) ? origin.y - p.y : p.y - origin.y ,
							};
							prev = p;
							self.selection.frame
								.style('left', d.x+'px').style('top', d.y+'px')
								.style('width', d.w+'px').style('height', d.h+'px');
						}
					})
					.on( "mouseup", function() {
						if (self.selection.exists){
							var coords = {
								x: parseFloat(self.selection.frame.style('left')),
								y: parseFloat(self.selection.frame.style('top')),
								w: parseFloat(self.selection.frame.style('width')),
								h: parseFloat(self.selection.frame.style('height')),
							}
							if(typeof callback !== "undefined") callback(coords);
							self.selection.remove();
						}
					})
			}
			self.selection.remove = function(){
				if (self.selection.exists) {
					self.selection.frame.remove();
					self.selection.exists = false;
				}
			}
			self.selection.disable = function(){
				A.zoom.dom.container
					.on( "mousedown", null)
					.on( "mousemove", null)
					.on( "mouseup", null);
			}
		}
	},

	enableArrow: function(){ var self = this;
		self.arrow = {}
		$(document).ready(function(){
			self.arrow.enableFiche();
		});
		self.arrow.enable = function(){
			if (A.table.enabledTool) A.table.enabledTool.disable();
			A.zoom.actions.disableDrag();
			A.table.enabledTool = self.arrow;
			A.zoom.dom.container.classed('selection-mode', true);
			self.btn.arrow.classed('enabled', true);
			self.arrow.enabled = true;
			var clicked = false;

			A.zoom.dom.container
				.on( "mousedown touchstart", function() {
					if (clicked == true) {
						self.arrow.mouseup(d3.mouse(this));
					} else {
						self.arrow.mousedown(d3.mouse(this));
					}
				})
				.on( "mousemove touchmove", function() {
					if (clicked == true) {
						self.arrow.mousemove(d3.mouse(this));
					}
				})
				.on( "mouseup touchend", function() {
					self.arrow.mouseup(d3.event.type);
				});

			self.arrow.mousedown = function(mouse){
				var pos = A.zoom.utils.screenToTable(mouse[0], mouse[1]);
				self.arrow.points = {
					a : A.zoom.dom.wrapper.append('div').classed('point point-a', true),
					b : A.zoom.dom.wrapper.append('div').classed('point point-b', true),
				}
				self.arrow.makepoint(self.arrow.points.a);
				self.arrow.makepoint(self.arrow.points.b);

				var $new_item = $(A.table.editor.templates['element-note-arrow']);
				$new_item.attr('data-elem', 'arrow');
				$new_item.attr('data-title', 'Flèche');
				$new_item.addClass('hidden');

				self.arrow.item = d3.select($new_item.appendTo(A.zoom.dom.wrapper.node()).get(0));
				self.arrow.item.append('div').classed('line', true);	

				self.arrow.points.a.style('left', pos.x+'px').style('top', pos.y+'px');
				self.arrow.points.b.style('left', pos.x+'px').style('top', pos.y+'px');
				clicked = true;	
			}

			self.arrow.mousemove = function(mouse){
				self.arrow.item.classed('hidden', false);
				var pos = A.zoom.utils.screenToTable(mouse[0], mouse[1]);
				self.arrow.points.b.style('left', pos.x+'px').style('top', pos.y+'px');
				self.arrow.abconnect(self.arrow.item.node(), self.arrow.points.a.node(), self.arrow.points.b.node());
			}

			self.arrow.mouseup = function(type){
				// maybe add a wrapper called item
				self.arrow.removePoints();
				self.arrow.points = null;

				if (self.arrow.item.node().offsetWidth < 15) {
					self.arrow.item.remove()
					self.arrow.item = null;
				} else {
					A.table.editor.items.get();
					A.table.editor.items.new = $(self.arrow.item.node());
					A.table.editor.items.click(self.arrow.item)
					A.table.editor.items.select(self.arrow.item);

					A.table.editor.changes.storeOriginal(self.arrow.item.node(), false)
					A.table.editor.changes.storeState(self.arrow.item.node())						
					self.arrow.disable();
				}	
				clicked = false;
			
			}

		}
		self.arrow.disable = function(){
			A.table.enabledTool = null;
			A.zoom.dom.container
				.on( "mousedown", null)
				.on( "mousemove", null)
				.on( "mouseup", null);
			self.btn.arrow.classed('enabled', false);
			A.zoom.dom.container.classed('selection-mode', false);
			A.zoom.actions.reset();
			self.arrow.enabled = false;
		}
		self.arrow.makepoint = function(point){
			point.append('div').classed('handle', true);
			point.call( d3.drag().on("start drag end", function(){ self.arrow.drag(this)}) );
		}
		self.arrow.select = function(item){
			self.arrow.setup(item);
		}
		self.arrow.removePoints = function(){
			A.zoom.dom.wrapper.selectAll('.point').remove();
			A.zoom.actions.reset();
		}
		self.arrow.setup = function(item){
			if (typeof item !== "undefined") {
				self.arrow.item = item;
			}
			if (self.arrow.item) {
				var angle = self.arrow.get_rotate(self.arrow.item),
					rayon = parseFloat(self.arrow.item.style('width'));

				var a_pos = {
					x: parseFloat(self.arrow.item.style('left')),
					y: parseFloat(self.arrow.item.style('top')),
				}
				var b_pos = self.arrow.getbpos([a_pos.x, a_pos.y], angle, rayon);
			
				self.arrow.points = {
					a : A.zoom.dom.wrapper.append('div').classed('point point-a', true)
						.style('top', a_pos.y+'px').style('left', a_pos.x+'px'),
					b : A.zoom.dom.wrapper.append('div').classed('point point-b', true)
						.style('top', b_pos.y+'px').style('left', b_pos.x+'px'),
					}

				self.arrow.makepoint(self.arrow.points.a);
				self.arrow.makepoint(self.arrow.points.b);
				A.zoom.actions.disableDrag();
			}
		}
		self.arrow.enableFiche = function(){ var self = this;
			A.table.editor.fiches.arrow = {
				dom : d3.select("#fiche-arrow"),
				open: function(){
					this.dom.classed('hidden', false);
				},
				close: function(){
					this.dom.classed('hidden', true);
				},
				refresh: function(){ var that = this;
					return;
				},
			}
		},
		self.arrow.abconnect = function(arrow, cla, clb){
			// ABConnect, MIT
			// https://gist.github.com/raphaelbastide/157aaee7da6d2b761b2a
			var DEGREES = 180 / Math.PI;
			function draw(arrow, cla, clb, update) {
				var a = cla;
				var b = clb;
				// Remove the requestAnimationFrame if you want the line to be always aligned (e.g. even when scrolling)
				requestAnimationFrame(function() {
					if (update) {
						if (a === null || b === null ){
							aVec = [0,0];
							bVec = [0,0];
						}else{
							aVec = elementVect(a);
							bVec = elementVect(b);
						}
					}
					renderLine(arrow, aVec, bVec);
				});
			}
			function elementVect(elt) {
				var rect = elt.getBoundingClientRect();
				var rect = A.zoom.utils.screenToTable(rect.left + (rect.width/2) -1, rect.bottom - (rect.height/2) +1)
				return [rect.x , rect.y];
			}
			function renderLine(arrow, vec1, vec2) {
				// lineVec = vec1 - vec2
				var lineVec = [vec1[0] - vec2[0], vec1[1] - vec2[1]];
				// angle = invert lineVec, then get its angle in degrees
				var radangle = Math.atan2(lineVec[1] * -1, lineVec[0] * -1);
				var angle = radangle * DEGREES;
				// length of lineVec
				var length = Math.sqrt(lineVec[0] * lineVec[0] + lineVec[1] * lineVec[1]);
				arrow.style.top = vec1[1] + 'px';
				arrow.style.left = vec1[0] + 'px';
				arrow.style.width = length + 'px';
				arrow.style.transform = 'rotate(' + angle + 'deg)';
			}
			var aVec = null;
			var bVec = null;

			draw(arrow, cla, clb, true);
		}
		self.arrow.drag = function($this){
			if (A.admin.editmode.enabled !== true) return;
			// récupération des coordonnées d'interaction 
			var d = A.table.editor.ux.getCoords($this);
			switch(d3.event.type) {
				case 'start':
					A.table.editor.changes.storeOriginal(self.arrow.item.node())
					break;
				case 'drag':
					d3.select($this).style('top', d.control.dy+'px').style('left', d.control.dx+'px');
					self.arrow.abconnect(self.arrow.item.node(), self.arrow.points.a.node(), self.arrow.points.b.node());
					break;
				case 'end':
					A.table.editor.changes.storeState(self.arrow.item.node())
					break;
			}
		}
		self.arrow.get_rotate = function(obj) {
			var matrix = 	obj.style("-webkit-transform") ||
							obj.style("-moz-transform")    ||
							obj.style("-ms-transform")     ||
							obj.style("-o-transform")      ||
							obj.style("transform");

			if(matrix !== 'none') {
				var values = matrix.split('(')[1].split(')')[0].split(',');
				var a = values[0];
				var b = values[1];
				var angle = Math.atan2(b, a);
			} else { 
				var angle = 0; 
			}
			return angle;
		}
		self.arrow.rad_to_deg = function(angle){
			return angle * (180/Math.PI);
		}
		self.arrow.getbpos = function(pos, angle, rayon){
			var x = rayon * Math.cos(angle);
			var y = rayon * Math.sin(angle);
			return {'x':pos[0] + x,'y': pos[1] + y}	
		}

	},

};










