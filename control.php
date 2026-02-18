<html>
    <h1><b><center>Control Satement</center></b></h1>

    <?php
    $marks=80;
    if($marks<35)
        echo"sorry!! You have failed. Try Again";
    elseif($marks<50)
        echo "Passed with Third class";
    elseif($marks<60)
        echo "Passed with Second class";
    elseif($marks<75)
        echo "Passed with First class";
    else
        echo "Passed with Distinction"
    ?>
    </html>