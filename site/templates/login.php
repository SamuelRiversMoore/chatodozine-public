
<?php if (!kirby()->request()->ajax()): ?>
	<?php snippet('header') ?>
	<main class="main" role="main">
<?php endif ?>

		<?php if($site->user()): ?>
			<?php $target = (get('target') ? get('target') : '/' ); ?>
			<?php go($target) ?>
		<?php else: ?>
			<?php snippet('login'); ?>
		<?php endif ?>


<?php if (!kirby()->request()->ajax()): ?>
  	</main>
	<?php snippet('footer') ?>
<?php endif ?>
