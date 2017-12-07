

<?php 
	$login = page('login');
	$error = false;
	$success = false;
	$alert = '';

	// handle the form submission
	if(r::is('post') and get('login')) {

		$target = get('target');
		if ($target == $page->uid()) $target = '';
		
		// fetch the user by username and run the
		// login method with the password
		if($user = $site->user(get('username')) and $user->login(get('password'))) {
			// if the login was successful
			$success = true;
			if (!kirby()->request()->ajax()) {
				//header('Location: '.page($target)->url());
				go($target);
			}
		} else {
			// make sure the alert is being
			// displayed in the template
			$error = true;
			$alert = $site->loginalert();
		}

	} else {
		// nothing has been submitted
		// nothing has gone wrong
		$error = false;
		$success = false;
	}

?>
<?php if (kirby()->request()->ajax()): ?>
	<?php if ($error): ?>
		<?php echo $site->loginalert(); ?>
	<?php else: ?>
		<?php if ($success): ?>			
			<?php echo json_encode('success'); ?>	
		<?php endif ?>
	<?php endif ?>
<?php else: ?>

	<?php if ($page->uid() == 'login'): ?>
		<form method="post" id="login" action="<?= page('login')->url() ?>">
			<input type="hidden" value="<?= kirby()->request()->path()->last() ?>" name="target" />

			<div>
				<label for="username"><?php echo $login->identifiant()->html() ?></label>
				<input type="text" id="username" name="username" class="field">
			</div>
			<div>
				<label for="password"><?php echo $login->password()->html() ?></label>
				<input type="password" id="password" name="password" class="field">
			</div>
			<div>
				<input type="submit" name="login" class="submit" value="<?php echo $login->button()->html() ?>">
			</div>
		</form>
		<?php if($error): ?>
			<div class="alert icon fa-exclamation-triangle"><?php echo $alert ?></div>
		<?php endif ?>
	<?php endif ?>

<?php endif ?>