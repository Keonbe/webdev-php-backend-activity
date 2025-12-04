<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "../config.php";

$input = json_decode(file_get_contents("php://input"), true);
if (!$input || !isset($input['id'])) {
    echo json_encode(["message" => "No data received"]);
    exit;
}

$id = $input['id'];
$name = $input['name'];
$email = $input['email'];

$stmt = $conn->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
$stmt->bind_param("ssi", $name, $email, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Data updated successfully"]);
} else {
    echo json_encode(["message" => "Failed to update data"]);
}

$stmt->close();
$conn->close();

?>
