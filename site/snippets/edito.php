
<?php 
	if (cookie::exists('edito-seen')) {
		$visibility = 'hidden';
	} else {
		$visibility = '';
	}
	cookie::set('edito-seen', true, $expires = 60 * 24);
?>


<section id="edito" class="<?php echo $visibility ?>">
	<div class="wrapper">
		<div class="clickable-bg"></div>
		<div class="content" style="<?php 
				e(page('infos')->bgcolor()->isNotEmpty(), 'background-color:'.page('infos')->bgcolor().';');
				e(page('infos')->txtcolor()->isNotEmpty(), 'color:'.page('infos')->txtcolor().';')
			?>">
			<div class="block">
				<h1><?php e(page('infos')->editotitle()->isNotEmpty(), page('infos')->editotitle(), $site->title()) ?></h1>
				<div class="sticky-container">
					<ul id="sticky-sidebar">
						<?php if (page('infos')->presentation()->isNotEmpty()): ?>
							<li><a href="#presentation" class="scroll">Présentation</a></li>
						<?php endif ?>
						<?php if (page('infos')->credits()->isNotEmpty()): ?>
							<li><a href="#credits" class="scroll">L'équipe</a></li>
						<?php endif ?>
						<?php if (page('infos')->remerciements()->isNotEmpty()): ?>
							<li><a href="#remerciements" class="scroll">Remerciements</a></li>
						<?php endif ?>
						<?php if (page('infos')->partenaires()->isNotEmpty()): ?>
							<li><a href="#partenaires" class="scroll">Partenaires</a></li>
						<?php endif ?>
						<?php if (page('infos')->contact()->isNotEmpty()): ?>
							<li><a href="#contact" class="scroll">Contact</a></li>
						<?php endif ?>		
					</ul>			
					<section id="sticky-content">
						<?php if (page('infos')->presentation()->isNotEmpty()): ?>
							<div id="presentation" class="texte section">
								<h2>Présentation</h2>
								<?= page('infos')->presentation()->kirbytext() ?>
							</div>
						<?php endif ?>
						<?php if (page('infos')->credits()->isNotEmpty()): ?>
							<div id="credits" class="texte section">
								<h2>L'équipe</h2>
								<?= page('infos')->credits()->kirbytext() ?>
							</div>
						<?php endif ?>
						<?php if (page('infos')->remerciements()->isNotEmpty()): ?>
							<div id="remerciements" class="texte section">
								<h2>Remerciements</h2>
								<?= page('infos')->remerciements()->kirbytext() ?>
							</div>
						<?php endif ?>
						<?php if (page('infos')->partenaires()->isNotEmpty()): ?>
							<div id="partenaires" class="texte section">
								<h2>Partenaires</h2>
								<?= page('infos')->partenaires()->kirbytext() ?>
							</div>
						<?php endif ?>
						<?php if (page('infos')->contact()->isNotEmpty()): ?>
							<div id="contact" class="texte section">
								<h2>Contact</h2>
								<?= page('infos')->contact()->kirbytext() ?>
							</div>
						<?php endif ?>
					</section>
				</div>
			</div>
			<div class="cross"></div>
		</div>
	</div>
</section>
