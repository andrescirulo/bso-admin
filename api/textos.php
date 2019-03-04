<?php
require_once 'domain/texto.php';
require_once 'connect.php';

header('Content-Type: application/json');
/*--DESARROLLO--*/
$BSO_RADIO_CLI_DIR="../bso-radio/";
$BSO_RADIO_DIR="../../bso-radio/";

/*--PRODUCCCION--
$BSO_RADIO_CLI_DIR="https://www.bsoradio.com.ar/";
$BSO_RADIO_DIR="../../public_html/";
*/

session_save_path('sessions');
session_start();
$publico=" AND texto_publico=1";
if (isset($_SESSION["admin"]) && $_SESSION["admin"] === true){
    $publico="";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["t"])){
        $idTexto=$_GET["t"];
        $query = "SELECT texto_id, texto_titulo,texto_contenido,texto_autor, texto_subtitulo, texto_fecha, texto_resenia,texto_imagen,texto_imagen_resenia,texto_publico,texto_seccion FROM textos WHERE texto_id=?" . $publico;
        
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
        $texto->imagenResenia=$resData["texto_imagen_resenia"];
        $texto->imagen=$resData["texto_imagen"];
        $texto->autor=$resData["texto_autor"];
        $texto->texto=$resData["texto_contenido"];
        $texto->publico=$resData["texto_publico"];
        $texto->seccion=$resData["texto_seccion"];
        
        //HAGO ESTO PARA QUE EL ADMIN PUEDA VER LAS IMAGENES
        $texto->texto = str_replace('img src="','img src="' . $BSO_RADIO_CLI_DIR,$texto->texto);
        
        echo json_encode($texto);
    }
    else{
        $LIMITE = 10;
        $pagina=0;
        if (isset($_GET["p"])){
            $pagina=($_GET["p"]-1);
        }
        $offset = $LIMITE*$pagina;
        
        $info= array();
        
        if (!isset($_GET["tp"]) || $_GET["tp"]==0){
            $queryCount = "SELECT COUNT(*) cant FROM textos WHERE 1=1" . $publico;
            $st = $dbh->prepare($queryCount);
            $st->execute();
            $resData = $st->fetch();
            $info['paginas']=ceil($resData["cant"]/($LIMITE*1.0));
        }
        
        $textos=array();
        
        $query = "SELECT texto_id, texto_titulo,texto_autor, texto_subtitulo, texto_fecha, texto_resenia,texto_imagen_resenia,texto_seccion,texto_publico";
        $query.= " FROM textos WHERE 1=1" . $publico . " ORDER BY texto_id DESC LIMIT 10 OFFSET " . $offset;
        
        $st = $dbh->prepare($query);
        $st->execute();
        while ($resData = $st->fetch()) {
            $texto = new Texto();
            $texto->id=$resData["texto_id"];
            $texto->titulo=$resData["texto_titulo"];
            $texto->subtitulo=$resData["texto_subtitulo"];
            $texto->fecha=$resData["texto_fecha"];
            $texto->resenia=$resData["texto_resenia"];
            $texto->imagen=$resData["texto_imagen_resenia"];
            $texto->autor=$resData["texto_autor"];
            $texto->seccion=$resData["texto_seccion"];
            $texto->publico=$resData["texto_publico"];
            $textos[]=$texto;
        }
        $info['textos']=$textos;
        
        echo json_encode($info);
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
            
            $query = "SELECT texto_id, texto_titulo,texto_contenido,texto_autor, texto_subtitulo, texto_fecha, texto_resenia,texto_imagen,texto_imagen_resenia,texto_publico,texto_seccion FROM textos WHERE texto_id=?" . $publico;
            $st = $dbh->prepare($query);
            $st->bindParam(1,$request->texto);
            $st->execute();
            $resData = $st->fetch();
            $texto = new Texto();
            $texto->id=$resData["texto_id"];
            $texto->titulo=$resData["texto_titulo"];
            $texto->resenia=$resData["texto_resenia"];
            $texto->imagenResenia=$resData["texto_imagen_resenia"];
            
            include_once('static_generator.php');
            $url = 'https://www.bsoradio.com.ar/static/texto_' . $tex->id . '.html';
            $urlRedir = 'https://www.bsoradio.com.ar/#/texto/' . $texto->id;
            $imagen = 'https://www.bsoradio.com.ar/imagenes/' . $texto->imagenResenia;
            generarStatic('texto_' . $texto->id,$texto->titulo,$imagen,$texto->resenia,$url,$urlRedir);
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
            
            $idName = uniqid("txt-");
            $randSrcName = $idName . "_src." . $type;
            $randName = $idName . ".jpg";
            file_put_contents($BSO_RADIO_DIR . "imagenes/tmp/" . $randSrcName, $data);
            
            // VER DE REPROCESAR LA IMAGEN PARA QUE TENGA UN TAMAÑO MAXIMO
            include_once 'image_processor.php';
            generarJpgConMax($BSO_RADIO_DIR . "imagenes/tmp/" . $randSrcName,$BSO_RADIO_DIR . "imagenes/textos/" . $randName,$type,1000);
            
            $texto->texto=str_replace($data64 . '"',"imagenes/textos/" . $randName . '" style="width:100%"',$texto->texto);
        }
        
        
        $seccion = ($texto->seccion==null || trim($texto->seccion)=='')?null:$texto->seccion;
        $subtitulo = ($texto->subtitulo==null || trim($texto->subtitulo)=='')?null:$texto->subtitulo;
        
        
        if ($texto->editando){
            $update = "UPDATE textos SET texto_titulo=?, texto_subtitulo=?, texto_fecha=?, texto_contenido=?, texto_resenia=?, texto_autor=?, texto_seccion=? WHERE texto_id=?";
            $st = $dbh->prepare($update);
            $st->bindParam(1,$texto->titulo);
            $st->bindParam(2,$subtitulo);
            $st->bindParam(3,$texto->fecha);
            $st->bindParam(4,$texto->texto);
            $st->bindParam(5,$texto->resenia);
            $st->bindParam(6,$texto->autor);
            $st->bindParam(7,$seccion);
            $st->bindParam(8,$texto->id);
            $st->execute();
        }
        else{
            $insert = "INSERT INTO textos (texto_titulo, texto_subtitulo, texto_fecha, texto_contenido, texto_resenia, texto_autor, texto_seccion)";
            $insert = $insert . " VALUES(?,?,?,?,?,?,?)";
            
            $st = $dbh->prepare($insert);
            $st->bindParam(1,$texto->titulo);
            $st->bindParam(2,$subtitulo);
            $st->bindParam(3,$texto->fecha);
            $st->bindParam(4,$texto->texto);
            $st->bindParam(5,$texto->resenia);
            $st->bindParam(6,$texto->autor);
            $st->bindParam(7,$seccion);
            $st->execute();
            
        }
        echo json_encode($texto);
    }
    
}
?>