<?php


if(kirby()->request()->ajax()) {


	function generate_id(){
		return hash("crc32b", uniqid()); 
	}


	function generate_unique_id($fieldData){
		$uniqid = generate_id();
		if ($fieldData) {
			foreach ($fieldData as $key => $item) {		
				if(array_key_exists('uniqid', $item) && $item['uniqid'] == $uniqid){
					generate_unique_id($fieldData);
				}
			}
		}
		return $uniqid;
	}


	function createItem($page, $field, $data = array()) {
		if ($page->content()->has($field) == false) {
			createField($page, $field);
		}
		$fieldData = $page->$field()->yaml();
		$data['uniqid'] = generate_unique_id($fieldData);
		$fieldData[] = $data;
		
		$fieldData = yaml::encode($fieldData);
		$page->update(array( $field => $fieldData ));
		if ($field == 'items') { sync_elements_with_table($page); }
		return json_encode(array('uniqid'=>$data['uniqid']));
	}
	function updateItem($page, $field, $data = array()) {
		$fieldData = $page->$field()->yaml();
		foreach ($fieldData as $key => $item) {			
			if($item['uniqid'] == $data['uniqid']){
				$fieldData[$key] = $data;
			}
		}
		$fieldData = yaml::encode($fieldData);
		$page->update(array(
			$field => $fieldData
		));
		if ($field == 'items') { sync_elements_with_table($page); }
		return json_encode('success');
	}
	function removeItem($page, $field, $target, $id) {
		$fieldData = $page->$field()->yaml();
		foreach ($fieldData as $key => $item) {
			if($item[$target] == $id){
				unset($fieldData[$key]);
			}
		}
		$fieldData = yaml::encode($fieldData);
		$page->update(array(
			$field => $fieldData
		));
		if ($field == 'items') { sync_elements_with_table($page); }
		return json_encode('success');
	}

	function createField($page, $field) {
		try {
		  $page->update(array($field => ''));
		} catch(Exception $e) {
		  echo $e->getMessage();
		}	
	}



	function createMediaVideo($datas) {
		$template = 'video';
		$data = array(
			'date' 		=> date('d-m-Y'),
			'title' 	=> $datas['title'],
			'type' 		=> $datas['type'],
			'video_id' 	=> $datas['video_id'],
			'video_url' => $datas['video_url'],
			'thumb_hd' 	=> $datas['thumb_hd'],
			'thumb_sd' 	=> $datas['thumb_sd'],
			'ratio' 	=> $datas['ratio'],
			'text'		=> $datas['text'],
		);
		$callback = function($page){
			$html = snippet('medias', array('media'=>$page), true);
			return json_encode($html);
		};
		return create_page($template, $data, $callback);
	}
	function deleteMedia($uid) {
		// check each tables pour trouve element et updater
		foreach (page('tables')->children() as $page) {
			removeItem($page, 'items', $target = 'element', $uid);
		}
		$media = page('elements/'.$uid);
		if ($media) { $media->delete(); }
		update_children_index(page('elements'));
		return json_encode('success');
	}
	function getMedias() {
		$html = '';
		foreach (page('elements')->children()->visible() as $media):
			$html .= snippet('medias', array('media'=>$media), true);
		endforeach;
		return json_encode($html);
	}

	function getTableItems($page) {
		$items = $page->items()->toStructure(); 
		$notes = $page->notes()->toStructure(); 

		$html = '';
		foreach ($items as $item){ 
			$element = page('elements/'.$item->element());
			$html .= snippet($element->intendedTemplate(), array('page'=>$page, 'element'=>$element, 'item'=>$item), true);
		}
		foreach ($notes as $note){ 
			if($note->type() == 'text'){
				$html .= snippet('element-note-text', array('note'=>$note), true);
			}
			if($note->type() == 'arrow'){
				$html .= snippet('element-note-arrow', array('note'=>$note), true);
			}
		}
		return json_encode($html);
	}







	header('Content-type: application/json');
	if ($user = $site->user()) {
		switch (get('request')) {
			case 'get_items_templates':			
				$templates = ['element-image', 'element-video', 'element-audio', 'element-note-text', 'element-note-arrow'];
				$json_array = array();
				foreach ($templates as $template) {
					$json_array[$template] = snippet($template, false, true);
				};
				echo json_encode($json_array);
				break;

			case 'create_item':
				$datas = get('datas');
				$page = page($datas['page']);
				$data = $datas['data'];
				$field = $datas['field'];
				if (array_key_exists('element', $datas) && $site->find('elements/'.$datas['element']) ) {
					$data['element'] = page('elements/'.$datas['element'])->uid();
				}
				echo createItem($page, $field, $data);
				break;

			case 'update_item':
				$datas = get('datas');
				$page = page($datas['page']);
				$data = $datas['data'];
				$field = $datas['field'];
				if (array_key_exists('element', $datas) && $site->find('elements/'.$datas['element']) ) {
					$data['element'] = page('elements/'.$datas['element'])->uid();
				}
				echo updateItem($page, $field, $data);
				break;

			case 'remove_item':
				$datas = get('datas');
				$page = page($datas['page']);
				$field = $datas['field'];
				$uniqid = $datas['uniqid'];
				echo removeItem($page, $field, $target = 'uniqid', $uniqid);
				break;

			case 'create_video':
				$datas = get('datas');
				echo createMediaVideo($datas);
				break;

			case 'delete_media':
				$datas = get('datas');
				echo deleteMedia($datas['uid']);
				break;

			case 'get_medias_list':
				echo getMedias();
				break;

			case 'get_table_items':
				$datas = get('datas');
				$page = page($datas['page']);
				echo getTableItems($page);
				break;

			default:
				echo 'command "'.get('request').'" not found';
				break;
		
		}


	} else {
		header::status('404');
	}
		
	
	
} else {
	header::status('404');
}