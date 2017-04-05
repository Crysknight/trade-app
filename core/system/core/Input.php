<?php
/*********************************
Клас обработки вводимой инфоомации
**********************************/
class Input {
	
	//проверка введных данных (строка, тип данных, длина строки)
	function checkString($string, $type = 'char', $length = NULL) {
        //удаляем пробелы
        $string = trim($string);
		$string_length = strlen($string);
        //если строка не пуста
        if(!empty($string)) {
            //в зависимсоти от типа данных проверяем по разным правилам
            switch($type){
                //цифры
                case 'num':
                    $regexp = '/^[0-9]+$/';
                    break;
                //цифры и буквы
                case 'char':
                    $regexp = '/^[0-9a-zA-Z]+$/';
                    break;
                //только буквы
                case 'letter':
                    $regexp = '/^[a-zA-Z]+$/';
                    break;
            }
            //если строка соответствует маске проверки и длинне (если длинна задана)
            if(preg_match($regexp ,$string) AND (($length != NULL AND $length == $string_length) OR ($length == NULL))){
				//возвращаем строку
                return $string;
            } else {
				//иначе возвращаем false
                return false;
            }
        } else {
            return false;
        }
    }
}