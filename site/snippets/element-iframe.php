
<?php
	if (isset($element) && isset($item)) { // fill the template
		$wrapper_attr =     
			'style="left:'.$item->wrapLeft().'px; '.
					'top:'.$item->wrapTop().'px; '.
					'width:'.$item->wrapWidth().'px; '.
					'height:'.$item->wrapHeight().'px; '.
					'z-index:'.$item->zindex().'; "'.
			'data-elem="'.$element->uid().'"'.
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

		if ($item->itemWidth() == '100' && $item->itemHeight() == '100') {
			$wrapper_class = 'limits';
		} else {
			$wrapper_class = '';
		}
		
		$iframe = '';
		$url = $element->link();
		if (strpos($url, 'youtube')) {
			$iframe = embed::youtube($url, array('class'=>'yolo', 'vuvu'=>'coin'));
		} else if (strpos($url, 'vimeo')){
			$iframe = embed::vimeo($url, array('class'=>'yolo', 'vuvu'=>'coin'));
		}
		//$iframe_attr = '<iframe width="560" height="315" src="https://www.youtube.com/embed/7yj5WBGt7lk" frameborder="0" allowfullscreen ></iframe><div class="block-iframe"></div>';


	} else { // empty template
		$wrapper_attr = '';
		$wrapper_class = 'limits';
		$content_attr = '';
		$iframe = '';
	}

?>


<div class="item iframe <?=$wrapper_class?>" <?=$wrapper_attr?> data-fiche="medias">
	<figure class="wrapper">
		<div class="hold" <?=$content_attr?>>
			<?=$iframe?>
			<div class="overlay"></div>
		</div>
	</figure>

	<div class="controls">
		<div class="handle top left"></div><div class="handle top right"></div><div class="handle bottom right"></div><div class="handle bottom left"></div>
	</div>
</div>



