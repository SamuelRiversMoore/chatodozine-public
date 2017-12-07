<!DOCTYPE html>
<html lang="<?= site()->language() ? site()->language()->code() : 'fr' ?>">
<head>

	<meta charset="utf-8">
	<meta http-equiv="Content-Language" content="<?= site()->language() ? site()->language()->code() : 'fr' ?>">
	
	<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />


	<link rel="shortcut icon" href="assets/images/favicons/favicon.ico" type="image/x-icon">
	<link rel="icon" href="assets/images/favicons/favicon.png" type="image/png">
	<link rel="icon" sizes="32x32" href="assets/images/favicons/favicon-32.png" type="image/png">
	<link rel="icon" sizes="64x64" href="assets/images/favicons/favicon-64.png" type="image/png">
	<link rel="icon" sizes="96x96" href="assets/images/favicons/favicon-96.png" type="image/png">

    <title><?= $site->title()->html() ?></title>
    <meta name="description" content="<?= $site->description()->html() ?>">

    <?php if($site->preview()->isNotEmpty() && $site->preview()->toFile()->exists()){
    	$preview = thumb($site->preview()->toFile(), array(
    		'width' => 1200,
    		'height' => 630,
    		'crop' => true, 
    	))->url();
    } else {
    	$preview = 'assets/images/preview.jpeg';
    } ?>
    <meta property="og:site_name" content="samuelriversmoore.net">
    <meta property="og:title" content="<?= $site->title() ?>" />
    <meta property="og:description" content="<?= $site->description() ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="<?= $site->url() ?>" />
    <meta property="og:image" content="<?= $preview ?>" />
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta charset="utf-8" />

	<meta name="google-site-verification" content="EhDcONRUPs4dw759wvYcDT2AO0gw0Ih55IJf4Rij-ak" />

	<?php /* = css('https://fonts.googleapis.com/icon?family=Material+Icons') */ ?>
	<?= css('assets/libs/material-icons/material-icons.css') ?>
	<?= css('assets/libs/colorpicker/css/bootstrap-colorpicker.min.css') ?>

	<?= css('assets/libs/nouislider/nouislider.css') ?>
	<?= css('assets/libs/rangeslider/rangeslider.css') ?>
	<?= css('assets/libs/bootstrap/bootstrap.css') ?>
	<?= css('assets/css/public.css') ?>

	<?php if($user = $site->user()): ?>
		<?php /* = css('https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css') */ ?>
		<?= css('assets/libs/simplemde/simplemde.min.css') ?>

		<?= css('assets/libs/fileupload/jquery.fileupload.css') ?>
		<?= css('assets/css/private.css') ?>
	<?php endif ?>

</head>

<body <?= r($site->user(), 'logged') ?>>

