<?php

/**
 * Created by Ilkin.
 * Date: 21.03.2017
 * Time: 1:11
 */
class Session
{
    private $db = null;
    function __construct($db_handle) {
        $this->db = $db_handle;
    }

    public function add($date_start,$date_end,$instrument_ids){
        $result = new stdClass();
        $sth = $this->db->prepare('INSERT INTO sessions(status,start,end,instrument_ids) VALUES(1,:start,:end,:instrument_ids);');
        try
        {
            $instrument_ids = serialize($instrument_ids);
            $sth->execute(
                array(
                    ":start"=>$date_start,
                    ":end"=>$date_end,
                    ":instrument_ids"=>$instrument_ids
                )
            );
            $result->id = $this->db->lastInsertId();
            $result->status = 200;
            return $result;
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: "." ".$e;
            return $result;
        }
    }

    public function end($session_id){
        $result = new stdClass();
        $sth = $this->db->prepare('UPDATE sessions SET status = 0,end = :date_end where id = :id');
        try
        {
            if(!$session_id){
                throw new PDOException("Session id is not defined");
            }
            $db_result = $sth->execute(array(":id"=>$session_id,":date_end"=>date("Y-m-d H:i:s")));
            if($db_result)
            {
                $result->status = 200;
                return $result;
            }
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: "." ".$e;
            return $result;
        }
    }
    /*public function updateInstruments($session_id,$instrument_ids)
    {
        $result = new stdClass();
        $sthForSelect = $this->db->prepare('SELECT * FROM sessions WHERE id = :session_id;');
        $sthForUpdate = $this->db->prepare('UPDATE sessions SET instrument_ids = :instrument_ids WHERE id = :session_id');
        try
        {
            $sthForSelect->execute(array(":session_id"=>$session_id));
            $session = $sthForSelect->fetch();
            if($session)
            {
                if($session['instrument_ids'])
                {
                    $instruments = unserialize($session['instrument_ids']);
                    foreach ($instrument_ids as $instrument)
                    {
                        if(!in_array($instrument,$instruments))
                        {
                            array_push($instruments,$instrument);
                        }
                    }
                    $instrument_ids = serialize($instruments);
                }
                else
                {
                    $instrument_ids = serialize($instrument_ids);
                }

                $sthForUpdate->execute(array(":instrument_ids" => $instrument_ids,":session_id" => $session_id));
            }
            $result->status = 200;
            return $result;
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: "." ".$e;
            return $result;
        }
    }*/

    public function checkSession(){
        $result = new stdClass();
        $now = date("Y-m-d H:i:s");

        $sthselect1 = $this->db->prepare('SELECT * FROM sessions WHERE status = 2;');
        $sthselect2 = $this->db->prepare('SELECT * FROM sessions WHERE status = 1;');
        $sthupdate = $this->db->prepare('UPDATE sessions SET status = 2 WHERE status = 1;');
        $sthupdate2 = $this->db->prepare('UPDATE sessions SET status = 0 WHERE status = 2;');
        try
        {
            $sthselect1->execute();
            if($session= $sthselect1->fetch())
            {
                if (strtotime($now) > strtotime($session['end']))
                {
                    try
                    {
                        $sthupdate2->execute();
                        $result->session_id = 0;
                    }
                    catch (PDOException $e)
                    {
                        throw new PDOException("Database error: ".$e->getMessage());
                    }
                }
                else
                {
                    $result->session_id = $session['id'];
                    $result->date_end = $session['end'];
                }
            }
            else
            {
                $session = $sthselect2->execute();
                if($session= $sthselect2->fetch()){
                    if (strtotime($now) >= strtotime($session['start']))
                    {
                        try
                        {
                            $sthupdate->execute();
                            $result->session_id = $session['id'];
                        }
                        catch (PDOException $e)
                        {
                            throw new PDOException("Database error: ".$e->getMessage());
                        }
                    }
                    else
                    {
                        $result->session_id = 0;
                    }
                }
                else
                {
                    $result->session_id = 0;
                }
            }
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
    //public function updateSession($date_end){}
    public function getInstruments($session_id){
        $result = new stdClass();
        $sth = $this->db->prepare('SELECT * FROM sessions WHERE id = :session_id;');
        try
        {
            $sth->execute(array(":session_id" => $session_id));
            if($session = $sth->fetch())
            {
                if($session['instrument_ids'])
                {
                    $instruments = unserialize($session['instrument_ids']);
                    $in  = str_repeat('?,', count($instruments) - 1) . '?';
                    $sth2 = $this->db->prepare("SELECT * FROM instruments WHERE id IN($in);");
                    $sth2->execute($instruments);

                    if($instruments = $sth2->fetchAll())
                    {
                        $result->instruments = $instruments;
                    }
                    else
                    {
                        $result->instruments = null;
                    }
                }
                else
                {
                    $result->instruments = null;
                }
            }
            else
            {
                $result->instruments = null;
            }
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
}