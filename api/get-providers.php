<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Manejar solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


header('Content-Type: application/json');
require 'db.php';

try {
    $stmt = $conn->query("SELECT * FROM providers");
    $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($providers);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error fetching providers']);
    http_response_code(500);
}
?>
