<?php
$servername = "db";
$username = "user";
$password = "password";
$dbname = "app_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT message FROM messages LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        echo $row["message"];
    }
} else {
    echo "0 results";
}
$conn->close();
?>
