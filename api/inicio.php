<?php
require_once 'domain/post.php';
require_once 'connect.php';

header('Content-Type: application/json');
session_save_path('sessions');
session_start();
//TEMPORAL
$_SESSION["admin"]=true;

$publico=" AND publico=1";
if (isset($_SESSION["admin"]) && $_SESSION["admin"] === true){
    $publico="";
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $LIMITE = 10;
    $pagina=0;
    if (isset($_GET["p"])){
        $pagina=($_GET["p"]-1);
    }
    $offset = $LIMITE*$pagina;
    
    $info= array();
    $posts = array();
    
    if (!isset($_GET["tp"]) || $_GET["tp"]==0){
        $queryCount = "SELECT COUNT(*) cant FROM bso_radio.v_posts WHERE 1=1" . $publico;
        $st = $dbh->prepare($queryCount);
        $st->execute();
        $resData = $st->fetch();
        $info['paginas']=ceil($resData["cant"]/($LIMITE*1.0));
    }
    
    $query = "SELECT id,titulo, seccion, texto, imagen, fecha, tipo FROM v_posts WHERE 1=1" . $publico . " ORDER BY fecha DESC LIMIT 10 OFFSET " . $offset;
    
    $st = $dbh->prepare($query);
    $st->execute();
    while ($resData = $st->fetch()) {
        $post = new Post();
        $post->id=$resData["id"];
        $post->fecha=$resData["fecha"];
        $post->imagen=$resData["imagen"];
        $post->seccion=$resData["seccion"];
        $post->texto=trim(strip_tags($resData["texto"]));
        $post->tipo=$resData["tipo"];
        $post->titulo=$resData["titulo"];
        
        $posts[] = $post;
    }
    $info['posts']=$posts;
    
    echo json_encode($info);
}

?>