<?php
require_once 'domain/texto.php';
require_once 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["t"])){
        $idTexto=$_GET["t"];
        $query = "SELECT texto_id, texto_titulo,texto_contenido,texto_autor, texto_subtitulo, texto_fecha, texto_resenia,IFNULL(texto_imagen,'default_texto.jpg') texto_imagen,texto_publico FROM textos WHERE texto_id=?";
        
        $st = $dbh->prepare($query);
        $st->bindParam(1,$idTexto);
        $st->execute();
        $resData = $st->fetch();
        $texto = new Texto();
        $texto->id=$resData["texto_id"];
        $texto->titulo=$resData["texto_titulo"];
        $texto->subtitulo=$resData["texto_subtitulo"];
        $texto->fecha=$resData["texto_fecha"];
        $texto->resenia=$resData["texto_resenia"];
        $texto->imagen=$resData["texto_imagen"];
        $texto->autor=$resData["texto_autor"];
        $texto->texto=$resData["texto_contenido"];
        $texto->publico=$resData["texto_publico"];
        
        echo json_encode($texto);
    }
    else{
        $textos=array();
        
        $query = "SELECT texto_id, texto_titulo,texto_autor, texto_subtitulo, texto_fecha, texto_resenia,IFNULL(texto_imagen,'default_texto.jpg') texto_imagen,texto_publico FROM textos ORDER BY texto_fecha DESC";
        
        $st = $dbh->prepare($query);
        $st->execute();
        while ($resData = $st->fetch()) {
            $texto = new Texto();
            $texto->id=$resData["texto_id"];
            $texto->titulo=$resData["texto_titulo"];
            $texto->subtitulo=$resData["texto_subtitulo"];
            $texto->fecha=$resData["texto_fecha"];
            $texto->resenia=$resData["texto_resenia"];
            $texto->imagen=$resData["texto_imagen"];
            $texto->autor=$resData["texto_autor"];
            $texto->publico=$resData["texto_publico"];
            $textos[]=$texto;
        }
        
        echo json_encode($textos);
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
            $update = "UPDATE textos SET texto_publico=? WHERE texto_id=?";
            $st = $dbh->prepare($update);
            $st->bindParam(1,$request->publico);
            $st->bindParam(2,$request->texto);
            $st->execute();
            $res["respuesta"]="OK";
        }
        echo json_encode($res);
    }
    else{
        $texto=$request;
        if ($texto->editando){
            $update = "UPDATE textos SET texto_titulo=?, texto_subtitulo=?, texto_fecha=?, texto_contenido=?, texto_resenia=?, texto_imagen=?, texto_autor=? WHERE texto_id=?";
            $st = $dbh->prepare($update);
            $st->bindParam(1,$texto->titulo);
            $st->bindParam(2,$texto->subtitulo);
            $st->bindParam(3,$texto->fecha);
            $st->bindParam(4,$texto->texto);
            $st->bindParam(5,$texto->resenia);
            $st->bindParam(6,$texto->imagen);
            $st->bindParam(7,$texto->autor);
            $st->bindParam(8,$texto->id);
            $st->execute();
        }
        else{
            $insert = "INSERT INTO textos (texto_titulo, texto_subtitulo, texto_fecha, texto_contenido, texto_resenia, texto_imagen, texto_autor)";
            $insert = $insert . " VALUES(?,?,?,?,?,?,?)";
            
            $st = $dbh->prepare($insert);
            $st->bindParam(1,$texto->titulo);
            $st->bindParam(2,$texto->subtitulo);
            $st->bindParam(3,$texto->fecha);
            $st->bindParam(4,$texto->texto);
            $st->bindParam(5,$texto->resenia);
            $st->bindParam(6,$texto->imagen);
            $st->bindParam(7,$texto->autor);
            $st->execute();
        }
        echo json_encode($texto);
    }
    
}
?>