<?php
require_once ("Instrument.php");
class Deal
{
    private $db = null;
    function __construct($db_handle) {
        $this->db = $db_handle;
    }
    public function checkDeals($user_id,$session_id){
        $result = new stdClass();
        $sth = $this->db->prepare('SELECT * FROM deals WHERE (seller = :user_id OR buyer = :user_id) AND session_id = :session_id;');
        $executeArray = array
        (
            ":user_id"=>$user_id,
            ":session_id" => $session_id
        );
        try
        {
            $sth->execute($executeArray);
            $deals = $sth->fetchAll();

            $result->status=200;
            $result->deals = $deals;
            return $result;
        }
        catch (PDOException $e){
            $result->status = 500;
            $result->message = "Database Error: ".$e->getMessage();
            return $result;
        }
    }
    public static function add($seller,$buyer,$db,$instrument_id,$deal_date,$session_id)
    {   $result = new stdClass();
        $sth = $db->prepare('INSERT INTO deals(saled,deal_date,buyed,seller,buyer,seller_remainder,buyer_remainder,instrument_id,session_id,seller_order_id,buyer_order_id) VALUES(:saled,:deal_date,:buyed,:seller,:buyer,:seller_remainder,:buyer_remainder,:instrument_id,:session_id,:seller_order_id,:buyer_order_id);');
        $executeArray = array
        (
          ":saled"=>$seller->saled,
          ":buyed"=>$buyer->bought,
          ":seller"=>$seller->user_id,
          ":seller_order_id"=>$seller->order_id,
          ":buyer_order_id" => $buyer->order_id,
          ":buyer"=>$buyer->user_id,
          ":deal_date"=>$deal_date,
          ":seller_remainder"=>$seller->remainder,
          ":buyer_remainder"=>$buyer->remainder,
          ":instrument_id"=>$instrument_id,
          ":session_id"=>$session_id
        );
        try{
            $succes = $sth->execute($executeArray);
            if($succes)
            {
                $result->status = 200;
                $result->id = $db->lastInsertId();
                $result->saled = $seller->saled;
                $result->buyed = $buyer->bought;
                $result->seller = $seller->user_id;
                $result->seller_order_id = $seller->order_id;
                $result->buyer_order_id = $buyer->order_id;
                $result->buyer = $buyer->user_id;
                $result->seller_remainder = $seller->remainder;
                $result->buyer_remainder = $buyer->remainder;
                $result->instrument_id = $instrument_id;
                $result->session_id = $session_id;
                $result->deal_date = $deal_date;
                return $result;
            }
        }
        catch (PDOException $e){
            $result->status = 500;
            $result->message = "Database Error: ".$e->getMessage();
            return $result;
        }
    }
    public function getDealsByDate($date_start,$date_end)
    {
        $result = new stdClass();
        $sth = $this->db->prepare('SELECT * FROM deals WHERE deal_date >= :date_start AND deal_date <= :date_end;');
        $executeArray = array
        (
            ":date_start"=>$date_start,
            ":date_end" => $date_end
        );
        try
        {
            $instrument = new Instrument($this->db);
            $sth->execute($executeArray);
            $deals = $sth->fetchAll();
            foreach ($deals as $key=>$deal){
                $deals[$key]['instrument_id'] = $instrument->getInstrumentById($deals[$key]['instrument_id']) ;
            }
            $result->status=200;
            $result->deals = $deals;
            return $result;
        }
        catch (PDOException $e){
            $result->status = 500;
            $result->message = "Database Error: ".$e->getMessage();
            return $result;
        }
    }
}