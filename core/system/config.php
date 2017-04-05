<?php
//Фаил конфигурации

//Параметры подключения к БД
$config['Database']['type'] = 'mysql'; //для PostgreSQL будет 'pgsql'
$config['Database']['host'] = 'localhost';
$config['Database']['port'] = '3306'; //для PostgreSQL будет '5432'
$config['Database']['name'] = 'trade-app';
$config['Database']['user'] = 'root';
$config['Database']['password'] = '';
$config['Database']['options'] = array(
    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
    \PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
);

