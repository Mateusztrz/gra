<?php
// test-db.php — tymczasowy test połączenia do bazy. USUŃ po użyciu.
$configPath = __DIR__ . '/db-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo 'Brak pliku konfiguracyjnego DB. Skopiuj db-config.php.example do db-config.php i uzupełnij dane.';
    exit;
}
include $configPath; // oczekuje: $dbHost, $dbName, $dbUser, $dbPass

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo 'OK: Połączono z bazą. Wersja serwera: ' . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Błąd połączenia: ' . $e->getMessage();
}

?>
