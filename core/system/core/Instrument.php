<?php

/**
 * Created by Ilkin.
 * User: Ilkin
 */
class Instrument
{
    private $db = null;
    function __construct($db_handle)
    {
        $this->db = $db_handle;
    }

    public function getInstruments()
    {
        $result = new stdClass();
        $sth = $this->db->prepare('SELECT * FROM instruments WHERE status = 1;');
        try
        {
            $sth->execute();
            $dbresult= $sth->fetchAll();
            $result->status = 200;
            $result->rows = $dbresult;
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
    //public function addInstrument($instrument_name,$instrument_price){}
    //public static function updateInstrument($instrument_id,$name,$price){}
    public function addInstrument($instrument_name,$instrument_price)
    {
        $result = new stdClass();
        $sth = $this->db->prepare('INSERT INTO instruments(name,price,interest,status) values(:instrument_name,:instrument_price,0,1);');
        try
        {
            $sth->execute(array(
                ":instrument_name" => $instrument_name,
                ":instrument_price" => $instrument_price
            ));
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
    public function updateInstrument($instrument_id,$instrument_name,$instrument_price){
        $result = new stdClass();
        $sth = $this->db->prepare('UPDATE instruments SET name = :instrument_name,price= :instrument_price WHERE id = :instrument_id;');
        try
        {
            $sth->execute(array(
                ":instrument_name" => $instrument_name,
                ":instrument_id" => $instrument_id,
                ":instrument_price" => $instrument_price
            ));
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
    public function setStatus($instrument_id,$instrument_status){
        $result = new stdClass();
        $sth = $this->db->prepare('UPDATE instruments SET status = :instrument_status WHERE id = :instrument_id;');
        try
        {
            $sth->execute(array(
                ":instrument_status" => $instrument_status,
                ":instrument_id" => $instrument_id
            ));
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
    public static function setInterest($instrument_id,$interest,$addorder,$db){
        $result = new stdClass();
        $sthselect = $db->prepare('SELECT * FROM instruments WHERE id = :instrument_id;');
        $sthupdate = $db->prepare('UPDATE instruments SET interest = :interest WHERE id = :instrument_id;');
        try
        {
            $sthselect->execute(array(":instrument_id"=>$instrument_id));
            if($instrument = $sthselect->fetch())
            {
                if($interest !=2)
                {
                    if ($instrument['interest'] == 0 && $addorder == true)
                    {
                        $succes = $sthupdate->execute(
                            array
                            (
                                ":interest"=>$interest,
                                ":instrument_id"=>$instrument_id
                            )
                        );
                    }
                    else
                    {
                        $succes = false;
                    }
                }
                else
                {
                    $sthselect->execute(array(":instrument_id"=>$instrument_id));
                    if($instrument = $sthselect->fetch())
                    {
                        $succes = $sthupdate->execute
                        (
                            array
                            (
                                ":interest"=>(int)$instrument['interest'] + 1,
                                ":instrument_id"=>$instrument_id
                            )
                        );
                    }
                    else
                    {
                        $succes = false;
                    }
                }
            }
            $result->status = 200;
            $result->success = $succes;
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