<?php
require_once 'domain/temporada.php';
require_once 'domain/capitulo.php';
require_once 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["t"])){
        $capitulos = array();
        
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_link_descargar FROM capitulos WHERE capi_temporada=?";
        $st = $dbh->prepare($query);
        $st->bindParam(1,$_GET["t"]);
        $st->execute();
        while ($resData = $st->fetch()) {
            $capitulo = new Capitulo();
            $capitulo->temporada = $resData["capi_temporada"];
            $capitulo->numero = $resData["capi_numero"];
            $capitulo->nombre = $resData["capi_nombre"];
            $capitulo->linkDescargar = $resData["capi_link_descargar"];
            $capitulos[] = $capitulo;
        }
        
        echo json_encode($capitulos);
    }
    else{
        $temporadas=array();
        
        $query = "SELECT capi_temporada FROM capitulos GROUP BY capi_temporada";
        $st = $dbh->prepare($query);
        $st->execute();
        while ($resData = $st->fetch()) {
            $temp = new Temporada();
            $temp->numero=$resData["capi_temporada"];
            $temporadas[]=$temp;
        }
        
        echo json_encode($temporadas);
    }
}
?>