<?php

sleep( 3 );

$json = file_get_contents('php://input');
$json = json_decode($json);

if ($json->eMail == 'pavel@pln-b.ru' && $json->password == 'it7-8') {
  echo 'success';
} else {
  http_response_code(401);
}

?>