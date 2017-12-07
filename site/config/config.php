<?php

/*

---------------------------------------
License Setup
---------------------------------------

Please add your license key, which you've received
via email after purchasing Kirby on http://getkirby.com/buy

It is not permitted to run a public website without a
valid license key. Please read the End User License Agreement
for more information: http://getkirby.com/license

*/

c::set('license', 'K2-PERSONAL-2eb828b9210777a1bd81e3634d38c78f');

/*

---------------------------------------
Kirby Configuration
---------------------------------------

By default you don't have to configure anything to
make Kirby work. For more fine-grained configuration
of the system, please check out http://getkirby.com/docs/advanced/options

*/

c::set('debug',true);

c::set('panel.install',true);

kirby()->hook('panel.page.update', function($page, $oldPage) {

	// updated page = table
	if($page->parent()->intendedTemplate('Tables')){
		$table = $page->uri();
		sync_elements_with_table($table);
	}

});

function sync_elements_with_table($table){
	// pour enregistrer le fait qu'un élément est présent sur une table
	
	$targets = array();		
	try {
		// liste de cibles
		foreach( page($table)->items()->yaml() as $el){ $targets[] = $el['element']; }
		// check chaque element
		foreach( page('elements')->children() as $element ){
			$tables = $element->tables()->yaml();
			$item = $element->uid();

			// si element dans targets && table pas dans tables : ADD table
			if ( in_array($item, $targets) == true && in_array(array('table' => $table), $tables) == false ){
				// update tables list
				$tables[] = array('table'=> $table);
				$tables = yaml::encode($tables);
				$element->update(array( 'tables' => $tables ));
			
			}

			// si element pas dans targets && table dans tables : REMOVE table
			if (in_array($item, $targets) == false && in_array(array('table' => $table), $tables) == true){
				// remove from tables list
				foreach (array_keys($tables, array('table'=>$table)) as $key) { unset($tables[$key]); }
				$tables = yaml::encode($tables);
				$element->update(array( 'tables' => $tables ));

			}
		}


	} catch (Exception $e) {

		echo $e->getMessage();
	}
}
function update_children_index($target, $offset = 0){
	$index = 1 + $offset;
	foreach ($target->children() as $page) {
		$page->sort($index);
		$index += 1;
	}
}

function create_page($template, $data, $callback){
		$element = $template.'_'.generate_id();
		$target = 'elements/'.$element;
		try {
			update_children_index(page('elements'), $offset = 1);
			$page = page('elements')->create($target, 'element-'.$template, $data);
			$page->sort( 1 ); // prepend
			return $callback($page);
		} catch(Exception $e) {
			return $e->getMessage();
		}
}


/*----------  ROLES  ----------*/


c::set('roles', array(
  array(
    'id'      => 'admin',
    'name'    => 'Admin',
    'default' => true,
    'panel'   => true
  ),
  array(
    'id'      => 'editor',
    'name'    => 'Editor',
    'panel'   => true
  ),
  array(
    'id'      => 'client',
    'name'    => 'Client',
    'panel'   => false
  )
));



/*----------  ROUTES  ----------*/


c::set('routes', array(
	array(
		'pattern' => 'logout',
		'action'  => function() {
			if($user = site()->user()) $user->logout();
			$target = (get('target') ? get('target') : '/');
			go(get('target'));
		}
	),
	array(
		'pattern' => 'home',
		'action'  => function() {
			go('/');
		}
	),
	array(
		'pattern' => '(:any)',
		'action'  => function($table) {
			return site()->visit('tables/'.$table);
		}
	),
	array(
		'pattern' => '(:any)/(.*)',
		'action'  => function() {
			go('/');
		}
	),
	array(
		'pattern' => '/',
		'action'  => function() {
			$table = page('tables')->children()->visible()->last()->uid();
			go($table);
		}
	),
	
));

