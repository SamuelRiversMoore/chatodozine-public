<div id="create-media-image" class="modal fade" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<form class="fileupload" action="<?= $site->url() ?>" method="post" enctype="multipart/form-data">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="material-icons">&#xE14C;</i></button>
					<h4 class="modal-title"><?= e($site->newimage()->isNotEmpty(), $site->newimage(), 'Nouvelle image') ?></h4>
				</div>
				<div class="modal-body">
					<section class="preview-container hidden">
						<div class="preview image-preview"></div>
						<h5 class="title"></h5>
						<div class="button remove circle" ><i class="material-icons">&#xE14C;</i></duv>
					</section>
					<div class="form-group fileinput-group centered">
						<input class="file-input hiddeninput" name="files[]" id="image-file-input" type="file" accept="image/*" >
						<label class="btn btn-success fileinput-button" for="image-file-input">
							<i class="material-icons">&#xE145;</i><span class="button-text"><?= e($site->selectfile()->isNotEmpty(), $site->selectfile(), 'Sélectionner un fichier…') ?></span>
						</label>
					</div>
					<section class="image-input-wrapper input-wrapper">
						<div class="form-group">
							<label for="image-title-input" class="control-label"><?=e($site->labeltitle()->isNotEmpty(), $site->labeltitle(), 'Titre')?></label>
    						<input type="text" class="title-input form-control" id="image-title-input" required autocomplete="off">
						</div>
						<div class="form-group">
							<label for="image-text-input" class="control-label"><?=e($site->labeltext()->isNotEmpty(), $site->labeltext(), 'Description')?></label>
							<textarea class="text-input form-control" rows="8" id="image-text-input"></textarea>
						</div>

						<!-- tags : http://sliptree.github.io/bootstrap-tokenfield/ -->
					</section>
				</div>
				<div class="progress hidden">
					<div class="progress-bar progress-bar-success"></div>
					<div class="progress-details">
						<div class="title"><?=e($site->progresstext()->isNotEmpty(), $site->progresstext(), 'Merci de patienter…')?></div>
						<div class="value"></div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal"><?= e($site->cancel()->isNotEmpty(), $site->cancel(), 'Annuler') ?></button>
					<button type="submit" class="btn btn-primary submits" name="submit"><?= e($site->Submit()->isNotEmpty(), $site->Submit(), 'Envoyer') ?></button>
				</div>
			</form>
		</div>
	</div>
</div>