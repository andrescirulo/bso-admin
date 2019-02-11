<?php
require_once 'domain/cuaderno.php';
require_once 'connect.php';

header('Content-Type: application/json');
session_save_path('sessions');
session_start();
$publico=" AND cuad_publico=1";
if (isset($_SESSION["admin"]) && $_SESSION["admin"] === true){
    $publico="";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["c"])){
    }
    else{
        $cuadernos=array();
        $query = "SELECT cuad_id, cuad_titulo, IFNULL(cuad_imagen,'default_cuaderno.jpg') cuad_imagen,cuad_publico FROM cuadernos WHERE 1=1" . $publico . " ORDER BY cuad_id DESC";
                
        $st = $dbh->prepare($query);
        $st->execute();
        while ($resData = $st->fetch()) {
            $cuaderno = new Cuaderno();
            $cuaderno->id=$resData["cuad_id"];
            $cuaderno->titulo=$resData["cuad_titulo"];
            $cuaderno->imagen=$resData["cuad_imagen"];
            $cuaderno->imagenMin=$resData["cuad_imagen"];
//             $cuaderno->imagenMin=str_replace(".","_min.",$resData["cuad_imagen"]);
            $cuadernos[]=$cuaderno;
        }
        
        echo json_encode($cuadernos);
    }
}
?>