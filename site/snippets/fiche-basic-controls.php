<div class="button-wrap fiche-controls hidden">
	<span class="index-buttons">
		<button class="btn increase small btn btn-default" data-toggle="tooltip" data-placement="bottom" title="<?= e($site->increasepos(), $site->increasepos(), 'Increase') ?>">
			<i class="material-icons">&#xE25A;</i>
		</button>
		<button class="btn decrease small btn btn-default" data-toggle="tooltip" data-placement="bottom" title="<?= e($site->decreasepos(), $site->decreasepos(), 'Decrease') ?>">
			<i class="material-icons">&#xE258;</i>
		</button>
	</span>					
	<button class="btn remove-button small" data-toggle="tooltip" data-placement="bottom" title="<?= e($site->removebuttonalt(), $site->removebuttonalt(), 'Remove') ?>">
		<i class="material-icons">&#xE872;</i>
	</button>
</div>