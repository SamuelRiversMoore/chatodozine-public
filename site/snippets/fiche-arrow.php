
	<div id="fiche-arrow" class="fiche hidden">
		<h2 class="fiche-title">Flèche</h2>
		<?php snippet('fiche-basic-controls'); ?>
		<div class="button-wrap">
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
