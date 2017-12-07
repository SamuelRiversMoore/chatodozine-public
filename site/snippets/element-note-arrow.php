

<?php
	if (isset($arrow)) { // fill the template
		$wrapper_attr =     
			'style="left:'.$arrow->wrapLeft().'px; '.
					'top:'.$arrow->wrapTop().'px; '.
					'width:'.$arrow->wrapWidth().'px; '.
					'transform:'.$arrow->transform().'; '.
					'z-index:'.$arrow->zindex().'; "'.
			'data-uniqid="'.$arrow->uniqid().'"';

	} else { // empty template
		$wrapper_attr = '';
	}
?>

<div class="item note arrow" data-fiche="arrow" data-type="arrow" <?= $wrapper_attr ?>>
	<div class="tail"></div>
	<div class="line"></div>
	<div class="head"></div>
</div>