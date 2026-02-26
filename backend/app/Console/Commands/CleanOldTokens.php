<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanOldTokens extends Command
{
    protected $signature = 'tokens:clean {--days=30 : Delete tokens older than this many days}';
    protected $description = 'Clean up old personal access tokens to improve performance';

    public function handle()
    {
        $days = (int) $this->option('days');
        
        $deleted = DB::table('personal_access_tokens')
            ->where('created_at', '<', now()->subDays($days))
            ->orWhere(function($query) use ($days) {
                $query->whereNotNull('last_used_at')
                      ->where('last_used_at', '<', now()->subDays($days));
            })
            ->delete();

        $this->info("Deleted {$deleted} old tokens (older than {$days} days).");
        
        return 0;
    }
}
