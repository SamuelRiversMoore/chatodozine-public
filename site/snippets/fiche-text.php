
	<div id="fiche-text" class="fiche hidden">
		<h2 class="fiche-title"></h2>
		<?php snippet('fiche-basic-controls'); ?>
		<form class="form hidden">
			<section class="params">	
				<div class="form-group">
					<ul class="tabs btn-group btn-group-justified" role="tablist">
						<li role="presentation" class="tab btn-group active">
							<a href="#text-contenu" class="btn btn-default" aria-controls="text-contenu" role="tab" data-toggle="tab">Contenu</a>
						</li>
						<li role="presentation" class="tab btn-group">
							<a href="#text-apparences" class="btn btn-default" aria-controls="text-apparences" role="tab" data-toggle="tab">Apparences</a>
						</li>
					</ul>
				</div>
				<div class="tab-content">
					<div role="tabpanel" class="tab-pane active" id="text-contenu">
						<div class="form-group">
							<textarea class="form-control" rows="3" name="text"></textarea>
						</div>
					</div>
					<div role="tabpanel" class="tab-pane" id="text-apparences">
						<div class="form-group">
							<label>Typographie</label>
							<select class="form-control" name="font-family">
								<option value="whoismono">Whois mono</option>
								<option value="worksans">Work sans</option>
							</select>
						</div>
						<div class="form-group">
			  				<div class="row">
				  				<div class="col-md-6">
				  					<label>Taille du texte</label>
				  					<div class="input-group">
									    <input type="number" min="1" value="16" step="1" data-step="1" class="form-control" name="font-size" />
									    <span class="input-group-addon">px</span>
									</div>
				  				</div>
				  				<div class="col-md-6">
				  					<label>Interlignage</label>
				  					<div class="input-group">
									    <input type="number"  min="0" value="1.35" step="0.01" data-step="0.01" class="form-control" name="line-height"/>
									    <span class="input-group-addon">em</span>
									</div>
				  				</div>
							</div>
						</div>
						<div class="form-group">
			  				<div class="row">
				  				<div class="col-md-6">
									<label>Couleur du texte</label>
									<div id="cp1" class="input-group colorpicker-component">
									    <input type="text" value="#000" class="form-control" name="color"/>
									    <span class="input-group-addon"><i></i></span>
									</div>
				  				</div>
				  				<div class="col-md-6">
									<label>Couleur d'arrière plan</label>
									<div id="cp2" class="input-group colorpicker-component">
									    <input type="text" value="#fff" class="form-control" name="background-color"/>
									    <span class="input-group-addon"><i></i></span>
									</div>			
								</div>
							</div>
						</div>
		  				<div class="row">
			  				<div class="col-sm-6">
								<div class="form-group">
				  					<label>Marge haute</label>
				  					<div class="input-group">
									    <input type="number" min="0" class="form-control padding" step="1" data-step="1" name="padding-top" title="Haut" />
									    <span class="input-group-addon">px</span>
									</div>
								</div>
			  					<div class="form-group">
				  					<label>Marge gauche</label>
				  					<div class="input-group">
									    <input type="number" min="0" class="form-control padding" step="1" data-step="1" name="padding-left" title="Gauche" />
									    <span class="input-group-addon">px</span>
									</div>
								</div>
			  				</div>
			  				<div class="col-sm-6">
			  					<div class="form-group">
				  					<label>Marge basse</label>
				  					<div class="input-group">
									    <input type="number" min="0" class="form-control padding" step="1" data-step="1" name="padding-bottom" title="Bas" />
									    <span class="input-group-addon">px</span>
									</div>
			  					</div>
			  					<div class="form-group">
				  					<label>Marge droite</label>
				  					<div class="input-group">
									    <input type="number" min="0" class="form-control padding" step="1" data-step="1" name="padding-right" title="Droite" />
									    <span class="input-group-addon">px</span>
									</div>
								</div>
			  				</div>
						</div>
						<div class="form-group">
			  				<div class="row">
				  				<div class="col-sm-6">
									<label>Alignement horizontal</label>
									<div class="radioBtn btn-group">
										<button type="button" class="btn btn-default active" aria-label="Left Align" data-toggle="text-align" data-title="left">
											<span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
										</button>
										<button type="button" class="btn btn-default" aria-label="Center Align" data-toggle="text-align" data-title="center">
											<span class="glyphicon glyphicon-align-center" aria-hidden="true"></span>
										</button>
										<button type="button" class="btn btn-default" aria-label="Right Align" data-toggle="text-align" data-title="right">
											<span class="glyphicon glyphicon-align-right" aria-hidden="true"></span>
										</button>
										<button type="button" class="btn btn-default" aria-label="Justify" data-toggle="text-align" data-title="justify">
											<span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
										</button>
									</div>
				    				<input type="hidden" name="text-align" class="radioInput">
								</div>
					  			<div class="col-sm-6">
									<label>Alignement vertical</label>
									<div class="radioBtn btn-group">
										<button type="button" class="btn btn-default active" aria-label="Top Align" data-toggle="align-items" data-title="flex-start">
											<span class="glyphicon glyphicon-object-align-top" aria-hidden="true"></span>
										</button>
										<button type="button" class="btn btn-default" aria-label="Middle Align" data-toggle="align-items" data-title="center">
											<span class="glyphicon glyphicon-object-align-horizontal" aria-hidden="true"></span>
										</button>
										<button type="button" class="btn btn-default" aria-label="Bottom Align" data-toggle="align-items" data-title="flex-end">
											<span class="glyphicon glyphicon-object-align-bottom" aria-hidden="true"></span>
										</button>
									</div>
				    				<input type="hidden" name="align-items" class="radioInput">
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</form>
		<div class="button-wrap form-group">
			<button class="btn save-button hidden small" title="<?= e($site->savemodifsalt(), $site->savemodifsalt(), 'Save') ?>">
				<span class="button-text"><?= e($site->savemodifs(), $site->savemodifs(), 'Save') ?></span>
			</button>
			<button class="btn edit-button hidden small" title="<?= e($site->edititemalt(), $site->edititemalt(), 'Edit') ?>">
				<span class="button-text"><?= e($site->edititem(), $site->edititem(), 'Edit') ?></span>
			</button>
			<button class="btn cancel-button hidden small"  title="<?= e($site->cancelbuttonalt(), $site->cancelbuttonalt(), 'Cancel') ?>">
				<span class="button-text"><?= e($site->cancelbutton(), $site->cancelbutton(), 'Cancel') ?></span>
			</button>					
		</div>
	</div>
