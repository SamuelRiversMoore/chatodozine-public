function Table(){
	this.init();
};

Table.prototype = { 
	init: function(){ var self = this;
		self.container = $('#zoom-container');
		self.id = self.container.attr('data-id');
		self.btn = {
			'update': null,			
		};
		self.utils();
		self.enableControls();
		self.enableLoading();
		self.enableImages();
		self.enableVideos();
		self.enableAudios();
	},
	utils: function(){ var self = this;
		self.update = function(){
			//if (self.btn.update !== undefined) self.btn.update.classed('updating', true);
			var datas = {
				'page': A.table.id,
			}

			A.ajaxCall('get_table_items', datas, function(data){

				// version bourrine
				A.zoom.dom.wrapper.html(data);
				//if (self.btn.update !== undefined) self.btn.update.classed('updating', false);
				self.init();
				A.table.editor.items.get();
			});
		}
	},
	enableLoading: function(){ var self = this;
		self.loader = {}
		self.loader.element = $('#loading-screen');
		self.loader.reveal = function(){
			self.loader.element.fadeOut('200', function() {
				$(this).remove();
			});
		}
		setTimeout(function() {
			self.loader.reveal();
		}, 2000);

	},
	enableControls: function(){ var self = this;
		$('#logo').on('click', function(e){
			e.preventDefault();
			var win = A.zoom.utils.getScreen();
			A.zoom.actions.zoomToCoords(win.w/2, win.h/2, 1);
		});
		$(document).ready(function() {
			if (A.logged == false){
				A.zoom.dom.wrapper.selectAll('div.item').on("click", function(){ 
					A.zoom.actions.setView(d3.select(this));
				});	
			}
		});
	},
	enableImages: function(){ var self = this;
		self.images = {};
		self.images.items = $('.b-lazy');
		self.images.count = self.images.items.length;
		self.images.counter = 0;
		self.images.bLazy = new Blazy({
			loadInvisible: true,
			container: '#zoom-container',
			success: function(element){
				self.images.counter += 1;
				if(self.images.counter >= self.images.count){
					self.loader.reveal();
				}
				setTimeout(function(){
					var parent = element.parentNode;
					parent.className = parent.className.replace(/\bloading\b/,'');
				}, 200);
			},
		})
		setTimeout(function() {
			self.images.bLazy.load($('.b-lazy'), true);
		}, 300);
		self.images.init = function(){
			self.images.bLazy.revalidate()
		}
	},
	enableVideos: function(){ var self = this;
		self.videos = {};
		self.videos.init = function(){
			var $players = $('#zoom-wrapper').find('.video-player');
			$players.each(function(){
				self.videos.loadSingle($(this));
			})
		}
		self.videos.loadSingle = function($player){
			$player.closest('.item').find('.placeholder').remove();
			if ($player.hasClass('youtube')) self.videos.youtube.loadVideo($player.get(0), $player.data('video_id'));
			if ($player.hasClass('vimeo'))   self.videos.vimeo.loadVideo($player.get(0),   $player.data('video_id'));
		}
		self.videos.youtube = {
			players: {},
			loadVideo: function(container, videoId) {
				if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
					$.getScript('//www.youtube.com/iframe_api', function(){
						self.videos.youtube.loadPlayer(container, videoId);
					});	
				} else {
					self.videos.youtube.loadPlayer(container, videoId);
				}
			},
			loadPlayer: function(container, videoId) {
				var $wrapper = $(container).closest('.iframe-wrapper');
				var $item = $(container).closest('.item');
				var key = $item.data('uniqid');
				self.videos.youtube.players[key] = new YT.Player(container, {
					videoId: videoId,
					width: '100%',
					height: '100%',
					playerVars: {
						disablekb: 1,
						enablejsapi: 1,
						autoplay: 0,
						controls: 0,
						modestbranding: 1,
						rel: 0,
						fs: 0,
						iv_load_policy: 3,
						showInfo: 0,
						autohide:1,
					},
					events: {
			            'onReady': function(){
			            	enableControls();
			            },
						'onStateChange': function(event){
							if (event.data == YT.PlayerState.ENDED) {
								$item = $(event.target.a).closest('.item');
								self.videos.youtube.stop($item)
							}
						}
					}
				});

				function enableControls(){
					$wrapper.find('.overlay').on('click', function(){
						if(typeof A.admin !== 'undefined' && A.admin.editmode.enabled === true ) return;
						var $item = $(this).closest('.item');
						if ($item.hasClass('playing')) {
							//self.videos.youtube.pause($item)
							self.videos.youtube.stop($item)
						} else {
							self.videos.youtube.play($item)
						}
					})
				}
				self.videos.youtube.play = function($item){
					var player = getPlayer($item)
					$item.addClass('playing');
					player.playVideo();
				}
				self.videos.youtube.pause = function($item){
					var player = getPlayer($item)
					$item.removeClass('playing');
					player.pauseVideo();
				}
				self.videos.youtube.stop = function($item){
					var player = getPlayer($item)
					$item.removeClass('playing');
					player.stopVideo();
				}
				self.videos.youtube.stopAll = function(){
					self.videos.youtube.players.each(function(){
						this.stopVideo();
					})
				}
				var getPlayer = function($item){
					var player = self.videos.youtube.players[$item.data('uniqid')];
					return player;
				}
			},


		};
		self.videos.vimeo = {
			players: {},
			loadVideo: function(container, videoId) {
				if (typeof(Vimeo) == 'undefined' || typeof(Vimeo.Player) == 'undefined') {
					$.getScript('//player.vimeo.com/api/player.js', function(){
						self.videos.vimeo.loadPlayer(container, videoId);
					});
				} else {
					self.videos.vimeo.loadPlayer(container, videoId);
				}
				
			},
			loadPlayer: function(container, videoId) {
				var $wrapper = $(container).closest('.iframe-wrapper');
				var $item = $(container).closest('.item');
				var key = $item.data('uniqid');
				self.videos.vimeo.players[key] = new Vimeo.Player(container, {
					id: videoId,
					width: '100%',
					height: '100%',
					title: false,
					autopause: false,
				});

				// enableControls
				self.videos.vimeo.players[key].on('loaded', function() {
					$wrapper.find('.overlay').on('click', function(){
						if(typeof A.admin !== 'undefined' && A.admin.editmode.enabled === true ) return;
						var $item = $(this).closest('.item');
						if ($item.hasClass('playing')) {
							//self.videos.vimeo.pause($item)
							self.videos.vimeo.stop($item)
						} else {
							self.videos.vimeo.play($item)
						}
					})
				});
				self.videos.vimeo.players[key].on('ended', function() {
					var $item = $(this.element).closest('.item');
					self.videos.vimeo.stop($item);
				});

				self.videos.vimeo.play = function($item){
					var player = getPlayer($item)
					$item.addClass('playing');
					player.play();
				}
				self.videos.vimeo.pause = function($item){
					var player = getPlayer($item)
					$item.removeClass('playing');
					player.pause();
				}
				self.videos.vimeo.stop = function($item){
					var player = getPlayer($item)
					$item.removeClass('playing');
					player.unload();
				}
				self.videos.vimeo.stopAll = function(){
					self.videos.vimeo.players.each(function(){
						this.unload();
					})
				}
				var getPlayer = function($item){
					var player = self.videos.vimeo.players[$item.data('uniqid')];
					return player;
				}
			},
		};

		self.videos.init();
	},
	enableAudios: function(){ var self = this;
		self.audios = {}
		self.audios.init = function(){
			self.audios.items = $('#zoom-wrapper').find('div.item.audio');
			self.audios.items.find('audio').on('ended', function(){
				self.audios.pause($(this).closest('.item'));
			})
			self.audios.items.on('click', function(){
				if(typeof A.admin !== 'undefined' && A.admin.editmode.enabled === true ) return;
				if($(this).hasClass('playing')){
					self.audios.pause($(this));
				} else {
					self.audios.play($(this));
				}
			});

		}
		self.audios.init();

		self.audios.play = function($item){
			$item.addClass('playing');
			$item.find('audio').get(0).play()
		}
		self.audios.pause = function($item){
			$item.removeClass('playing');
			$item.find('audio').get(0).pause()
		}
		self.audios.stop = function($item){
			self.audios.pause($item);
			$item.find('audio').get(0).currentTime = 0;
		}
		self.audios.stopAll = function(){
			self.audios.items.each(function(){
				if($(this).hasClass('playing')){
					self.audios.stop($(this));
				};
			})
		}


	},

};