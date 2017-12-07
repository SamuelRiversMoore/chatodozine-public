<div id="create-media-video" class="modal fade" tabindex="-1" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<form class="video-upload" action="<?= $site->url() ?>" method="post" enctype="multipart/form-data">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="material-icons">&#xE14C;</i></button>
					<h4 class="modal-title"><?= e($site->newvideo()->isNotEmpty(), $site->newvideo(), 'Nouvelle video') ?></h4>
				</div>
				<div class="modal-body">
					<section class="preview-container hidden">
						<div class="preview video-preview"></div>
						<div class="button remove circle" ><i class="material-icons">&#xE14C;</i></duv>
					</section>
					<section class="video-input-wrapper input-wrapper">
						<div class="form-group">
							<label for="video-url-input" class="control-label"><?=e($site->videolinktitle()->isNotEmpty(), $site->videolinktitle(), 'URL de la vidéo')?></label>
							<div class="input-group url-input-group">
								<span class="input-group-addon" aria-hidden="true"><i class="material-icons">&#xE157;</i></span>
								<input id="video-url-input" type="text" class="url-input form-control" placeholder="<?=e($site->videoplaceholder()->isNotEmpty(), $site->videoplaceholder(), 'youtube ou vimeo')?>" aria-describedby="video-url-input" required autocomplete="off">
							</div>
						</div>
						<div class="form-group">
							<label for="video-title-input" class="control-label"><?=e($site->labeltitle()->isNotEmpty(), $site->labeltitle(), 'Titre')?></label>
    						<input type="text" class="title-input form-control" id="video-title-input" required autocomplete="off">
						</div>
						<div class="form-group">
							<label for="video-text-input" class="control-label"><?=e($site->labeltext()->isNotEmpty(), $site->labeltext(), 'Description')?></label>
							<textarea class="text-input form-control" rows="8" id="video-text-input"></textarea>
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
					<button type="submit" class="btn btn-primary submit" name="submit"><?= e($site->Submit()->isNotEmpty(), $site->Submit(), 'Envoyer') ?></button>
				</div>
			</form>
		</div>
	</div>
</div>