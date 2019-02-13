<?php

function getStaticBaseDir(){
    $baseAdmin = 'bso-admin' . DIRECTORY_SEPARATOR . 'api';
    $basePage = 'bso-radio';
    return str_replace( DIRECTORY_SEPARATOR . $baseAdmin, DIRECTORY_SEPARATOR  . $basePage,getcwd()) . DIRECTORY_SEPARATOR . "static/";
}

function generarStatic($archivo,$titulo,$imagen,$descripcion,$url,$urlRedir){
    $basepath=getStaticBaseDir();
    
    $content=file_get_contents('static_template.html');
    $content=str_replace('{{titulo}}',$titulo,$content);
    $content=str_replace('{{imagen}}',$imagen,$content);
    $content=str_replace('{{descripcion}}',trim(strip_tags($descripcion)),$content);
    $content=str_replace('{{url}}',$url,$content);
    $content=str_replace('{{urlRedir}}',$urlRedir,$content);
    
    file_put_contents ($basepath . $archivo . ".html", $content );
}

// include_once 'connect.php';
// include_once 'domain/capitulo.php';
// $query = "SELECT capi_numero, capi_titulo,capi_texto,capi_imagen FROM capitulos WHERE capi_texto is not null";
// $st = $dbh->prepare($query);
// $st->execute();
// while ($resData = $st->fetch()){

//     $capi = new Capitulo();
//     $capi->numero = $resData["capi_numero"];
//     $capi->titulo = $resData["capi_titulo"];
//     $capi->texto = $resData["capi_texto"];
//     $capi->imagen = $resData["capi_imagen"];

//     $url = 'https://www.bsoradio.com.ar/static/capitulo_' . $capi->numero . '.html';
//     $urlRedir = 'https://www.bsoradio.com.ar/#/capitulo/' . $capi->numero;
//     $imagen = 'https://www.bsoradio.com.ar/api/thumbnail.php?ty=ca&i=' . urlencode($capi->imagen);
//     generarStatic('capitulo_' . $capi->numero,$capi->titulo,$imagen,$capi->texto,$url,$urlRedir);
// }

// include_once 'connect.php';
// include_once 'domain/texto.php';
// $query = "SELECT texto_id, texto_titulo,texto_resenia,texto_imagen_resenia FROM textos";
// $st = $dbh->prepare($query);
// $st->execute();
// while ($resData = $st->fetch()){

//     $tex = new Texto();
//     $tex->id = $resData["texto_id"];
//     $tex->titulo = $resData["texto_titulo"];
//     $tex->resenia = $resData["texto_resenia"];
//     $tex->imagenResenia = $resData["texto_imagen_resenia"];

//     $url = 'https://www.bsoradio.com.ar/static/texto_' . $tex->id . '.html';
//     $urlRedir = 'https://www.bsoradio.com.ar/#/texto/' . $tex->id;
//     $imagen = 'https://www.bsoradio.com.ar/api/thumbnail.php?ty=ca&i=' . urlencode($tex->imagenResenia);
//     generarStatic('texto_' . $tex->id,$tex->titulo,$imagen,$tex->resenia,$url,$urlRedir);
// }

