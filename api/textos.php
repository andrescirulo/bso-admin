<?php
require_once 'domain/texto.php';
require_once 'connect.php';

header('Content-Type: application/json');
$BSO_RADIO_CLI_DIR="../bso-radio/";
$BSO_RADIO_DIR="../../bso-radio/";

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
        
        //HAGO ESTO PARA QUE EL ADMIN PUEDA VER LAS IMAGENES
        $texto->texto = str_replace('img src="','img src="' . $BSO_RADIO_CLI_DIR,$texto->texto);
        
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
        
        //DESHAGO EL FIX DEL PATH DE LAS IMAGENES PARA QUE SE GUARDE BIEN
        $texto->texto = str_replace('img src="' . $BSO_RADIO_CLI_DIR,'img src="',$texto->texto);
        
        //PROCESO LAS IMAGENES QUE SE PUEDAN HABER AGREGADO
        while ($pos=strpos($texto->texto,'<img src="data')){
            //error_log("\n\nENCONTRADO " . $pos,3,'errors.log');
            $pos = $pos+(strlen('<img src="'));
            $data64 = substr($texto->texto,$pos,strpos($texto->texto , '"' , $pos+1)-$pos);
            $data = $data64;
            //error_log("\n\nDATA: " . $data,3,'errors.log');
            if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
                $data = substr($data, strpos($data, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, gif
                
                if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
                    error_log("\n\nPUM 3 ",3,'errors.log');
                }
                
                $data = base64_decode($data);
                
                if ($data === false) {
                    error_log("\n\nPUM 2 ",3,'errors.log');
                }
            } else {
                error_log("\n\nPUM 1 ",3,'errors.log');
            }
            
            $randName = uniqid("txt-") . "." . $type;
            file_put_contents($BSO_RADIO_DIR . "imagenes/textos/" . $randName, $data);
            // VER DE REPROCESAR LA IMAGEN PARA QUE TENGA UN TAMAÑO MAXIMO
            $texto->texto=str_replace($data64 . '"',"imagenes/textos/" . $randName . '" style="width:100%"',$texto->texto);
        }
        
        
        
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