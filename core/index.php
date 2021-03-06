<?php
// web/index.php
require_once __DIR__.'/vendor/autoload.php';
require_once dirname(__FILE__) . '/system/core/User.php';
require_once dirname(__FILE__) . '/system/core/Database.php';
require_once dirname(__FILE__) . '/system/core/Order.php';
require_once dirname(__FILE__) . '/system/core/Session.php';
require_once dirname(__FILE__) . '/system/core/Instrument.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
$user = new User((new Database())->getDbHandle());
$app = new Silex\Application();

$app->post('/login', function (Request $request) use ($user) {
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $userInfo = @$user->login($post->eMail,$post->password);
    if($userInfo && $userInfo['role_id'] != 0)
    {
        return new Response(json_encode($userInfo), 200);
    }
    else{
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/addorder',function(Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0 )
    {
        $order = new Order(Database::getDbHandle());
        $result= @$order->addOrder
            (
                $user['id'],
                $post->type,
                $post->quantity,
                $post->instrument_id,
                $post->session_id
            );
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/sessionadd',function(Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $session = new Session(Database::getDbHandle());
        $result = @$session->add($post->date_start,$post->date_end,$post->instrument_ids);
        if($result){
            return new Response(json_encode($result),$result->status);
        }
    }
    else
    {
        $result->status = 500;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/sessionend',function(Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $session = new Session(Database::getDbHandle());
        $result = @$session->end($post->id);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/sessioncheck',function(Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $session = new Session(Database::getDbHandle());
        $result = @$session->checkSession();
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/sessiongetinstruments',function(Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $session = new Session(Database::getDbHandle());
        $result = @$session->getInstruments($post->session_id);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/deleteorder',function (Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $order = new Order(Database::getDbHandle());
        $result = @$order->deleteOrder($post->id);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/deleteordersarray',function (Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $order = new Order(Database::getDbHandle());
        $result = @$order->deleteOrdersArray($post->ids);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/checkorders',function (Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $order = new Order(Database::getDbHandle());
        $result = $order->checkOrders($user['id'],$post->session_id);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/checkdeals',function (Request $request) use ($user){
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $order = new Deal(Database::getDbHandle());
        $result = $order->checkDeals($user['id']);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/getinstruments',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $instrument = new Instrument(Database::getDbHandle());
        $result = $instrument->getInstruments($post->session_id);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/addinstrument',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $instrument = new Instrument(Database::getDbHandle());
        $result = $instrument->addInstrument($post->instrument_name,$post->instrument_price);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/updateinstrument',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $instrument = new Instrument(Database::getDbHandle());
        $result = @$instrument->updateInstrument($post->instrument_id,$post->instrument_name,$post->instrument_price,$post->interest);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/updateinstrumentstatus',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $instrument = new Instrument(Database::getDbHandle());
        $result = @$instrument->setStatus($post->instrument_id,$post->instrument_status);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/checkupdate',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
         $deal = new Deal(Database::getDbHandle());
         $session = new Session(Database::getDbHandle());
         $result->checksession = $session->checkSession();

         $result->checkdeals = $deal->checkdeals($user['id'],$result->checksession->session_id);
         $result->getinstruments = $session->getInstruments($result->checksession->session_id);
         $result->status = 200;
         return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/adduser',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $usera= @$user->getByToken($post->token);
    if($usera && $usera['role_id'] == 1)
    {
        $result->adduser =
        $user->addUser
        (
            $post->user_name,
            $post->user_pass,
            $post->role_id,
            $post->fio,
            $post->organization,
            $post->phone,
            $post->comment
        );
        $result->status = 200;
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/updateuser',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $usera= @$user->getByToken($post->token);
    if($usera && $usera['role_id'] == 1)
    {
        $result->updateuser = $user->updateUser
        (
            $post->user_id,
            $post->user_name,
            $post->role_id,
            $post->fio,
            $post->organization,
            $post->phone,
            $post->comment,
            $post->user_pass
        );
        $result->status = 200;
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/deleteuser',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $usera= @$user->getByToken($post->token);
    if($usera && $usera['role_id'] == 1 )
    {
        $result->deleteuser = $user->deleteUser($post->user_id);
        $result->status = 200;
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});

$app->post('/getdealsbydate',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] != 0 )
    {
        $deal = new Deal(Database::getDbHandle());
        $result = $deal->getDealsByDate($post->date_start,$post->date_end);
        $result->status = 200;
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/getusers',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $usera= @$user->getByToken($post->token);
    if($usera && $usera['role_id'] == 1 )
    {
        $result->getusers = $user->getUsers();
        $result->status = 200;
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/getlastsession',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] !=0)
    {
        $session = new Session(Database::getDbHandle());
        $result->lastsession = $session->getLastSession();
        $result->status = 200;
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/getallorders',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $order = new Order(Database::getDbHandle());
        $result->orders = $order->getAllOrders($post->session_id);
        $result->status = 200;
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/hasplannedsession',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $session = new Session(Database::getDbHandle());
        $result = $session->hasPlannedSession();
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/cancelordersbyinstrument',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $order = new Order(Database::getDbHandle());
        $result = $order->cancelOrdersByInstrument($post->instrument_id);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/deleteplannedsession',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $session = new Session(Database::getDbHandle());
        $result = $session->deletePlannedSession();
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->post('/updatesession',function (Request $request) use ($user)
{
    $result = new stdClass();
    $post = json_decode($request->getContent());
    $user= @$user->getByToken($post->token);
    if($user && $user['role_id'] == 1)
    {
        $session = new Session(Database::getDbHandle());
        $result = $session->updateSession($post->session_id,$post->date_end);
        return new Response(json_encode($result),$result->status);
    }
    else
    {
        $result->status = 401;
        $result->message = "User not authorized";
        return new Response(json_encode($result),$result->status);
    }
});
$app->run();
?>