<?php
require_once 'domain/entrevista.php';
require_once 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["e"])){
        $query = "SELECT entr_id, entr_titulo, entr_fecha,entr_texto,entr_link,entr_autor, IFNULL(entr_imagen,'default_entrevista.jpg') entr_imagen,entr_publico FROM entrevistas WHERE entr_id=?";
        
        $st = $dbh->prepare($query);
        $st->bindParam(1,$_GET["e"]);
        $st->execute();
        $resData = $st->fetch();
        $entrevista = new Entrevista();
        $entrevista->id=$resData["entr_id"];
        $entrevista->titulo=$resData["entr_titulo"];
        $entrevista->fecha=$resData["entr_fecha"];
        $entrevista->imagen=$resData["entr_imagen"];
        $entrevista->texto=$resData["entr_texto"];
        $entrevista->link=$resData["entr_link"];
        $entrevista->publico=$resData["entr_publico"];
        $entrevista->autor=$resData["entr_autor"];

        echo json_encode($entrevista);
    }
    else{
        $entrevistas=array();
        
        $query = "SELECT entr_id, entr_titulo, entr_fecha,entr_texto,entr_link,entr_autor, IFNULL(entr_imagen,'default_entrevista.jpg') entr_imagen,entr_publico FROM entrevistas ORDER BY entr_fecha DESC";
        
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
            $entrevista->publico=$resData["entr_publico"];
            $entrevista->autor=$resData["entr_autor"];
            $entrevistas[]=$entrevista;
        }
        
        echo json_encode($entrevistas);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    //error_log(print_r($_POST,true),3,'errors.log');
    //error_log(file_get_contents("php://input") ,3,'errors.log');
    $request=json_decode(file_get_contents("php://input") );
    if (property_exists($request,"operacion")){
        $res = array();
        if ($request->operacion=="PUBLICAR"){
            //error_log(print_r($capitulo,true),3,'errors.log');
            $update = "UPDATE entrevistas SET entr_publico=? WHERE entr_id=?";
            $st = $dbh->prepare($update);
            $st->bindParam(1,$request->publico);
            $st->bindParam(2,$request->entrevista);
            $st->execute();
            $res["respuesta"]="OK";
        }
        echo json_encode($res);
    }
    else{
        $entrevista=$request;
        if ($entrevista->editando){
            $update = "UPDATE entrevistas SET entr_titulo=?, entr_texto=?, entr_fecha=?, entr_link=?, entr_imagen=?,entr_autor=? WHERE entr_id=?";
            
            $st = $dbh->prepare($update);
            $st->bindParam(1,$entrevista->titulo);
            $st->bindParam(2,$entrevista->texto);
            $st->bindParam(3,$entrevista->fecha);
            $st->bindParam(4,$entrevista->link);
            $st->bindParam(5,$entrevista->imagen);
            $st->bindParam(6,$entrevista->autor);
            $st->bindParam(7,$entrevista->id);
            $st->execute();
        }
        else{
            $insert = "INSERT INTO entrevistas (entr_titulo, entr_texto, entr_fecha, entr_link, entr_imagen,entr_autor)";
            $insert = $insert . " VALUES(?, ?, ?, ?, ?)";
            
            $st = $dbh->prepare($insert);
            $st->bindParam(1,$entrevista->titulo);
            $st->bindParam(2,$entrevista->texto);
            $st->bindParam(3,$entrevista->fecha);
            $st->bindParam(4,$entrevista->link);
            $st->bindParam(5,$entrevista->imagen);
            $st->bindParam(6,$entrevista->autor);
            $st->execute();
        }
        echo json_encode($entrevista);
    }
    
}
?>