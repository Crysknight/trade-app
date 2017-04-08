<?php
/**
 * Created by Ilkin.
 * Date: 19.03.2017
 * Time: 15:07
 */
use Symfony\Component\HttpFoundation\Response;
require_once ("Deal.php");
require_once ("Instrument.php");
class Order
{
    private $db = null;
    function __construct($db_handle) {
        $this->db = $db_handle;
    }
    function addOrder($user_id,$type,$quantity,$instrument_id,$session_id)
    {
        $result = new stdClass();
        $sth = $this->db->prepare('INSERT INTO orders(type,user_id,quantity,instrument_id,session_id) VALUES(:order_type,:user_id,:quantity,:instrument_id,:session_id);');
        try
        {
            $succes = $sth->execute(
                array(
                    ':order_type'=>$type,
                    ':user_id'=>$user_id,
                    ':quantity'=>$quantity,
                    ':instrument_id'=>$instrument_id,
                    ':session_id'=>$session_id)
            );
            if($succes)
            {
                $result->id = $this->db->lastInsertId();
                $result->interest = Instrument::setInterest($instrument_id,1,true,$this->db);
                $result->checkorder = $this->checkOrder($instrument_id,$user_id,$type,$quantity,$result->id,$session_id);
                $result->status = 200;
            }
            return $result;
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: "." ".$e;
            return $result;
        }
    }
    function checkOrder($instrument_id,$user_id,$type,$quantity,$order_id,$session_id)
    {
        date_default_timezone_set('Europe/Moscow');
        $result = new stdClass();
        $result->deals = [];
        $result->interests = [];
        $sth = $this->db->prepare('SELECT * FROM orders WHERE instrument_id = :instrument_id AND session_id = :session_id AND user_id != :user_id AND type != :type ;');
        try{
            if(!$instrument_id || !$user_id || !$type)
            {
                throw new PDOException("One of instrument_id or user_id or type is not defined");
            }
            $sth->execute(
                array(
                    ':instrument_id'=>$instrument_id,
                    ':user_id'=>$user_id,
                    ':type'=>$type,
                    ':session_id'=>$session_id
                )
            );
            while($order = $sth->fetch())
            {
                $seller = new stdClass();
                $buyer = new stdClass();
                if($type == "sale")
                {
                    $seller->user_id = $user_id;
                    $seller->quantity = $quantity;
                    $seller->order_id = $order_id;
                    $buyer->quantity = $order['quantity'];
                    $buyer->user_id = $order['user_id'];
                    $buyer->order_id = $order['id'];
                    if($seller->quantity >= $buyer->quantity)
                    {
                        $seller->remainder = (int)$seller->quantity - (int)$buyer->quantity;
                        $this->deleteOrder($buyer->order_id);
                        $buyer->remainder = 0;
                        $buyer->bought = $seller->saled = $buyer->quantity;
                        if($seller->remainder == 0)
                        {
                            $deal_date = date("Y-m-d H:i:s");
                            $deal = Deal::add($seller,$buyer,$this->db,$instrument_id,$deal_date,$order['session_id']);
                            $result->interests[] = Instrument::setInterest($instrument_id,2,false,$this->db);
                            $result->deals[] = $deal;
                            $this->deleteOrder($seller->order_id);
                            break;
                        }
                        else
                        {
                            $deal_date = date("Y-m-d H:i:s");
                            $deal = Deal::add($seller,$buyer,$this->db,$instrument_id,$deal_date,$order['session_id']);
                            $result->interests[] = Instrument::setInterest($instrument_id,2,false,$this->db);
                            $result->deals[] = $deal;
                            $this->updateOrder($seller->order_id,$seller->remainder);
                            $quantity = $seller->remainder;
                        }

                    }
                    else
                    {
                        $deal_date = date("Y-m-d H:i:s");
                        $buyer->remainder = (int)$buyer->quantity - (int)$seller->quantity;
                        $this->deleteOrder($seller->order_id);
                        $seller->remainder = 0;
                        $buyer->bought = $seller->saled = $seller->quantity;
                        $deal = Deal::add($seller,$buyer,$this->db,$instrument_id,$deal_date,$order['session_id']);
                        $result->interests[] = Instrument::setInterest($instrument_id,2,false,$this->db);
                        $result->deals[] = $deal;
                        $this->updateOrder($buyer->order_id,$buyer->remainder);
                        break;
                    }
                }
                else if($type = "buy")
                {
                    $buyer->user_id = $user_id;
                    $buyer->quantity = $quantity;
                    $buyer->order_id = $order_id;
                    $seller->user_id = $order['user_id'];
                    $seller->quantity = $order['quantity'];
                    $seller->order_id = $order['id'];
                    if($buyer->quantity >=$seller->quantity)
                    {
                        $buyer->remainder = (int)$buyer->quantity - (int)$seller->quantity;
                        $this->deleteOrder($seller->order_id);
                        $seller->remainder = 0;
                        $buyer->bought = $seller->saled = $seller->quantity;
                        if($buyer->remainder == 0){
                            $deal_date = date("Y-m-d H:i:s");
                            $deal = Deal::add($seller,$buyer,$this->db,$instrument_id,$deal_date,$order['session_id']);
                            $result->interests[] = Instrument::setInterest($instrument_id,2,false,$this->db);
                            $result->deals[] = $deal;
                            $this->deleteOrder($buyer->order_id);
                            break;
                        }
                        else{
                            $deal_date = date("Y-m-d H:i:s");
                            $deal = Deal::add($seller,$buyer,$this->db,$instrument_id,$deal_date,$order['session_id']);
                            $result->interests[] = Instrument::setInterest($instrument_id,2,false,$this->db);
                            $result->deals[] = $deal;
                            $this->updateOrder($buyer->order_id,$buyer->remainder);
                            $quantity = $buyer->remainder;
                        }

                    }
                    else{
                        $deal_date = date("Y-m-d H:i:s");
                        $seller->remainder = (int)$seller->quantity - (int)$buyer->quantity;
                        $this->deleteOrder($buyer->order_id);
                        $buyer->remainder = 0;
                        $buyer->bought = $seller->saled = $buyer->quantity;
                        $deal = Deal::add($seller,$buyer,$this->db,$instrument_id,$deal_date,$order['session_id']);
                        $result->interests[] = Instrument::setInterest($instrument_id,2,false,$this->db);
                        $result->deals[] = $deal;
                        $this->updateOrder($seller->order_id,$seller->remainder);
                        break;
                    }
                }
            }
            $result->status = 200;
            return $result;
        }
        catch (PDOException $e){
            $result->status = 500;
            $result->message = "Database error: "." ".$e;
            return $result;
        }
    }
    function checkOrders($user_id,$session_id)
    {
        $result = new stdClass();
        $sth = $this->db->prepare('SELECT * FROM orders WHERE user_id = :user_id AND session_id = :session_id;');
        try
        {
            $sth->execute(
                array(
                    ':session_id'=>$session_id,
                    ':user_id'=>$user_id
                )
            );
            $dbresult = $sth->fetchAll();
            $result->result = $dbresult;
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
    function deleteOrder($id){
        $result = new stdClass();
        $sth = $this->db->prepare('DELETE FROM orders WHERE id=:id;');
        try
        {
            if (!$id){
                throw new PDOException("Order id is not defined");
            }
            $succes = $sth->execute(array(':id'=>$id));
            if($succes)
            {
                $result->id = $id;
                $result->status = 200;
            }
            return $result;
        }
        catch (PDOException $e)
        {
            $result->status = 500;
            $result->message = "Database error: "." ".$e;
            return $result;
        }
    }

    function deleteOrdersArray($orders){
        $result = new stdClass();
        $result->deletedOrders = [];
        foreach ($orders as $order)
        {
            $result->deletedOrders[] = $this->deleteOrder($order);
        }
        $result->status = 200;
        return $result;
    }
    function updateOrder($order_id,$remainder)
    {
        $sth = $this->db->prepare('UPDATE orders SET quantity = :remainder WHERE id=:order_id;');
        try
        {
            $sth->execute(array(':order_id'=>$order_id,':remainder'=>$remainder));
        }
        catch (PDOException $e)
        {
            echo "Database error: "." ".$e;
        }
    }
}