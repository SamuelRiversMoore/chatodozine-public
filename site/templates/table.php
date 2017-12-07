<?php snippet('header') ?>
<?php snippet('banner') ?>

<?php $items = $page->items()->toStructure(); ?>
<?php $notes = $page->notes()->toStructure(); ?>

<?php snippet('loading-screen'); ?>

<main id="zoom-container" width="100%" height="100%" class="table" data-id="<?= $page->id() ?>">
	<div id="zoom-wrapper">
		<?php foreach ($items as $item): ?>
			<?php $element = page('elements/'.$item->element()) ?>
			<?php snippet($element->intendedTemplate(), array('page'=>$page, 'element'=>$element, 'item'=>$item)); ?>
		<?php endforeach ?>
		<?php foreach ($notes as $note): ?>
			<?php if($note->type() == 'text'): ?>
				<?php snippet('element-note-text', array('note'=>$note)); ?>
			<?php endif ?>
			<?php if($note->type() == 'arrow'): ?>
				<?php snippet('element-note-arrow', array('arrow'=>$note)); ?>
			<?php endif ?>
		<?php endforeach ?>
	</div>
</main>

<?php snippet('edito'); ?>

<?php snippet('interface'); ?>
<?php snippet('modals', array('page'=>$page)) ?>

<?php snippet('footer') ?>

<script type="text/javascript">
	var tableJson = <?= $page->toJson() ?>;
</script>