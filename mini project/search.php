<?php
$conn = mysqli_connect("localhost","root","","donor");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Search Donor</title>
</head>
<body>

<h2>Find Blood Donor</h2>

<form method="GET">

<select name="blood_group" required>
  <option value="">Blood Group</option>
  <option value="A+">A+</option>
  <option value="B+">B+</option>
  <option value="O+">O+</option>
  <option value="AB+">AB+</option>
  <option value="A-">A-</option> 
  <option value="B-">B-</option>
  <option value="o-">O-</option>
  <option value="AB-">AB-</option>
</select>

<input type="text" name="city" placeholder="City" required>

<button type="submit">Search</button>

</form>

<hr>

<?php

if(isset($_GET['blood_group']) && isset($_GET['city'])){

$blood = $_GET['blood_group'];
$city = $_GET['city'];

$sql = "SELECT * FROM donor 
        WHERE blood_group='$blood' 
        AND city LIKE '%$city%'";

$result = mysqli_query($conn,$sql);

if(mysqli_num_rows($result) > 0){

    echo "<h3>Available Donors:</h3>";
   

    while($row = mysqli_fetch_assoc($result)){
       echo "<div style='background:#1e1e2f; color:white; border-radius:10px; padding:15px; margin:15px; box-shadow:0 0 10px rgba(0,0,0,0.5);'>";
        echo "Name: ".$row['name']."<br>";
        echo "Age: ".$row['age']."<br>";
        echo "Blood: ".$row['blood_group']."<br>";
        echo "City: ".$row['city']."<br>";
        echo "Phone: ".$row['phone']."<br>";
        echo "</div>";
        
    }

} else {
    echo "No donors found 😢";
}

}

?>

</body>
</html>