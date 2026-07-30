<?php
header('Content-Type: application/json');

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (stripos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
} else {
    $input = $_POST;
}

if (!$input || empty($input['email']) || empty($input['elapsedTime'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Niepoprawne dane.']);
    exit;
}

$email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
$elapsedTime = trim($input['elapsedTime']);

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Niepoprawny adres e-mail.']);
    exit;
}

// Wczytaj dane połączenia z zewnętrznego pliku konfiguracyjnego (db-config.php)
$configPath = __DIR__ . '/db-config.php';
if (file_exists($configPath)) {
    include $configPath; // oczekuje: $dbHost, $dbName, $dbUser, $dbPass
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Brak pliku konfiguracyjnego DB. Skopiuj db-config.php.example do db-config.php i uzupełnij dane.']);
    exit;
}

// walidacja zmiennych konfiguracyjnych
if (empty($dbHost) || empty($dbName) || empty($dbUser)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Niepoprawna konfiguracja DB.']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS zapisane_emaile (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            elapsed_time VARCHAR(50) NOT NULL,
            created_at DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $stmt = $pdo->prepare('INSERT INTO zapisane_emaile (email, elapsed_time, created_at) VALUES (:email, :elapsed_time, NOW())');
    $stmt->execute([
        ':email' => $email,
        ':elapsed_time' => $elapsedTime,
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Błąd bazy danych: ' . $e->getMessage()]);
}
