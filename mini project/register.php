<?php
include "db.php";

if(isset($_POST['submit'])){

$name = $_POST['name'];
$age = $_POST['age'];
$blood = $_POST['blood_group'];
$city = $_POST['city'];
$phone = $_POST['phone'];

$sql = "INSERT INTO donor (name, age, blood_group, city, phone)
VALUES ('$name','$age','$blood','$city','$phone')";

if(mysqli_query($conn,$sql)){
    echo "Donor Registered Successfully";
}else{
    echo "Error: " . mysqli_error($conn);
}

}
?>
