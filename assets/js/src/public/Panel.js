function Panel(){
	this.init();
};

Panel.prototype = {
	init: function(){ var self = this;
		//console.log('Panel ok')
		$(document).ready(function($) {
			self.login();
			self.enableControls();
		});
	},
	enableControls: function(){ var self = this;
		$(document).on('click', '#login-button > a', function(event){
			event.preventDefault();
			self.login.show(function(){setTimeout(function() {document.getElementById("username").select()}, 10);});
			self.login.dom.form.on('submit', function(e){
				e.preventDefault();
				self.login.submit();
			})
		}).on('click', '#login-close', function(event){ 
			self.login.hide();
		})

		$(document).on('keyup', function(e){
			switch (e.which) {
				case 27: // esc
					if (self.login.shown) self.login.hide();
					break;
			}
			
		});	
	},
	login: function(){ var self = this;
		self.login.dom = {};
		self.login.dom.modal = $('#login');
		self.login.dom.form = self.login.dom.modal.find('#login-form');
		self.login.show = function(callback){
			self.login.dom.modal.removeClass('hidden');
			self.login.shown = true;
			if (typeof callback !== 'undefined') {callback()}
		}
		self.login.hide = function(){
			self.login.dom.modal.addClass('hidden');
			self.login.shown = false;
			self.login.dom.form.find('.alert').text('').addClass('hidden');
		}
		self.login.submit = function(){
			var datas_json = A.formToJson(self.login.dom.form);
			var datas = self.login.dom.form.serialize();
			var url = A.url+'/login'+'?login=true&'+datas;
			console.log(datas);
			
			$.ajax({
				type: 'POST',
				url: url,
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				success: function(data){
					console.log(datas_json.target);
					location.href = A.url+'/'+datas_json.target
				},
				error: function(data){
					var response = data.responseText.trim();
					self.login.dom.form.find('.alert').text(response).removeClass('hidden');
				}
			});
			
		}
	}


};