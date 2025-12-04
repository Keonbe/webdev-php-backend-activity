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

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "User deleted successfully"]);
} else {
    echo json_encode(["message" => "Failed to delete user", "error" => $stmt->error]);
}

$stmt->close();
$conn->close();

?>
