


<?php
	if (isset($note)) { // fill the template
		$content = $note->content();
		$content_styles = $note->styles();

		$wrapper_attr =     
			'style="left:'.$note->wrapLeft().'px; '.
					'top:'.$note->wrapTop().'px; '.
					'width:'.$note->wrapWidth().'px; '.
					'height:'.$note->wrapHeight().'px; '.
					'z-index:'.$note->zindex().'; "'.
			'data-uniqid="'.$note->uniqid().'"';

		$content_attr = 
			'style="left:'.$note->itemLeft().'%; '.
					'top:'.$note->itemTop().'%; '.
					'width:'.$note->itemWidth().'%; '.
					'height:'.$note->itemHeight().'%; "'. 
			'data-width="'.$note->itemWidth().'"'.
			'data-height="'.$note->itemHeight().'"'.
			'data-top="'.$note->itemTop().'"'.
			'data-left="'.$note->itemLeft().'"';

		if ($note->itemWidth() == '100' && $note->itemHeight() == '100') {
			$wrapper_class = 'limits';
		} else {
			$wrapper_class = '';
		}

	} else { // empty template
		$content = 'Votre texte ici';
		$content_styles = '';
		$wrapper_attr = '';
		$wrapper_class = 'limits';
		$content_attr = '';
	}

?>



<div class="item note text" data-fiche="text" data-type="text" <?= $wrapper_attr ?>>
	<article class="wrapper <?= $wrapper_class ?>">
		<div class="hold" style="<?= $content_styles ?>" <?= $content_attr ?> data-content="<?=$content?>"  data-styles="<?=$content_styles?>">
			<div class="text-container">
				<?= kirbytext($content) ?>
			</div>
		</div>
	</article>

	<div class="controls">
		<div class="handle top left"></div><div class="handle top right"></div><div class="handle bottom right"></div><div class="handle bottom left"></div>
	</div>
</div>
