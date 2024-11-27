<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');
require 'db.php';

// Decodificar el cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['Dni']) || empty($data['Name']) || empty($data['Last_Name'])) {
    echo json_encode(['error' => 'Missing required fields']);
    http_response_code(400);
    exit;
}

try {
    $stmt = $conn->prepare("
        INSERT INTO dni (Dni, Name, Last_Name, Telefono, Active, Id_Key, Id_Customer) 
        VALUES (:Dni, :Name, :Last_Name, :Telefono, :Active, :Id_Key, :Id_Customer)
    ");
    $stmt->execute([
        ':Dni' => $data['Dni'],
        ':Name' => $data['Name'],
        ':Last_Name' => $data['Last_Name'],
        ':Telefono' => $data['Telefono'] ?? null,
        ':Active' => $data['Active'] ?? 'Yes',
        ':Id_Key' => $data['Id_Key'] ?? null,
        ':Id_Customer' => $data['Id_Customer'] ?? null, // Vincular con la empresa
    ]);
    echo json_encode(['message' => 'User created successfully']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error creating user: ' . $e->getMessage()]);
    http_response_code(500);
}
?>
