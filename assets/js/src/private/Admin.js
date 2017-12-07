


// general functions and initialisation

function Admin(){
	this.init();
};

Admin.prototype = {

	init: function(){ var self = this;
		if (typeof A !== 'undefined') {
			if (typeof A.table !== 'undefined'){
				A.table.medias = new Medias();
				A.table.editor = new Editor();
				A.table.outils = new Outils();
				self.enableEditmode();
				self.enableKeyboard();
			} 
			if (typeof A.atlas !== 'undefined'){

			}
		}
		//console.log('Admin ok');
	},
	utils: {
		getAbsolutePosition : function (el) {
			var doc	= document,
				win	= window,
				body = doc.body,

				// pageXOffset and pageYOffset work everywhere except IE <9.
				offsetX = win.pageXOffset !== undefined ? win.pageXOffset :
					(doc.documentElement || body.parentNode || body).scrollLeft,
				offsetY = win.pageYOffset !== undefined ? win.pageYOffset :
					(doc.documentElement || body.parentNode || body).scrollTop,

				rect = el.getBoundingClientRect();

			if (el !== body) {
				var parent = el.parentNode;

				// The element's rect will be affected by the scroll positions of
				// *all* of its scrollable parents, not just the window, so we have
				// to walk up the tree and collect every scroll offset. Good times.
				while (parent !== body) {
					offsetX += parent.scrollLeft;
					offsetY += parent.scrollTop;
					parent	 = parent.parentNode;
				}
			}

			return {
				bottom: rect.bottom + offsetY,
				height: rect.height,
				left	: rect.left + offsetX,
				right : rect.right + offsetX,
				top	 : rect.top + offsetY,
				width : rect.width
			};
		},
		getParent : function(el, selector){
			if ($(el).is(selector)) {
				return el;
			} else {
				var parent = el.parentNode;
				while ($(parent).is(selector) == false && parent !== document.body) { parent = parent.parentNode; }
				return parent;
			}
		},
		showButtons: function(){
			A.table.medias.btn.open.classed('hidden', false);
			$.each(A.table.outils.btn, function(){ this.classed('hidden', false); })
		},
		hideButtons: function(){
			A.table.medias.btn.open.classed('hidden', true);
			$.each(A.table.outils.btn, function(){ this.classed('hidden', true); })
		},
	},
	enableEditmode: function(){ var self = this;
		self.editmode = {
			btn : {
				enable: d3.select("#edit-mode-toggle"),
			}
		}
		self.editmode.init = function(){
			if (self.editmode.btn.enable.property('checked') == true) { self.editmode.enable() } else { self.editmode.disable() }
			self.editmode.btn.enable.on('change', function(){
				if (self.editmode.enabled == true) {
					self.editmode.disable();
				} else {
					self.editmode.enable();
				}
			});
		}
		self.editmode.enable = function(){
			self.utils.showButtons();
			A.zoom.dom.container.on("dblclick.zoom", null);
			self.editmode.enabled = true;
			A.table.audios.stopAll();
			self.editmode.btn.enable.property('checked', true);
		}
		self.editmode.disable = function(){
			self.utils.hideButtons();
			A.zoom.actions.reset();
			self.editmode.enabled = false;
			self.editmode.btn.enable.property('checked', false);
			A.table.editor.dom.items.classed('hovered', false);
		}
		self.editmode.init();
	},
	enableKeyboard: function(){
		var editor = A.table.editor;
		var medias = A.table.medias;
		function isText(){return ['TEXTAREA'].indexOf(document.activeElement.tagName) > -1 ? 1 : 0};
		function isInput(){return ['INPUT'].indexOf(document.activeElement.tagName) > -1 ? 1 : 0};
		function isAny(){return (isInput() || isText()) ? 1 : 0};
		function shiftKeyMultiply (e){
			if (e.shiftKey && e.type == 'keydown') {
				var attrVal = document.activeElement.getAttribute("data-step");
				if (attrVal)  document.activeElement.setAttribute("step", attrVal*10);
			} else {
				var attrVal = document.activeElement.getAttribute("data-step");
				if (attrVal)  document.activeElement.setAttribute("step", attrVal);
			}
		}

		$(document).on('keydown', function(e){
			switch (e.which) {
				case 13: // enter
					if (isInput()) { e.preventDefault(); break; }
					if (medias.fileReady) {
						e.preventDefault();
						medias.upload();
						break;
					}
					break;
				case 16: // shift
					if (isInput()) { shiftKeyMultiply(e); break; }
					if (editor.items.selected) editor.shiftKeyPressed = true;
					break;
				case 38: // top
					if (isAny()) { break; }
					if (editor.items.selected){
						var move = {'x':0, 'y':-1};
						editor.ux.moveItem(editor.items.selected, move)
					}
					break;
				case 37: // left
					if (isAny()) { break; }
					if (editor.items.selected){
						var move = {'x':-1, 'y':0};
						editor.ux.moveItem(editor.items.selected, move)
					}
					break;
				case 40: // bottom
					if (isAny()) { break; }
					if (editor.items.selected){
						var move = {'x':0, 'y':1};
						editor.ux.moveItem(editor.items.selected, move)
					}
					break;
				case 39: // right
					if (isAny()) { break; }
					if (editor.items.selected){
						var move = {'x':1, 'y':0};
						editor.ux.moveItem(editor.items.selected, move)
					}
					break;
				case 83: // s
					if (e.ctrlKey || e.metaKey){ 
						if (editor.items.selected) {
							e.preventDefault();
							editor.changes.save();
							editor.items.unselect();
							break;
						}
					}
					break;
				case 67: // c
					if (e.ctrlKey || e.metaKey){ 
						if (isAny()) { break; }
						if (editor.items.selected) {
							editor.items.copy();
							e.preventDefault();
							break;
						}
					}
					break;
				case 86: // v
					if (e.ctrlKey || e.metaKey){ 
						if (isAny()) { break; }
						if (editor.items.selected) {
							editor.items.paste();
							e.preventDefault();
							break;
						}
					}
					break;
				case 68: // d
					if (e.ctrlKey || e.metaKey){ 
						if (editor.items.selected) {
							editor.items.duplicate();
							e.preventDefault();
							break;
						}
					}
					break;
				case 90: // z
					if (e.ctrlKey || e.metaKey){ 
						if (editor.items.selected) {
							editor.changes.restore();
							break;
						}
						if (editor.items.clicked) {
							editor.items.unclick();
							break;
						}
					}
					break;
				}
			
		}).on('keyup', function(e){
			switch (e.which) {
				case 16: // shift
					if (isInput()) { shiftKeyMultiply(e); break; }
					if (editor.items.selected) editor.shiftKeyPressed = false;
					break

				case 27: // esc
					if (isAny()) { break; }
					if (A.table.outils.selection && A.table.outils.selection.exists) { A.table.outils.selection.remove(); break;}
					if (A.table.outils.text.enabled) { A.table.outils.text.disable(); break;}
					if (editor.items.selected) {
						editor.changes.restore();
						break;
					}
					if (editor.items.clicked) {
						editor.items.unclick();
						break;
					}
					if (medias.enabled) {
						medias.disable();
						break;
					}
					if (A.admin.editmode.enabled) {
						A.admin.editmode.disable();
						break;
					}
					if (A.admin.editmode.enabled == false) {
						A.admin.editmode.enable();
						break;
					}
					break;
				case 13: // enter
					if (isText()) { e.preventDefault(); break; }
					if (medias.modalOpen) {
						medias.modalOpen.find('button[type="submit"]').click();
						break;	
					}
					if (editor.items.selected) {
						editor.changes.save();
						editor.items.unselect();
						break;
					}
					if (editor.items.clicked) {
						editor.items.unclick();
						break;
					}
					break;
				case 8: // delete
					if (isAny()) { break; }
					if (editor.items.clicked) {
						e.preventDefault();
						editor.items.remove();
					}
					break;			
			}
		});

	}


};