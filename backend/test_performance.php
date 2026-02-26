<?php

echo "Testing bcrypt performance...\n";

// Test 1: bcrypt hashing (simulating user registration/password change)
$start = microtime(true);
$hash = password_hash('testpassword123', PASSWORD_BCRYPT, ['cost' => 12]);
$time1 = round((microtime(true) - $start) * 1000);
echo "1. Bcrypt hash (cost=12): {$time1}ms\n";

// Test 2: bcrypt verification (simulating login)
$start = microtime(true);
password_verify('testpassword123', $hash);
$time2 = round((microtime(true) - $start) * 1000);
echo "2. Bcrypt verify (cost=12): {$time2}ms\n";

// Test 3: bcrypt with default cost
$start = microtime(true);
$hash = password_hash('testpassword123', PASSWORD_BCRYPT);
$time3 = round((microtime(true) - $start) * 1000);
echo "3. Bcrypt hash (default): {$time3}ms\n";

// Test 4: Lower cost for comparison
$start = microtime(true);
$hash = password_hash('testpassword123', PASSWORD_BCRYPT, ['cost' => 10]);
$time4 = round((microtime(true) - $start) * 1000);
echo "4. Bcrypt hash (cost=10): {$time4}ms\n";

echo "\n";
echo "Total login simulation time: " . ($time2) . "ms\n";
echo "Note: bcrypt is intentionally slow for security.\n";
echo "Typical login times: 50-150ms on modern hardware.\n";
