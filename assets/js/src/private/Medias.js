function Medias() {
	this.init();
};
Medias.prototype = {
	init: function() {
		var self = this;
		self.dom = {
			container: d3.select("#panel-medias"),
			wrapper: d3.select("ul#medias"),
			elements: d3.select("ul#medias").selectAll('li.media'),
			modals: $("#editor-modals .modal"),
		}
		self.btn = {
			open: d3.select("#medias-open"),
			close: d3.select("#medias-close"),
			create: {
				image: d3.select("#medias-create ul.dropdown-menu a.create-image"),
				video: d3.select("#medias-create ul.dropdown-menu a.create-video"),
				audio: d3.select("#medias-create ul.dropdown-menu a.create-audio"),
			},
			update: d3.select("#medias-update"),
			delete: self.dom.container.selectAll(".media-delete"),
		}
		self.opened = self.dom.container.classed('hidden') ? false : true;
		self.enableControls();
		self.enableFiche();
	},
	enable: function() {
		if (A.table.enabledTool) A.table.enabledTool.disable();
		A.table.enabledTool = self;
		var self = this;
		self.opened = true;
		self.dom.container.classed('hidden', false);
		A.admin.utils.hideButtons();
	},
	disable: function() {
		A.table.enabledTool = null;
		A.admin.utils.showButtons();
		var self = this;
		self.opened = false;
		self.dom.container.classed('hidden', true);
	},
	enableFiche: function(){ var self = this;
		$(document).ready(function(){
			A.table.editor.fiches.medias = {
				dom : d3.select("#fiche-medias"),
				open: function(){
					this.dom.select('.fiche-title').html(A.table.editor.items.clicked.attr('data-title'));
					this.dom.classed('hidden', false);
				},
				close: function(){
					this.dom.select('.fiche-title').html('');
					this.dom.classed('hidden', true);

				},
				refresh: function(){ var that = this;
					// do nothing
					return;
				},
			}
		});
	},
	enableControls: function() {
		var self = this;
		self.fileUpload = {};
		self.fileUpload.reset = function() {
			self.fileUpload.file = null;
			self.fileUpload.fileName = null;
		}
		self.btn.delete.on('click', function() {
			var element = $(this).closest('li.media');
			var uid = element.data('elem');
			self.delete(uid, element);
		});
		self.btn.update.on('click', function() {
			self.update();
		});
		self.btn.open.on('click', function(e) {
			self.enable();
		});
		self.btn.close.on('click', function() {
			self.disable();
		});
		self.dom.elements.select('.thumb').call(d3.drag().on("start drag end", function() {
			A.table.editor.ux.dragMedia(A.admin.utils.getParent(this, 'li.media'))
		}));
		self.dom.elements.select('button.add-media').on("click", function() {
			A.table.editor.ux.addMedia(d3.select(A.admin.utils.getParent(this, 'li.media')));
			$(this).blur(); // pour empêcher le double appel si on utilise le clavier
		});
		self.btn.create.image.on('click', function(e) {
			// launch modal
			self.enableFileUpload('image');
		});
		self.btn.create.video.on('click', function(e) {
			// launch modal
			self.enableUrl();
		});
		self.btn.create.audio.on('click', function(e) {
			// launch modal
			self.enableFileUpload('audio');
		});
	},
	enableFileUpload: function(type) {
		var self = this;
		self.uploader = {
			'type': type
		}
		self.uploader.wrapper = $('#create-media-' + type + '.modal');
		self.uploader.form = self.uploader.wrapper.find('form.fileupload');
		self.uploader.progress = { 
			container: self.uploader.form.find('.progress'),
			bar: self.uploader.form.find('.progress-bar'),
			title: self.uploader.form.find('.progress-details .title'),
			value: self.uploader.form.find('.progress-details .value'),
		}
		self.uploader.input = {
			'file': self.uploader.form.find('.file-input'),
			'title': self.uploader.form.find('.title-input'),
			'text': self.uploader.form.find('.text-input'),
		};
		self.uploader.container = self.uploader.form.find('.preview-container');
		self.uploader.label = self.uploader.container.find('h5.title');
		self.uploader.preview = self.uploader.container.find('.preview');
		self.uploader.btn = {
			remove: self.uploader.container.find('.button.remove'),
		}
		self.uploader.reveal = function(preview_content) {
			self.uploader.preview.html(preview_content).promise().done(function() {
				self.uploader.label.text(self.uploader.fileName);
				self.uploader.input.title.val(self.uploader.fileName);
				self.uploader.container.removeClass('hidden');
			});
		}
		self.uploader.flush = function(exceptions) {
			if (typeof exceptions === 'undefined') {
				exceptions = []
			}
			self.uploader.container.addClass('hidden');
			self.uploader.label.html('');
			self.uploader.preview.html('');
			self.uploader.progress.bar.css('width', '0');
			self.uploader.progress.value.text('0%');
			self.uploader.progress.container.addClass('hidden');
			$.each(self.uploader.input, function(key, $input) {
				if (exceptions.indexOf(key) <= -1) {
					self.input_clean($input);
				} else {
					$input.closest('.form-group').addClass('has-error');
				}
			});
		}
		self.uploader.input.file.on('change', function(e) {
			self.uploader.file = this.files[0];
			self.uploader.fileName = e.target.value.split('\\').pop();
			if (self.uploader.fileName && self.uploader.file) {
				if (self.uploader.file.type.match('image.*')) {
					// http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
					var reader_image = new FileReader();
					reader_image.onload = function(e) {
						self.uploader.reveal('<img src="' + e.target.result + '">');
					}
					reader_image.readAsDataURL(this.files[0]);
				}
				if (self.uploader.file.type.match('audio.*')) {
					var reader_audio = new FileReader();
					reader_audio.onload = function(e) {
						var player = document.createElement("audio");
						player.src = e.target.result;
						player.setAttribute("type", self.uploader.file.type);
						player.setAttribute("controls", "controls");
						self.uploader.reveal(player);
					}
					reader_audio.readAsDataURL(this.files[0]);
				}
				if (self.uploader.file.type.match('application/pdf') || self.uploader.file.name.match('\.pdf')) {
					self.uploader.reveal('<span class="gros fichier pdf">PDF</span>');
				}
				if (self.uploader.file.type.match('application/msword') || self.uploader.file.type.match('application\/.*officedocument') || self.uploader.file.name.match('\.doc')) {
					self.uploader.reveal('<span class="gros fichier doc">DOC</span>');
				}
			} else {
				self.uploader.flush()
			}
		});
		self.uploader.btn.remove.on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			self.uploader.flush();
		})
		self.uploader.fileupload = self.uploader.input.file.fileupload({
			autoUpload: false,
			dataType: 'json',
			add: function(e, data) {
				var $form = $(this).closest('form'),
					$submitButton = $form.find('input[type="submit"]');
				data.url = A.url + '/upload';
				data.formData = {
					'action': 'create',
					'template': self.uploader.type,
					'element': '',
					'filename': data.files[0].name,
					'title': self.uploader.input.title.val(),
					'text': self.uploader.input.text.val(),
				}
				self.fileReady = data;
				self.modalOpen = $form.closest('.modal');
				$form.on('submit', function(e, data) {
					e.preventDefault();
					self.upload();
				});
			},
			always: function(e, data) {
				/*
				console.log('ok!!!!');
				console.log(data.result);
				console.log(data.textStatus);
				console.log(data.jqXHR);
				*/
			},
			done: function(e, data) {
				$.each(data.result.files, function(index, file) {
					if (self.modalOpen) {
						self.modalOpen.modal('hide');
						self.modalOpen = null;
					}
					self.uploader.flush();
					var $media = $(file.html);
					$media.hide();
					$(self.dom.wrapper.node()).prepend($media);
					$media.slideDown(200, function() {
						self.update();
					});
					// prepend elem
				});
			},
			progressall: function(e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				self.uploader.progress.bar.css('width', progress + '%');
				self.uploader.progress.value.text(progress + '%');
			}
		}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');


	},
	enableUrl: function() {
		var self = this;
		self.embeder = {}
		self.embeder.input = {
			'link': $('#video-url-input'),
			'title': $('#video-title-input'),
			'text': $('#video-text-input'),
		};
		self.embeder.form = self.embeder.input.link.closest('form');
		self.embeder.container = self.embeder.form.find('.preview-container');
		self.embeder.preview = self.embeder.container.find('.preview');
		self.embeder.btn = {
			remove: self.embeder.container.find('.button.remove'),
		}
		self.modalOpen = self.embeder.form.closest('.modal');
		self.embeder.reveal = function(datas) {
			//var htmlContent = '<img src="'+datas.thumb_hd+'">';
			var htmlContent = self.createVideo(datas);
			self.embeder.preview.html(htmlContent).promise().done(function() {
				self.embeder.input.title.val(datas.title);
				self.embeder.input.text.val(datas.text);
				self.embeder.container.removeClass('hidden');
			});
			self.embeder.datas = datas;
		}
		self.embeder.flush = function(exceptions) {
			if (typeof exceptions === 'undefined') {
				exceptions = []
			}
			self.embeder.container.addClass('hidden');
			self.embeder.preview.html('');
			$.each(self.embeder.input, function(key, $input) {
				if (exceptions.indexOf(key) <= -1) {
					self.input_clean($input);
				} else {
					$input.closest('.form-group').addClass('has-error');
				}
			});
		}
		self.embeder.input.link.off().on('input', function(e) {
			self.embeder.url = $(this).val();
			self.embeder.parsedUrl = self.parseVideo(self.embeder.url);
			if (typeof self.embeder.parsedUrl.type !== 'undefined') {
				self.embeder.form.find('.has-error').removeClass('has-error');
				self.getVideoDatas(self.embeder.url, function(data) {
					if (data && typeof data === 'object') {
						self.embeder.reveal(data);
					}
				});
			} else {
				self.embeder.flush(['link']);
			}
		})
		self.embeder.btn.remove.on('click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			self.embeder.flush();
		})
		self.embeder.form.on('submit', function(e) {
			e.preventDefault();
			if (self.embeder.form.find('.has-error').length <= 0) {
				A.ajaxCall('create_video', self.embeder.datas, function(data) {
					if (self.modalOpen) {
						self.modalOpen.modal('hide');
						self.modalOpen = null;
					}
					var $media = $(data);
					$media.hide();
					$(self.dom.wrapper.node()).prepend($media);
					$media.slideDown(200, function() {
						self.update();
					});
				});
			}
		});
	},
	upload: function() {
		var self = this;
		if (A.admin.editmode.enabled !== true) return;
		if (self.fileReady) {
			// faire plus général
			self.fileReady.submit();
			self.btn.update.classed('updating', true);
			self.fileReady = null;
			self.uploader.progress.container.removeClass('hidden');
		}
	},
	delete: function(uid, $element) {
		var self = this;
		if (A.admin.editmode.enabled !== true) return;
		// demander confirmation
		self.modalOpen = $('#delete-media.modal');
		self.modalOpen.on('click', '.submit', function(e) {
			var datas = {
				'uid': uid
			};
			A.ajaxCall('delete_media', datas, function(data) {
				// callback
				if (self.modalOpen) {
					self.modalOpen.modal('hide');
					self.modalOpen = null;
				}
				if (typeof $element !== 'undefined') {
					$element.slideUp(200, function() {
						$element.remove();
						self.update();
						A.table.update();
					})
				}
			});
		});
	},
	update: function() {
		var self = this;
		if (A.admin.editmode.enabled !== true) return;
		self.btn.update.classed('updating', true);
		A.ajaxCall('get_medias_list', '', function(data) {
			// version bourrine
			self.dom.wrapper.html(data);
			// faire un comparateur de listes
			self.btn.update.classed('updating', false);
			self.init();
		});
	},
	modal: function() {
		var self = this;
		self.modal.reset = function() {}
	},
	input_clean: function($input) {
		var self = this;
		$input.wrap('<form>').closest('form').get(0).reset();
		$input.unwrap();
	},
	parseVideo: function(url) {
		url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
		if (RegExp.$3.indexOf('youtu') > -1) {
			var type = 'youtube';
		} else if (RegExp.$3.indexOf('vimeo') > -1) {
			var type = 'vimeo';
		}
		return {
			type: type,
			id: RegExp.$6
		};
	},
	createVideo: function(datas) {
		var self = this;
		// Returns an iframe of the video with the specified URL.
		var $iframe = $('<iframe>', {
			width: datas.width,
			height: datas.width / datas.ratio
		});
		$iframe.attr('frameborder', 0);
		if (datas.type == 'youtube') {
			$iframe.attr('src', '//www.youtube.com/embed/' + datas.video_id);
		} else if (datas.type == 'vimeo') {
			$iframe.attr('src', '//player.vimeo.com/video/' + datas.video_id);
		}
		$iframe = $('<div class="new-iframe-wrapper"></div>').css('padding-top', 100 / datas.ratio + '%').html($iframe);
		return $iframe;
	},
	getVideoDatas: function(url, callback) {
		var self = this;
		// Obtains the video's thumbnail and passed it back to a callback function.
		var videoObj = self.parseVideo(url);
		if (videoObj.type == 'youtube') {
			var apiKey = 'AIzaSyCtF6YnkF0LrdcboqgRWUc0zq4vHzC3Gx4';
			$.get('https://www.googleapis.com/youtube/v3/videos?id=' + videoObj.id + '&key=' + apiKey + ' &fields=items(id,snippet(title,thumbnails,description))&part=snippet', function(data) {
				data = data.items[0];
				var thumb = data.snippet.thumbnails;
				if (typeof data !== "undefined") {
					callback({
						'title': data.snippet.title,
						'type': videoObj.type,
						'video_id': data.id,
						'video_url': url,
						'text': $('<div>' + data.snippet.description + '</div>').text(),
						'thumb_hd': thumb.maxres ? thumb.maxres.url : thumb.high.url,
						'thumb_sd': data.snippet.thumbnails.medium.url,
						'ratio': 16 / 9,
					});
				} else {
					self.embeder.flush(['link'])
				}
			}).fail(function() {
				self.embeder.flush(['link']);
			});
		} else if (videoObj.type == 'vimeo') {

			$.get('http://vimeo.com/api/v2/video/' + videoObj.id + '.json', function(data) {
				data = data[0];
				if (typeof data !== "undefined") {
					callback({
						'title': data.title,
						'type': videoObj.type,
						'video_id': data.id,
						'video_url': data.url,
						'text': $('<div>' + data.description + '</div>').text(),
						'thumb_hd': data.thumbnail_large,
						'thumb_sd': data.thumbnail_large, // thumbnail_medium
						'ratio': data.width / data.height,
					});
				} else {
					self.embeder.flush(['link'])
				}
			}).fail(function() {
				self.embeder.flush(['link']);
			});
		
		}
	},
};