<?php
require_once 'domain/entrevista.php';
require_once 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["t"])){
    }
    else{
        $entrevistas=array();
        
        $query = "SELECT entr_id, entr_titulo, entr_fecha,entr_texto,entr_link, IFNULL(entr_imagen,'default_entrevista.jpg') entr_imagen FROM entrevistas ORDER BY entr_fecha DESC";
        
        $st = $dbh->prepare($query);
        $st->execute();
        while ($resData = $st->fetch()) {
            $entrevista = new Entrevista();
            $entrevista->id=$resData["entr_id"];
            $entrevista->titulo=$resData["entr_titulo"];
            $entrevista->fecha=$resData["entr_fecha"];
            $entrevista->imagen=$resData["entr_imagen"];
            $entrevista->texto=$resData["entr_texto"];
            $entrevista->link=$resData["entr_link"];
            $entrevistas[]=$entrevista;
        }
        
        echo json_encode($entrevistas);
    }
}
?>