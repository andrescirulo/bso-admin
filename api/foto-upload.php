<?php
$fileName = $_FILES['file']['name'];
$fileType = $_FILES['file']['type'];
$fileError = $_FILES['file']['error'];

require_once('config.php');
session_save_path('sessions');
session_start();
$res = array();
$basepath="../" . $MAIN_DIR . "/";
if($fileError == UPLOAD_ERR_OK){
    //$fileContent = file_get_contents($_FILES['file']['tmp_name']);
    $imgType = exif_imagetype($_FILES["file"]["tmp_name"]);

    if ($imgType==IMAGETYPE_JPEG || $imgType==IMAGETYPE_PNG){
        include_once 'connect.php';
        
        $tipo=$_POST["tipo"];
        $id=$_POST["id"];
        $ext = pathinfo($fileName, PATHINFO_EXTENSION);
        
        if ($tipo=='TEXTO_PRINCIPAL'){
            $nombreArchivo = $id . "_top." . $ext;
        }
        else{
            $nombreArchivo = $id . "." . $ext;
        }
        //REEMPLAZO EN EL DIRECTORIO ACTUAL EL PATH api POR imagenes PARA TENER EL PATH DE IMAGENES DEL SERVIDOR
        $pathArchivo = str_replace( DIRECTORY_SEPARATOR . 'api', DIRECTORY_SEPARATOR . $basepath  . 'imagenes',getcwd()) . DIRECTORY_SEPARATOR;
        $pathArchivo .= $_POST["path"];
        
        $archivoDestino =  $_POST["path"] . DIRECTORY_SEPARATOR . $nombreArchivo;
        
        move_uploaded_file($_FILES["file"]["tmp_name"],$pathArchivo . DIRECTORY_SEPARATOR  . $nombreArchivo);

        
        $upd="";
        switch ($tipo){
            case 'CAPITULO':{
                $upd="UPDATE capitulos SET capi_imagen = ? WHERE capi_numero=?";
                break;
            }
            case 'ENTREVISTA':{
                $upd="UPDATE entrevistas SET entr_imagen = ? WHERE entr_id=?";
                break;
            }
            case 'TEXTO_PRINCIPAL':{
                $upd="UPDATE textos SET texto_imagen = ? WHERE texto_id=?";
                break;
            }
            case 'TEXTO_RESENIA':{
                $upd="UPDATE textos SET texto_imagen_resenia = ? WHERE texto_id=?";
                break;
            }
        }
        
        $st = $dbh->prepare($upd);
        $st->bindParam(1,$archivoDestino);
        $st->bindParam(2,$id);
        $st->execute();
        
        //CREO LOS THUMBNAILS AL SUBIR EL ARCHIVO PARA AHORRAR TIEMPO FUTURO EN LA VISUALIZACION
//         include_once 'get_thumb.php';
//         crearThumbConMinimo($_SESSION["usua_id"],$nombreArchivo,72);
//         crearThumbConMinimo($_SESSION["usua_id"],$nombreArchivo,150);
//         crearThumbConMinimo($_SESSION["usua_id"],$nombreArchivo,600);

        $res['archivo']=$archivoDestino;
        $res['error']=false;
    }
    else{
        $res['error']=true;
        $res['message']="El archivo no es una imagen JPEG valida";
    }
}else{
   switch($fileError){
     case UPLOAD_ERR_INI_SIZE:   
          $message = 'Error al intentar subir un archivo que excede el tamaño permitido.';
          break;
     case UPLOAD_ERR_FORM_SIZE:  
          $message = 'Error al intentar subir un archivo que excede el tamaño permitido.';
          break;
     case UPLOAD_ERR_PARTIAL:    
          $message = 'Error: no terminó la acción de subir el archivo.';
          break;
     case UPLOAD_ERR_NO_FILE:    
          $message = 'Error: ningún archivo fue subido.';
          break;
     case UPLOAD_ERR_NO_TMP_DIR: 
          $message = 'Error: servidor no configurado para carga de archivos.';
          break;
     case UPLOAD_ERR_CANT_WRITE: 
          $message= 'Error: posible falla al grabar el archivo.';
          break;
     case  UPLOAD_ERR_EXTENSION: 
          $message = 'Error: carga de archivo no completada.';
          break;
     default: $message = 'Error: carga de archivo no completada.';
            break;
    }
    $res['error']=true;
    $res['message']=$message;
}
echo json_encode($res);
?>