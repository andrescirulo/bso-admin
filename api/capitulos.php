<?php
require_once 'domain/capitulo.php';
require_once 'domain/temporada.php';
require_once 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["t"])){
        $capitulos = array();
        
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_link,capi_publico FROM capitulos WHERE capi_temporada=?";
        $st = $dbh->prepare($query);
        $st->bindParam(1,$_GET["t"]);
        $st->execute();
        while ($resData = $st->fetch()) {
            $capitulo = new Capitulo();
            $capitulo->temporada = $resData["capi_temporada"];
            $capitulo->numero = $resData["capi_numero"];
            $capitulo->nombre = $resData["capi_nombre"];
            $capitulo->linkDescargar = $resData["capi_link_descargar"];
            $capitulo->publico = $resData["capi_publico"];
            $capitulos[] = $capitulo;
        }
        
        echo json_encode($capitulos);
    }
    elseif (isset($_GET["c"])){
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_link_descargar,capi_link_escuchar,capi_fecha,capi_texto,IFNULL(capi_imagen,'default_capitulo.jpg') capi_imagen,capi_publico FROM capitulos WHERE capi_numero=?";
        $st = $dbh->prepare($query);
        $st->bindParam(1,$_GET["c"]);
        $st->execute();
        $resData = $st->fetch();
        $capitulo = new Capitulo();
        $capitulo->temporada = $resData["capi_temporada"];
        $capitulo->fecha= $resData["capi_fecha"];
        $capitulo->numero = $resData["capi_numero"];
        $capitulo->nombre = $resData["capi_nombre"];
        $capitulo->linkDescargar = $resData["capi_link_descargar"];
        $capitulo->linkEscuchar = $resData["capi_link_escuchar"];
        $capitulo->texto = $resData["capi_texto"];
        $capitulo->imagen = $resData["capi_imagen"];
        $capitulo->publico = $resData["capi_publico"];
    
        echo json_encode($capitulo);
    }
    elseif (isset($_GET["r"])){
        $capitulos = array();
        $idRef=$_GET["r"];
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_fecha,capi_imagen,capi_publico FROM capitulos WHERE capi_numero<>? ORDER BY capi_fecha desc LIMIT 5";
        $st = $dbh->prepare($query);
        $st->bindParam(1,$idRef);
        $st->execute();
        while ($resData = $st->fetch()) {
            $capitulo = new Capitulo();
            $capitulo->fecha = $resData["capi_fecha"];
            $capitulo->numero = $resData["capi_numero"];
            $capitulo->nombre = $resData["capi_nombre"];
            $capitulo->imagen = $resData["capi_imagen"];
            $capitulo->publico = $resData["capi_publico"];
            $capitulos[] = $capitulo;
        }
        
        echo json_encode($capitulos);
    }
    else{
        $capitulos = array();
        
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_link_descargar,capi_link_escuchar,capi_fecha,capi_texto,IFNULL(capi_imagen,'default_capitulo.jpg') capi_imagen,capi_publico FROM capitulos ORDER BY capi_numero DESC LIMIT 10";
        $st = $dbh->prepare($query);
        $st->execute();
        while ($resData = $st->fetch()) {
            $capitulo = new Capitulo();
            $capitulo->temporada = $resData["capi_temporada"];
            $capitulo->fecha= $resData["capi_fecha"];
            $capitulo->numero = $resData["capi_numero"];
            $capitulo->nombre = $resData["capi_nombre"];
            $capitulo->linkDescargar = $resData["capi_link_descargar"];
            $capitulo->linkEscuchar = $resData["capi_link_escuchar"];
            $capitulo->texto = $resData["capi_texto"];
            $capitulo->imagen = $resData["capi_imagen"];
            $capitulo->publico = $resData["capi_publico"];
            $capitulos[] = $capitulo;
        }
        
        echo json_encode($capitulos);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    //error_log(print_r($_POST,true),3,'errors.log');
    //error_log(file_get_contents("php://input") ,3,'errors.log');
    $capitulo=json_decode(file_get_contents("php://input") );
    if (property_exists($capitulo,"operacion")){
        $res = array();
        if ($capitulo->operacion=="PUBLICAR"){
            //error_log(print_r($capitulo,true),3,'errors.log');
            $update = "UPDATE capitulos SET capi_publico=? WHERE capi_numero=?";
            $st = $dbh->prepare($update);
            $st->bindParam(1,$capitulo->publico);
            $st->bindParam(2,$capitulo->capitulo);
            $st->execute();
            $res["respuesta"]="OK";
        }
        echo json_encode($res);
    }
    else{
        if ($capitulo->editando){
            $update = "UPDATE capitulos SET capi_temporada=?, capi_nombre=?, capi_link_descargar=?, capi_fecha=?, capi_texto=?, capi_link_escuchar=?, capi_imagen=? WHERE capi_numero=?";
            $st = $dbh->prepare($update);
            $st->bindParam(1,$capitulo->temporada);
            $st->bindParam(2,$capitulo->nombre);
            $st->bindParam(3,$capitulo->linkDescargar);
            $st->bindParam(4,$capitulo->fecha);
            $st->bindParam(5,$capitulo->texto);
            $st->bindParam(6,$capitulo->linkEscuchar);
            $st->bindParam(7,$capitulo->imagen);
            $st->bindParam(8,$capitulo->numero);
            $st->execute();
        }
        else{
            $insert = "INSERT INTO capitulos (capi_temporada, capi_numero, capi_nombre, capi_link_descargar, capi_fecha, capi_texto, capi_link_escuchar, capi_imagen)";
            $insert = $insert . " VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
            $st = $dbh->prepare($insert);
            $st->bindParam(1,$capitulo->temporada);
            $st->bindParam(2,$capitulo->numero);
            $st->bindParam(3,$capitulo->nombre);
            $st->bindParam(4,$capitulo->linkDescargar);
            $st->bindParam(5,$capitulo->fecha);
            $st->bindParam(6,$capitulo->texto);
            $st->bindParam(7,$capitulo->linkEscuchar);
            $st->bindParam(8,$capitulo->imagen);
            $st->execute();
        }
        echo json_encode($capitulo);
    }
	
}
?>