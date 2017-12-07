<?php
/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

function generate_id(){
	return hash("crc32b", uniqid()); 
}


if ($user = $site->user()) {

	error_reporting(E_ALL | E_STRICT);
	require('UploadHandler.php');

	$action   = $_REQUEST["action"];
	$template = $_REQUEST["template"];
	$element  = $_REQUEST["element"];
	$filename = $_REQUEST["filename"];
	$title 	  = $_REQUEST["filename"];
	$text 	  = $_REQUEST["text"];

	if ($action == 'create') {
		$data = array(
			'title' => $title,
			'date' 	=> date('d-m-Y'),
			'src' 	=> f::safeName($filename),
			'text'	=> $text,
		);
		$callback = function($page){
			return $page;
		};

		$page = create_page($template, $data, $callback);
		$dir = $page->root() . '/';
	}

	// if update file
	if ($action == 'update'){

		// to do : get update datas

		// check if page exist and remove files
		$target = 'elements/'.$element;
		if ($site->find($target)) {
			$page = page($target);
			$dir = $page->root() . '/';
			// remove all files
			foreach ( $page->files() as $file) {
				try { $file->delete(); }
				catch(Exception $e) { echo 'The file could not be deleted : '.$e->getMessage(); }
			}
		} else {
			// to do : return error and display message
			die('dir not found');
		}
		
	}

	// fileupload
	$options = array(
		'upload_dir' => $dir, 
		'upload_url' => $dir, 
		'image_versions' => array(), 
		'getTemplate' => true, 
		'page' => $page,
	);
	$upload_handler = new UploadHandler($options);

		
}