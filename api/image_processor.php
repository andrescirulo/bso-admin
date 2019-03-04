<?php

    function generarJpgConMax($srcFile,$destFile,$srcType,$maxWidth){
        list($width_s, $height_s, $type, $attr) = getimagesize($srcFile, $info2);
        $width_d=$maxWidth;
        $height_d=round($height_s*($width_d/$width_s));
        
        if (!file_exists($destFile))
        {
            if ($srcType=='jpg' || $srcType=='jpeg'){
                $gd_s = imagecreatefromjpeg($srcFile); // crea el recurso gd para el origen
            }
            elseif ($srcType=='png'){
                $gd_s = imagecreatefrompng($srcFile); // crea el recurso gd para el origen
            }
            elseif ($srcType=='gif'){
                $gd_s = imagecreatefromgif($srcFile); // crea el recurso gd para el origen
            }
            elseif ($srcType=='webp'){
                $gd_s = imagecreatefromwebp($srcFile); // crea el recurso gd para el origen
            }
            
            $gd_d = imagecreatetruecolor($width_d, $height_d); // crea el recurso gd para la salida
            
            imagecopyresampled($gd_d, $gd_s, 0, 0, 0, 0, $width_d, $height_d, $width_s, $height_s); // redimensiona

            imagejpeg($gd_d,$destFile,85); // graba
            
            // Se liberan recursos
            imagedestroy($gd_s);
            imagedestroy($gd_d);
        }
    }
	
?>
