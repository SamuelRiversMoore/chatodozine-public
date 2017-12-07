<nav id="membres-ui">
	<?php if($user = $site->user()): ?>
		<?php if ($page->intendedTemplate() == 'table'): ?>
			<span>
				<input id="edit-mode-toggle" type="checkbox" class="hiddeninput" checked/>
				<label for="edit-mode-toggle" class="lock-open" data-toggle="tooltip" data-placement="bottom" title="<?= e($site->editmode(), $site->editmodeenabled(), 'Edit mode enabled') ?>">
				  	<i class="material-icons">&#xE898;</i>
				</label>
				<label for="edit-mode-toggle" class="lock-close" data-toggle="tooltip" data-placement="bottom" title="<?= e($site->editmode(), $site->editmodedisabled(), 'Edit mode disabled') ?>">
				  	<i class="material-icons">&#xE899;</i>
				</label>
			</span>			
			<button id="medias-open" class="big" title="<?= e($site->mediasbutton(), $site->mediasbutton(), 'Medias') ?>">
				<i class="material-icons">&#xE896;</i><span class="button-text"><?= e($site->mediasbutton(), $site->mediasbutton(), 'Medias') ?></span>
			</button>
			
			<button id="outil-text-button" class="big" title="<?= e($site->textButton(), $site->textButton(), 'Outil texte') ?>">
				<i class="material-icons">&#xE262;</i>
			</button>

			<button id="outil-arrow-button" class="big" title="<?= e($site->arrowbutton(), $site->arrowbutton(), 'Outil flêche') ?>">
				<i class="material-icons">&#xE043;</i>
			</button>

			<?php /* ?>
			<button id="outil-drawing-button" class="big" title="<?= e($site->arrowbutton(), $site->arrowbutton(), 'Outil flêche') ?>">
				<i class="material-icons">&#xE254;</i>
			</button>
			<?php */ ?>

		<?php endif ?>

		<a href="<?= url('logout').'?target='.$page->uid() ?>" class="button">
			<button id="logout-button" class="big" data-toggle="tooltip" title="<?= e($site->logoutbutton(), $site->logoutbutton(), 'Logout') ?>">
				<i class="material-icons">&#xE879;</i>
			</button>
		</a>

	<?php else: ?>
		<span data-toggle="tooltip" title="<?= e($site->loginbutton(), $site->loginbutton(), 'Login') ?>">
			<button id="login-button" class="big" class="button" data-toggle="modal" data-target="#login">
				<a  href="<?= url('login') ?>">Login</a>
			</button>
		</span>
	<?php endif ?>
</nav>


<?php if($user = $site->user()): ?>
	<?php if ($page->intendedTemplate() == 'table'): ?>

		<?php snippet('panel-medias', array('page'=>$page)); ?>
		
		<?php snippet('fiche-medias', array('page'=>$page)); ?>
		<?php snippet('fiche-text', array('page'=>$page)); ?>
		<?php snippet('fiche-arrow', array('page'=>$page)); ?>

		<?php /* <button id="table-update" class="update-button"><i class="material-icons">&#xE863;</i></button> */ ?>

	<?php endif ?>
<?php endif ?>

<?php if ($page->intendedTemplate() == 'table'): ?>
	<nav id="zoom-ui">
		<input id="zoom-slider" type="range" data-orientation="vertical">
	</nav>
<?php endif ?>



