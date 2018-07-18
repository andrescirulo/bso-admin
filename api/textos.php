<?php
require_once 'domain/texto.php';
require_once 'connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET["t"])){
        $idTexto=$_GET["t"];
        $query = "SELECT texto_id, texto_titulo,texto_contenido,texto_autor, texto_subtitulo, texto_fecha, texto_resenia,IFNULL(texto_imagen,'default_texto.jpg') texto_imagen FROM textos WHERE texto_id=?";
        
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
        
        echo json_encode($texto);
    }
    else{
        $textos=array();
        
        $query = "SELECT texto_id, texto_titulo,texto_autor, texto_subtitulo, texto_fecha, texto_resenia,IFNULL(texto_imagen,'default_texto.jpg') texto_imagen FROM textos ORDER BY texto_fecha DESC";
        
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
            $textos[]=$texto;
        }
        
        echo json_encode($textos);
    }
}
?>