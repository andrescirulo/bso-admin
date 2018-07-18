<?php
$host="localhost";
$userBase="root";
$passwordBase="";
$dbname="bso_radio";
/*$userBase="encuentr_root";
 $passwordBase="pFZI?z7IVR7-";
 $dbname="encuentr_contactme";*/
try {
    $dbh = new PDO('mysql:host=' . $host . ';dbname=' . $dbname . ';charset=utf8' ,$userBase , $passwordBase);
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}

?>