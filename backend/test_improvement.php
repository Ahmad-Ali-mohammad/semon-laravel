<?php

echo "Testing bcrypt performance with new settings...\n\n";

// Test with cost=10 (new setting)
$start = microtime(true);
$hash = password_hash('testpassword123', PASSWORD_BCRYPT, ['cost' => 10]);
$time1 = round((microtime(true) - $start) * 1000);
echo "1. Bcrypt hash (cost=10): {$time1}ms\n";

$start = microtime(true);
password_verify('testpassword123', $hash);
$time2 = round((microtime(true) - $start) * 1000);
echo "2. Bcrypt verify (cost=10): {$time2}ms ✓\n";

// Compare with old setting
$start = microtime(true);
$hash = password_hash('testpassword123', PASSWORD_BCRYPT, ['cost' => 12]);
$time3 = round((microtime(true) - $start) * 1000);
echo "\n3. Bcrypt hash (cost=12, old): {$time3}ms\n";

$start = microtime(true);
password_verify('testpassword123', $hash);
$time4 = round((microtime(true) - $start) * 1000);
echo "4. Bcrypt verify (cost=12, old): {$time4}ms ✗\n";

$improvement = round((($time4 - $time2) / $time4) * 100);
echo "\n";
echo "═══════════════════════════════════════\n";
echo "Performance Improvement: {$improvement}%\n";
echo "New login time: ~{$time2}ms (vs {$time4}ms)\n";
echo "═══════════════════════════════════════\n";
