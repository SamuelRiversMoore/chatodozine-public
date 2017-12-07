<?php
	if (isset($element) && isset($item)) { // fill the template
		$image = $element->image($element->src());
		$thumb = thumb($image, array(
			'width' => 800,
			'height' => 800,
			'quality' => 80,	
		));

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
			'src="'.thumb($image, array('width' => 100, 'height'=>100, 'blur' => true))->url().'"'.
			'data-src="'.$thumb->url().'"'.
			'style="left:'.$item->itemLeft().'%; '.
					'top:'.$item->itemTop().'%; '.
					'width:'.$item->itemWidth().'%; '.
					'height:'.$item->itemHeight().'%; "'. 
			'data-width="'.$item->itemWidth().'"'.
			'data-height="'.$item->itemHeight().'"'.
			'data-top="'.$item->itemTop().'"'.
			'data-left="'.$item->itemLeft().'"';

		if ($item->itemWidth() == '100' && $item->itemHeight() == '100') {
			$wrapper_class = 'limits';
		} else {
			$wrapper_class = '';
		}

	} else { // empty template
		$wrapper_attr = '';
		$wrapper_class = 'limits';
		$content_attr = '';
	}

?>


<div class="item <?=$wrapper_class?>" <?=$wrapper_attr?> data-fiche="medias">
	<figure class="wrapper">
		<img class="hold b-lazy" <?=$content_attr?>>
	</figure>

	<div class="controls">
		<div class="bar top"></div><div class="bar right"></div><div class="bar bottom"></div><div class="bar left"></div>
		<div class="handle top left"></div><div class="handle top right"></div><div class="handle bottom right"></div><div class="handle bottom left"></div>
		<div class="spot center"></div>
	</div>
</div>

