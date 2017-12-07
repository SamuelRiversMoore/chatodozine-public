
<?php 
	$login = page('login');
	$error = false;
?>


<div id="login" class="modal" tabindex="-4" role="dialog">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<form method="post" id="login-form" action="<?= page('login')->url() ?>">

				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="material-icons">&#xE14C;</i></button>
					<h4 class="modal-title">Connexion</h4>
				</div>
				<div class="modal-body">
						<input type="hidden" value="<?= $page->uid() ?>" name="target" />

						<div>
							<label for="username"><?php echo $login->identifiant()->html() ?></label>
							<input type="text" id="username" name="username" class="field">
						</div>
						<div>
							<label for="password"><?php echo $login->password()->html() ?></label>
							<input type="password" id="password" name="password" class="field">
						</div>
						<div class="alert hidden icon fa-exclamation-triangle"></div>
				</div>
				<div class="modal-footer">
					<input type="submit" name="login" class="submit btn btn-primary" value="<?php echo $login->button()->html() ?>">
				</div>

			</form>
		</div>
	</div>
</div>
