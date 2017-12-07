<?php if($user = $site->user()): ?>
	<div id="editor-modals" class="modals">
		<?php if ($page->intendedTemplate() == 'table'): ?>
			<?php snippet('modal_create-media-image'); ?>
			<?php snippet('modal_create-media-audio'); ?>
			<?php snippet('modal_create-media-video'); ?>
			<?php snippet('modal_delete-media'); ?>
		<?php endif ?>
	</div>
<?php else: ?>
	<div id="visitor-modals" class="modals">
		<?php snippet('modal_login', array('page'=>$page)); ?>
	</div>
<?php endif ?>