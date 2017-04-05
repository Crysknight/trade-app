<?php

/**
 * Created by Ilkin
 * Date: 21.03.2017
 * Time: 1:11
 */
class Database {

    private static $db_handle = null;
    function __construct() {
        //подключаем конфиг файл
        include(dirname(__FILE__) . '/../config.php');
        //лепим DSN строку подключения
		$data_source_name = $config['Database']['type'].':
							host='.$config['Database']['host'].';
							port='.$config['Database']['port'].';
							dbname='.$config['Database']['name'];
		//подключаемся к БД
        try
        {
            self::$db_handle = new PDO($data_source_name, $config['Database']['user'], $config['Database']['password'], $config['Database']['options']);
        }
        catch (PDOException $e)
        {
            echo "Database Error: ".$e;
        }
		//возвращаем объект PDO
    }
    static function getDbHandle()
    {
        return self::$db_handle;
    }
} 