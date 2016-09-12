<?php
/**
 * Created by PhpStorm.
 * User: Amin Abedi ,Amedia co
 * Date: 9/11/2016
 * Time: 4:12 PM
 */

function post_category($PostBodyCurl)
{
    $curl = curl_init();
    $PostBody[0]=$PostBodyCurl;
    $url = "http://localhost/";
    $url_PORT = "3000";
    $credentials = "anarAppcategory:Fu4*;^6{%+CN*G#x";
    curl_setopt_array($curl, array(
        CURLOPT_PORT => $url_PORT,
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"jsonrpc\": \"2.0\", \"method\": \"categorize\", \"params\": [\"" . $PostBody[0] . "\"] , \"id\":1}",
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic " . base64_encode($credentials),
            "cache-control: no-cache",
            "content-type: application/json"
        ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
        return $err;
    } else {
        //  echo $response;
        $json = json_decode($response, true);
        return $json['result'];
    }


}
//$credentials = "payam:payam";
//$postbodyCURL='یکی بیاد پیوی من';
//$response1=post_category($postbodyCURL);
//echo $response1;
