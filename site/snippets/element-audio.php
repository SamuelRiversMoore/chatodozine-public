
<?php
	if (isset($element) && isset($item)) { // fill the template
		$audio = $element->file($element->src());

		$wrapper_attr =     
			'style="left:'.$item->wrapLeft().'px; '.
					'top:'.$item->wrapTop().'px; '.
					'width:'.$item->wrapWidth().'px; '.
					'height:'.$item->wrapHeight().'px; '.
					'z-index:'.$item->zindex().'; "'.
			'data-elem="'.$element->uid().'"'.
			'data-title="'.$element->title().'"'.
			'data-uniqid="'.$item->uniqid().'"';

		$content_attr = 'src="'.$audio->url().'"';

	} else { // empty template
		$wrapper_attr = '';
		$wrapper_class = 'limits';
		$content_attr = '';
	}
?>


<div class="item audio" <?=$wrapper_attr?> data-fiche="medias">
	<figure class="wrapper">
		<div class="hold">
			<audio <?=$content_attr?> controls preload="none"></audio>
			<div class="audio-button">
				<img class="symbole is_play" src="<?= kirby()->urls()->assets() . '/images/audio_play.svg'?>">
				<img class="symbole is_stop" src="<?= kirby()->urls()->assets() . '/images/audio.svg'?>">
			</div>
		</div>
	</figure>

	<div class="controls">
		<div class="handle top left"></div><div class="handle top right"></div><div class="handle bottom right"></div><div class="handle bottom left"></div>
	</div>
</div>



