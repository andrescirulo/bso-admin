<?php
    session_save_path('sessions');
    session_start();
    if (isset($_GET["mode"]) && isset($_GET["user"]) && isset($_GET["pass"])){
        $user=$_GET["user"];
        $pass=$_GET["pass"];
        $mode=$_GET["mode"];
        if ($user == "admin" && $pass="654321"){
            if ($mode=="admin"){
                $_SESSION["admin"]=true;
                echo 'ADMIN MODE ON';
            }
            else{
                $_SESSION["admin"]=false;
                echo 'ADMIN MODE OFF';
            }
        }
    }
?>