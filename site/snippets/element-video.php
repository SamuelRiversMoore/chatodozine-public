
<?php
	if (isset($element) && isset($item)) { // fill the template
		$wrapper_attr =     
			'style="left:'.$item->wrapLeft().'px; '.
					'top:'.$item->wrapTop().'px; '.
					'width:'.$item->wrapWidth().'px; '.
					'height:'.$item->wrapHeight().'px; '.
					'z-index:'.$item->zindex().'; "'.
			'data-elem="'.$element->uid().'"'.
			'data-title="'.$element->title().'"'.
			'data-uniqid="'.$item->uniqid().'"';


		$content_attr = 
			'style="left:'.$item->itemLeft().'%; '.
					'top:'.$item->itemTop().'%; '.
					'width:'.$item->itemWidth().'%; '.
					'height:'.$item->itemHeight().'%; "'. 
			'data-width="'.$item->itemWidth().'"'.
			'data-height="'.$item->itemHeight().'"'.
			'data-top="'.$item->itemTop().'"'.
			'data-left="'.$item->itemLeft().'"';

		$player_attr = 
			'class="video-player '.$element->type().'"'.
			'data-video_id="'.$element->video_id().'"';

		


	} else { // empty template
		$wrapper_attr = '';
		$wrapper_class = 'limits';
		$content_attr = '';
		$content_type = '';
		$player_attr = 'class="video-player"';
	}

?>


<div class="item video iframe" <?=$wrapper_attr?> data-fiche="medias">
	<figure class="wrapper">
		<div class="hold" <?=$content_attr?>>
			<div class="iframe-wrapper">	
				<div <?=$player_attr?>></div>
				<div class="overlay"></div>
			</div>

		</div>
	</figure>

	<div class="controls">
		<div class="handle top left"></div><div class="handle top right"></div><div class="handle bottom right"></div><div class="handle bottom left"></div>
	</div>
</div>



