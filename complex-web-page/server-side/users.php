<?php
/*
  Author: Manuel Cerda
  Git:    espaciomore

  Implementation of basic CRUD operations
  
*/
$users = json_decode(file_get_contents(__dir__.'/usersdb.json'),true);

$get_list = function() use ($users) {
  return json_encode($users);
};

$post_one = function() use (&$users,$_POST) {
  $q = $_POST;
  $user = array(
    'id'=> count($users)+1,
    'name'=> isset($q['name']) ? $q['name']:'',
    'email'=> isset($q['email']) ? $q['email']:'',
    'password'=> isset($q['password']) ? $q['password']:'',
    'status'=> 'active',
  );
  $users []= $user;
  return json_encode($user);
};

$get_one = function($id) use ($users) {
  foreach ($users as $i => $user) {
    if ((int)$user['id']==(int)$id) {
      return json_encode($user);
    }
  }
};

$put_one = function($id) use (&$users,$_POST) {
  $q = $_REQUEST;
  foreach ($users as $i => $user) {
    if ((int)$user['id']==(int)$id) {
      foreach ($user as $key => $value) {
        if (isset($q[$key])) {
          $users[$i][$key] = $q[$key]; 
        }
      }
      return json_encode($users[$i]);
    }
  }
};

$delete_one = function($id) use (&$users) {
  foreach ($users as $i => $user) {
    if ((int)$user['id']==(int)$id) {
      $users[$i]['status'] = 'deleted';
      return json_encode(array());
    }
  }
};

$find_all = function($q) use ($users) {
  $list = array();
  foreach ($users as $i => $user) {
    $filterable = false;
    foreach ($q as $key => $value) {
      if ($user[$key]==$value) {
        $filterable = true;
      }
    }
    if ($filterable) {
      $list []= $user;
    }
  }
  return json_encode($list);
};

$routes = array(
  '/users$/' => array('GET'=>$get_list,'POST'=>$post_one),
  '/users\/(\d+)$/' => array('GET'=>$get_one,'POST'=>$put_one,'DELETE'=>$delete_one),
  '/users(\/)$/' => array('GET'=>$find_all)
);

$method = $_SERVER['REQUEST_METHOD'];
$url = str_replace('.php', '', $_SERVER['PHP_SELF']);

foreach ( $routes as $route => $func ) {
  if ((bool)preg_match($route, $url, $params)) {
    $var = $params[count($params)-1];
    $var = $var!='/' && $var!='users' ? $var : $_REQUEST;
    echo $func[$method]($var);
  }
}

file_put_contents(__dir__.'/usersdb.json',json_encode($users));