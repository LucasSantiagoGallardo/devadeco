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

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['Dni'])) {
    echo json_encode(['error' => 'Dni is required']);
    http_response_code(400);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE dni 
        SET Name = :Name, 
            Last_Name = :Last_Name, 
            Telefono = :Telefono, 
            Active = :Active, 
            Id_Key = :Id_Key,
            Id_Customer = :Id_Customer
        WHERE Dni = :Dni
    ");
    $stmt->execute([
        ':Dni' => $data['Dni'],
        ':Name' => $data['Name'],
        ':Last_Name' => $data['Last_Name'],
        ':Telefono' => $data['Telefono'] ?? null,
        ':Active' => $data['Active'] ?? 'Yes',
        ':Id_Key' => $data['Id_Key'] ?? null,
        ':Id_Customer' => $data['Id_Customer'] ?? null, // Relación con empresa
    ]);
    echo json_encode(['message' => 'User updated successfully']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error updating user: ' . $e->getMessage()]);
    http_response_code(500);
}
?>
