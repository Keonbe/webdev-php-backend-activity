<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Include DB connection
require_once "../config.php";

// Read JSON
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["message" => "No data received"]);
    exit;
}

$name = $input["name"];
$email = $input["email"];

// Insert into database
$stmt = $conn->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);

if ($stmt->execute()) {
    echo json_encode(["message" => "Data saved successfully"]);
} else {
    // Return DB error for easier debugging while developing.
    // Remove or sanitize this message in production.
    echo json_encode(["message" => "Failed to save data", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
