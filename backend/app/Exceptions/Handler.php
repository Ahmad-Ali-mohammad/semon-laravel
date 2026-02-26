<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // API requests should return JSON
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * Handle API exceptions and return consistent JSON responses.
     */
    protected function handleApiException(Request $request, Throwable $exception): JsonResponse
    {
        $status = 500;
        $message = 'Internal Server Error';
        $errors = null;

        // Handle specific exception types
        switch (true) {
            case $exception instanceof ValidationException:
                $status = 422;
                $message = 'Validation failed';
                $errors = $exception->errors();
                break;

            case $exception instanceof AuthenticationException:
                $status = 401;
                $message = 'Unauthenticated';
                break;

            case $exception instanceof TokenMismatchException:
                $status = 419;
                $message = 'CSRF token mismatch. Please refresh the page and try again.';
                break;

            case $exception instanceof ModelNotFoundException:
            case $exception instanceof NotFoundHttpException:
                $status = 404;
                $message = 'Resource not found';
                break;
        }

        // Add debug information in development
        $debug = null;
        if (app()->environment('local', 'testing')) {
            $debug = [
                'exception' => get_class($exception),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTrace(),
            ];
        }

        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'debug' => $debug,
            'timestamp' => now()->toISOString(),
        ], $status);
    }
}
