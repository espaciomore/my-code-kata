<?php
/*
  Autor: Manuel Cerda
  Git:   espaciomore 
  
  1: IP address lookup
  Terminal program will be executed like this:
  ./program --database ./database.txt 10.1.2.3
  Program description
  database.txt will be a text file that contains IP address ranges in form of:
  10.1.0.0/16
  127.0.0.0/8
  192.168.8.0/24
  ...
  The task of the program is to find and print out all ranges for the IP address supplied as an
  argument.
  Expected output for the above may be:
  10.1.0.0/16
*/

$ip_to_int = function($network){
  $n_segments = explode('.', $network);
  foreach ($n_segments as $n_segment) {
    if((int)$n_segment > 255 && (int)$n_segments < 0)
      die('network out of range');
  }
  return (int)$n_segments[0] * (pow(2,24)-1) + 
         (int)$n_segments[1] * (pow(2,16)-1) + 
         (int)$n_segments[2] * (pow(2,8)-1) + 
         (int)$n_segments[3] * pow(2,0);
};

if(count($argv)!==3) 
  die('missing argument(s); filename network');
if(!file_exists($argv[1])) 
  die('file not found');
if(!preg_match('/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/', $argv[2])) 
  die('bad network format');

$networks = explode("\r\n",file_get_contents($argv[1]));
$x = $ip_to_int($argv[2]);

foreach ($networks as $i => $network) {
  $parts = split('/', $network);
  $y_network = $parts[0];
  $y_subnet = $parts[1];
  // find network range
  $y_min = $ip_to_int($y_network);
  $y_max = $y_min + pow(2,(int)$y_subnet);

  if( $x >= $y_min && $x <= $y_max)
    echo $argv[2]." => ".$network."\r\n";
}
