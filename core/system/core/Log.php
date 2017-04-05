<?php
/**
 * Created by PhpStorm.
 * User: filkeith
 * Date: 14/05/15
 * Time: 14:30
 */
class Log {

    function __construct($db_handle) {
        $this->db = $db_handle;
    }

    private function create($client_id,$user_id,$event) {
        $sth = $this->db->prepare('
			INSERT INTO client_log (
              client_id,
              user_id,
              event)
            VALUES (
              :client_id,
              :user_id,
              :event);
        ');
        $exec_array = array (
            ':client_id' => $client_id,
            ':user_id' => $user_id,
            ':event' => $event
        );
        $sth->execute($exec_array);
    }
}