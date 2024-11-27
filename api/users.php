<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cambia esto al origen de tu frontend


header('Content-Type: application/json');
require 'db.php';



try {
    $stmt = $conn->query("
        SELECT u.*, p.company_name 
        FROM dni u
        LEFT JOIN providers p ON u.Id_Customer = p.id
    ");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error fetching users']);
    http_response_code(500);
}
?>
