<?php
$counterFile = 'counter.json';

if (file_exists($counterFile)) {
    $data = json_decode(file_get_contents($counterFile), true);
    $data['count']++;
} else {
    $data = array('count' => 1);
}

file_put_contents($counterFile, json_encode($data));
echo $data['count'];
