<?php
require_once 'domain/temporada.php';
require_once 'domain/capitulo.php';
require_once 'connect.php';

header('Content-Type: application/json');
session_save_path('sessions');
session_start();
$publico=" AND cuad_publico=1";
if (isset($_SESSION["admin"]) && $_SESSION["admin"] === true){
    $publico="";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["t"])){
        $capitulos = array();
        
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_link_descargar,capi_temporada_desc FROM capitulos WHERE capi_temporada=?" . $publico;
        $st = $dbh->prepare($query);
        $st->bindParam(1,$_GET["t"]);
        $st->execute();
        while ($resData = $st->fetch()) {
            $capitulo = new Capitulo();
            $capitulo->temporada = $resData["capi_temporada"];
            $capitulo->temporadaDescripcion = $resData["capi_temporada_desc"];
            $capitulo->numero = $resData["capi_numero"];
            $capitulo->nombre = $resData["capi_nombre"];
            $capitulo->linkDescargar = $resData["capi_link_descargar"];
            $capitulos[] = $capitulo;
        }
        
        echo json_encode($capitulos);
    }
    else{
        $temporadas=array();
        
        $query = "SELECT capi_temporada,capi_temporada_desc,MAX(DATE_FORMAT(capi_fecha, '%Y')) temp_anio,COUNT(*) cant_capitulos";
        $query .= " FROM capitulos WHERE  1=1" . $publico . " GROUP BY capi_temporada,capi_temporada_desc ORDER BY capi_temporada DESC";
        $st = $dbh->prepare($query);
        $st->execute();
        while ($resData = $st->fetch()) {
            $temp = new Temporada();
            $temp->numero=$resData["capi_temporada"];
            $temp->descripcion=$resData["capi_temporada_desc"];
            $temp->anio=$resData["temp_anio"];
            $temp->cantidadCapitulos=$resData["cant_capitulos"];
            $temporadas[]=$temp;
        }
        
        echo json_encode($temporadas);
    }
}
?>