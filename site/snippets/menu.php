
<?php $tables = page('tables')->children()->visible(); ?>
<?php if ($tables->count() > 1): ?>
	<nav id="menu" role="navigation">
		<ul>
			<?php foreach ($tables as $table): ?>
				<li class="<?e($table->isActive(), 'active')?>"><a href="<?=$table->uid()?>">N°<?= $table->num().' - '.$table->title() ?></a></li>
			<?php endforeach ?>
		</ul>
	</nav>
<?php endif ?>
