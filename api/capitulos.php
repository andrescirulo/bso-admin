<?php
require_once 'domain/capitulo.php';
require_once 'domain/temporada.php';
require_once 'connect.php';

header('Content-Type: application/json');
session_save_path('sessions');
session_start();
$publico=" AND capi_publico=1";
if (isset($_SESSION["admin"]) && $_SESSION["admin"] === true){
    $publico="";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["t"])){
        $capitulos = array();
        
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_link,capi_publico FROM capitulos WHERE capi_temporada=?" . $publico;
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
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_titulo,capi_link_descargar,capi_link_ivoox,capi_link_mixcloud,capi_fecha,capi_texto,IFNULL(capi_imagen,'default_capitulo.jpg') capi_imagen,capi_publico FROM capitulos WHERE capi_numero=?" . $publico;
        $st = $dbh->prepare($query);
        $st->bindParam(1,$_GET["c"]);
        $st->execute();
        $resData = $st->fetch();
        $capitulo = new Capitulo();
        $capitulo->temporada = $resData["capi_temporada"];
        $capitulo->fecha= $resData["capi_fecha"];
        $capitulo->numero = $resData["capi_numero"];
        $capitulo->nombre = $resData["capi_nombre"];
        $capitulo->titulo = $resData["capi_titulo"];
        $capitulo->linkDescargar = $resData["capi_link_descargar"];
        $capitulo->linkIvoox = $resData["capi_link_ivoox"];
        $capitulo->linkMixcloud = $resData["capi_link_mixcloud"];
        $capitulo->texto = $resData["capi_texto"];
        $capitulo->imagen = $resData["capi_imagen"];
        $capitulo->publico = $resData["capi_publico"];
    
        echo json_encode($capitulo);
    }
    elseif (isset($_GET["r"])){
        $capitulos = array();
        $idRef=$_GET["r"];
        $query = "SELECT capi_temporada,capi_numero, capi_nombre,capi_fecha,capi_imagen,capi_publico FROM capitulos WHERE capi_numero<>?" . $publico . " ORDER BY capi_fecha desc LIMIT 5";
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
    elseif (isset($_GET["tn"])){
        $capitulos = array();
        if ($_GET["tn"]==0){
            $query = "SELECT MIN(capi_numero) maximo FROM capitulos";
            $paso = -1;
        }
        else{
            $query = "SELECT MAX(capi_numero) maximo FROM capitulos";
            $paso = 1;
        }
        
        $st = $dbh->prepare($query);
        $st->execute();
        $resData = $st->fetch();
        
        $num = $resData["maximo"] + $paso;
        $res = array();
        $res["num"] = $num;
        echo json_encode($res);
    }
    else{
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
            
            
            $query = "SELECT capi_numero, capi_titulo,capi_texto,capi_imagen FROM capitulos WHERE capi_numero=?";
            $st = $dbh->prepare($query);
            $st->bindParam(1,$capitulo->capitulo);
            $st->execute();
            $resData = $st->fetch();
            $capi = new Capitulo();
            $capi->numero = $resData["capi_numero"];
            $capi->titulo = $resData["capi_titulo"];
            $capi->texto = $resData["capi_texto"];
            $capi->imagen = $resData["capi_imagen"];
            
            include_once('static_generator.php');
            $url = 'https://www.bsoradio.com.ar/static/capitulo_' . $capi->numero . '.html';
            $urlRedir = 'https://www.bsoradio.com.ar/#/capitulo/' . $capi->numero;
            $imagen = 'https://www.bsoradio.com.ar/imagenes/' . $capi->imagen;
            generarStatic('capitulo_' . $capi->numero,$capi->titulo,$imagen,$capi->texto,$url,$urlRedir);
        }
        elseif ($capitulo->operacion=="ELIMINAR"){
            $update = "DELETE FROM capitulos WHERE capi_numero=?";
            $st = $dbh->prepare($update);
            $st->bindParam(1,$capitulo->capitulo);
            $st->execute();
            $res["respuesta"]="OK";
        }
        echo json_encode($res);
    }
    else{
        if ($capitulo->editando){
            $update = "UPDATE capitulos SET capi_temporada=?, capi_nombre=?, capi_titulo=?, capi_link_descargar=?, capi_fecha=?, capi_texto=?, capi_link_ivoox=?, capi_link_mixcloud=? WHERE capi_numero=?";
            $st = $dbh->prepare($update);
            $st->bindParam(1,$capitulo->temporada);
            $st->bindParam(2,$capitulo->nombre);
            $st->bindParam(3,$capitulo->titulo);
            $st->bindParam(4,$capitulo->linkDescargar);
            $st->bindParam(5,$capitulo->fecha);
            $st->bindParam(6,$capitulo->texto);
            $st->bindParam(7,$capitulo->linkIvoox);
            $st->bindParam(8,$capitulo->linkMixcloud);
            $st->bindParam(9,$capitulo->numero);
            $st->execute();
        }
        else{
            if ($capitulo->temporada==0){
                $tempDesc = 'Spinoff!';
            }
            else{
                $tempDesc= 'Temporada ' . $capitulo->temporada;
            }
            
            $insert = "INSERT INTO capitulos (capi_temporada, capi_numero, capi_nombre, capi_titulo, capi_link_descargar, capi_fecha, capi_texto, capi_link_ivoox, capi_link_mixcloud,capi_temporada_desc)";
            $insert = $insert . " VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
            $st = $dbh->prepare($insert);
            $st->bindParam(1,$capitulo->temporada);
            $st->bindParam(2,$capitulo->numero);
            $st->bindParam(3,$capitulo->nombre);
            $st->bindParam(4,$capitulo->titulo);
            $st->bindParam(5,$capitulo->linkDescargar);
            $st->bindParam(6,$capitulo->fecha);
            $st->bindParam(7,$capitulo->texto);
            $st->bindParam(8,$capitulo->linkIvoox);
            $st->bindParam(9,$capitulo->linkMixcloud);
            $st->bindParam(10,$tempDesc);
            $ok=$st->execute();
            if ($ok === true){
                error_log("\nOK capitulo",3,'errors.log');
            }
            else{
                error_log("\nMAL capitulo",3,'errors.log');
                error_log("\n" . print_r($st->errorInfo(),true),3,'errors.log');
            }
        }
        
        echo json_encode($capitulo);
    }
	
}
?>