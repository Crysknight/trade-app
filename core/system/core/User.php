<?php

/**
 * Created by Ilkin
 * Date: 21.03.2017
 * Time: 1:11
 */
class User {

    public $info;

	function __construct($db_handle) {
		$this->db = $db_handle;
		require_once dirname(__FILE__) . '/Input.php';
        include(dirname(__FILE__) . '/../config.php');
		$this->input = new Input();
	}
	
	//логинимся в систему
	function login($login, $password) {
        $user = $this->checkPassword($login, $password);
		if($user != false) {
            $user_info = $this->getUserInfo($user);
            if($user_info != false) {
                $token = $this->setUserToken($user_info);
                $array = array(
                    "role_name" => $user_info['role_name'],
                    "token" => $token,
                    "id"=>$user_info["id"]
                );
                return $array;
            }
        }
        else {
            return false;
        }
	}
    function addUser($user_name,$user_pass,$role_id,$fio,$organization,$phone,$comment)
    {
        $result = new stdClass();
        $sth = $this->db->prepare('INSERT INTO users(user_name,user_pass,role_id,fio,organization,phone,comment) values(:user_name,MD5(:user_pass),:role_id,:fio,:organization,:phone,:comment);');
        try
        {
            $sth->execute(
                array
                (
                    ":user_name" => $user_name,
                    ":user_pass" => $user_pass,
                    ":role_id" => $role_id,
                    ":fio" => $fio,
                    ":organization" => $organization,
                    ":phone" => $phone,
                    ":comment" => $comment
                )
            );
            $result->id = $this->db->lastInsertId();
            $result->status = 200;
            return $result;
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: ".$e->getMessage();
            //если не смогли чего то сделать с бд показываем ошибку
            return $result;
        }
    }
    function getUsers(){
        $result = new stdClass();
        $sth = $this->db->prepare('SELECT * FROM users;');
        try
        {
            $sth->execute();
            $result->users = $sth->fetchAll();
            $result->status = 200;
            return $result;
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: ".$e->getMessage();
            //если не смогли чего то сделать с бд показываем ошибку
            return $result;
        }
    }
    function updateUser($user_id,$user_name,$user_pass,$role_id,$fio,$organization,$phone,$comment)
    {
        $result = new stdClass();
        $sth = $this->db->prepare('UPDATE users SET user_name = :user_name,user_pass = MD5(:user_pass),role_id = :role_id,fio=:fio,organization = :organization,phone = :phone,comment = :comment WHERE id = :user_id;');
        try
        {
            $sth->execute(
                array
                (
                    ":user_id" => $user_id,
                    ":user_name" => $user_name,
                    ":user_pass" => $user_pass,
                    ":role_id" => $role_id,
                    ":fio" => $fio,
                    ":organization" => $organization,
                    ":phone" => $phone,
                    ":comment" => $comment
                )
            );
            $result->status = 200;
            return $result;
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: ".$e->getMessage();
            //если не смогли чего то сделать с бд показываем ошибку
            return $result;
        }
    }
    function deleteUser($user_id)
    {
        $result = new stdClass();
        $sth = $this->db->prepare('DELETE from users WHERE id = :user_id ;');
        try
        {
            $sth->execute(
                array
                (
                    ":user_id" => $user_id
                )
            );
            $result->status = 200;
            return $result;
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: ".$e->getMessage();
            //если не смогли чего то сделать с бд показываем ошибку
            return $result;
        }
    }
    function checkPassword($login, $password) {
        //логин может состоять только из цифр и бкув
        //проверяем на валидность логин
        //$login = $this->input->checkString($login, 'char');
        if($login) {
            $password_hash = md5($password);
            $sth = $this->db->prepare('SELECT id, user_name, user_pass, role_id FROM users WHERE user_name = :login');
            $sth->execute(array(':login' => $login));
            $user = $sth->fetch();
            if (($login == $user['user_name']) && ($password_hash == $user['user_pass'])) {
                return $user;
            } else {
                return false;
                //error gen
            }
        }
        return false;
    }
	function getBytoken($token){
        $sth = $this->db->prepare('SELECT * FROM users WHERE token=:token;');
        try{
            $sth->execute(
                array
                (
                    ':token' => $token
                )
            );
            $user = $sth->fetch();
            if(!$user){
                return false;
            }
            return $user;
        }
        catch (PDOException $e) {
            //если не смогли чего то сделать с бд показываем ошибку
            return new Response($e->getMessage(),500);
        }
    }
	function checkSessionTimeout(){
		if (isset($_SESSION['user']['last_activity']) && (time() - $_SESSION['user']['last_activity'] > 21600)) {
		    unset($_SESSION['user']);
		    session_destroy();
		    header('Location: index.php');
		}
	}
	
	function getUserInfo($user) {
        $user_info['id'] = $user['id'];
        $user_info['name'] = $user['user_name'];
        $user_info['role_id'] = $user['role_id'];
        if ($user_info['role_id'] == 1){
            $user_info['role_name'] = "isadmin";
        }
        else{
            $user_info['role_name'] = "isuser";
        }
        return $user_info;
	}


    //set user info to session
    function setUserToken($user_info) {
	    $token = md5(time());
        $sth = $this->db->prepare('UPDATE users SET token=:token WHERE id=:id;');
        try{
            $sth->execute(
                array
                (
                    ':token' => $token,
                    ':id' => $user_info['id']
                )
            );
            return $token;
        }
        catch (PDOException $e) {
            //если не смогли чего то сделать с бд показываем ошибку
            echo 'Database error: ' . $e->getMessage();
        }
    }
	private function getClientIp() {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        else if(getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        else if(getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        else if(getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        else if(getenv('HTTP_FORWARDED'))
           $ipaddress = getenv('HTTP_FORWARDED');
        else if(getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }
    //function addUser,UpdateUser,deleteUser

}