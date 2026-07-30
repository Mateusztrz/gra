<?php
// test-db.php — tymczasowy test połączenia do bazy. USUŃ po użyciu.
$dbHost = 'sql178.lh.pl';
$dbName = 'serwer401754_bazagra';
$dbUser = 'serwer401754_bazagra';
$dbPass = 'bo&UU-ImTVnI0Pr5';

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
