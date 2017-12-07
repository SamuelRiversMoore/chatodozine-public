

<section id="panel-medias" class="panel hidden">
	<header>
		<button id="medias-close" class="big"><i class="material-icons">&#xE14C;</i></button>
		<button id="medias-update" class="big update-button"><i class="material-icons">&#xE863;</i></button><h2>Medias</h2>
		<div id="medias-create" class="dropdown">
			<button id="create-medias-dropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				<div data-toggle="tooltip" data-placement="bottom" title="<?= e($site->createmediaalt()->isNotEmpty(), $site->createmediaalt(), 'New') ?>">
					<span><?= e($site->createmedia()->isNotEmpty(), $site->createmedia(), 'New') ?></span>
					<span class="caret"></span>					
				</div>
			</button>
			<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="create-medias-dropdown">
				<li><a type="button" class="create-image" data-toggle="modal" data-target="#create-media-image"><i class="material-icons">&#xE3F4;</i><span><?= e($site->titleimage()->isNotEmpty(), $site->titleimage(), 'Image') ?></span></a></li>
				<li><a type="button" class="create-video" data-toggle="modal" data-target="#create-media-video"><i class="material-icons">&#xE02C;</i><span><?= e($site->titlevideo()->isNotEmpty(), $site->titlevideo(), 'Video') ?></span></a></li>
				<li><a type="button" class="create-audio" data-toggle="modal" data-target="#create-media-audio"><i class="material-icons">&#xE023;</i><span><?= e($site->titleaudio()->isNotEmpty(), $site->titleaudio(), 'Audio') ?></span></a></li>
			</ul>
		</div>
	</header>
	<div class="medias-wrapper">
		<div id="medias-settings">
			
		</div>
		<ul id="medias">
			<?php foreach (page('elements')->children()->visible() as $media): ?>
				<?php snippet('medias', array('media'=>$media)); ?>
			<?php endforeach ?>	
		</ul>
	</div>
</section>

<div id="draggable-thumb" class="hidden"><img src=""></div>

