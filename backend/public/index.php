<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require_once $maintenance; // NOSONAR - required bootstrap file
}

// Register the Composer autoloader...
require_once __DIR__.'/../vendor/autoload.php'; // NOSONAR - required bootstrap file

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php'; // NOSONAR - required bootstrap file

$app->handleRequest(Request::capture());
