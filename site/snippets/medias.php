	
	<?php if ($media->intendedTemplate() == "element-image"): ?>
		<?php if($media->hasFiles()): ?>
		
			<?php $image = $media->image($media->src()); ?>
			<?php if (sizeof($image)): ?> 
				<?php $thumbnail =	thumb($image, array('width' => 120, 'height' => 120, 'crop' => true, )); ?>
				<li class="media image" data-full="<?= $image->url() ?>" data-ratio="<?= $image->ratio() ?>" data-thumb="<?= thumb( $image, array('width' => 120, 'height' => 120, 'crop' => false, ))->url() ?>" data-template="<?= $media->intendedTemplate() ?>" data-elem="<?= $media->uid() ?>">
					<div class="thumb">
						<img style="background:url(<?= $thumbnail->url() ?>) no-repeat center center;">
					</div>
					<div class="content">
						<h3><?= $media->title() ?></h3>
						<small>[<?= $media->uid() ?>]</small>
						<div>						
							<button class="btn add-media small" title="<?= e($site->addbuttonalt(), $site->addbuttonalt(), 'Add') ?>"><?= e($site->addbutton(), $site->addbutton(), 'Add') ?></button>				
						</div>
						<div class="media-buttons">
							<button class="btn media-delete small" data-toggle="modal" data-target="#delete-media"><i class="material-icons">&#xE92B;</i></button>
							<?php /* <button class="media-edit small" data-toggle="modal"><i class="material-icons">&#xE254;</i></button> */ ?>
						</div>
					</div>
				</li>
			<?php endif ?>
		
		<?php endif ?>
	<?php endif ?>

	<?php if ($media->intendedTemplate() == "element-video"): ?>

		<li class="media video <?=$media->type()?>" data-full="<?=$media->thumb_sd()?>" data-ratio="<?=$media->ratio()?>" data-thumb="<?=$media->thumb_sd()?>" data-template="<?=$media->intendedTemplate()?>" data-elem="<?=$media->uid()?>" data-type="<?=$media->type()?>" data-video-id="<?=$media->video_id()?>">
			<div class="thumb">
				<img style="background:url(<?= $media->thumb_sd() ?>) no-repeat center center;">
			</div>
			<div class="content">
				<h3><?= $media->title() ?></h3>
				<small>[<?= $media->uid() ?>]</small>
				<div>						
					<button class="btn add-media small" title="<?= e($site->addbuttonalt(), $site->addbuttonalt(), 'Add') ?>"><?= e($site->addbutton(), $site->addbutton(), 'Add') ?></button>				
				</div>
				<div class="media-buttons">
					<button class="btn media-delete small" data-toggle="modal" data-target="#delete-media"><i class="material-icons">&#xE92B;</i></button>
					<?php /* <button class="media-edit small" data-toggle="modal"><i class="material-icons">&#xE254;</i></button> */ ?>
				</div>
			</div>
		</li>

	<?php endif ?>

	<?php if ($media->intendedTemplate() == "element-audio"): ?>
		<?php if($media->hasFiles()): ?>
			<?php $thumb = kirby()->urls()->assets() . '/images/audio.svg'; ?>
			<?php $audio = $media->files($media->src()); ?>
			<?php if (sizeof($audio)): ?> 
				<li class="media audio" data-file="<?=$audio->url()?>" data-ratio="1" data-thumb="<?=$thumb?>" data-template="<?=$media->intendedTemplate()?>" data-elem="<?=$media->uid()?>">
					<div class="thumb">
						<div class="audiothumb">				
							<i class="material-icons">&#xE050;</i>
						</div>
					</div>
					<div class="content">
						<h3><?= $media->title() ?></h3>
						<small>[<?= $media->uid() ?>]</small>
						<div>						
							<button class="btn add-media small" title="<?= e($site->addbuttonalt(), $site->addbuttonalt(), 'Add') ?>"><?= e($site->addbutton(), $site->addbutton(), 'Add') ?></button>				
						</div>
						<div class="media-buttons">
							<button class="btn media-delete small" data-toggle="modal" data-target="#delete-media"><i class="material-icons">&#xE92B;</i></button>
							<?php /* <button class="media-edit small" data-toggle="modal"><i class="material-icons">&#xE254;</i></button> */ ?>
						</div>
					</div>
				</li>
			<?php endif ?>
		<?php endif ?>
	<?php endif ?>


