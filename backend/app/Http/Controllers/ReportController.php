<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Supply;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'type' => 'nullable|string|in:sales,products,customers,orders,inventory,financial,marketing,performance',
            'start' => 'nullable|date',
            'end' => 'nullable|date',
        ]);

        $type = $data['type'] ?? 'sales';
        [$start, $end] = $this->resolveRange($data['start'] ?? null, $data['end'] ?? null);

        $report = match ($type) {
            'products' => $this->productsReport($start, $end),
            'customers' => $this->customersReport($start, $end),
            'orders' => $this->ordersReport($start, $end),
            'inventory' => $this->inventoryReport($start, $end),
            'financial' => $this->financialReport($start, $end),
            'marketing' => $this->marketingReport($start, $end),
            'performance' => $this->performanceReport(),
            default => $this->salesReport($start, $end),
        };

        return response()->json([
            'type' => $type,
            'start' => $start->toDateString(),
            'end' => $end->toDateString(),
            'data' => $report,
        ]);
    }

    private function resolveRange(?string $start, ?string $end): array
    {
        $endDate = $end ? Carbon::parse($end)->endOfDay() : Carbon::now()->endOfDay();
        $startDate = $start ? Carbon::parse($start)->startOfDay() : Carbon::now()->subDays(30)->startOfDay();

        if ($startDate->greaterThan($endDate)) {
            $tmp = $startDate;
            $startDate = $endDate->copy()->subDays(30)->startOfDay();
            $endDate = $tmp->endOfDay();
        }

        return [$startDate, $endDate];
    }

    private function salesReport(Carbon $start, Carbon $end): array
    {
        $rows = Order::whereBetween('created_at', [$start, $end])
            ->selectRaw('DATE(created_at) as date, SUM(total) as sales, COUNT(*) as orders, COUNT(DISTINCT user_id) as customers')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $rows->map(function ($row) {
            return [
                'date' => $row->date,
                'sales' => (float) $row->sales,
                'orders' => (int) $row->orders,
                'customers' => (int) $row->customers,
            ];
        })->toArray();
    }

    private function productsReport(Carbon $start, Carbon $end): array
    {
        $sales = OrderItem::whereNotNull('product_id')
            ->whereHas('order', function ($query) use ($start, $end) {
                $query->whereBetween('created_at', [$start, $end]);
            })
            ->selectRaw('product_id, SUM(quantity) as sold, SUM(quantity * price) as revenue')
            ->groupBy('product_id')
            ->orderByDesc('sold')
            ->limit(10)
            ->get()
            ->keyBy('product_id');

        $productIds = $sales->keys()->all();

        if (empty($productIds)) {
            $products = Product::orderByDesc('id')->limit(10)->get();
        } else {
            $products = Product::whereIn('id', $productIds)->get();
        }

        return $products->map(function (Product $product) use ($sales) {
            $entry = $sales->get($product->id);
            $sold = $entry ? (int) $entry->sold : 0;
            $stock = $product->is_available ? max(1, min(30, 10 + (int) floor($sold / 2))) : 0;

            return [
                'name' => $product->name,
                'sold' => $sold,
                'revenue' => $entry ? (float) $entry->revenue : 0.0,
                'stock' => $stock,
            ];
        })->values()->toArray();
    }

    private function customersReport(Carbon $start, Carbon $end): array
    {
        $rows = Order::with('user')
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('user_id, COUNT(*) as orders, SUM(total) as total_spent, MAX(created_at) as last_order')
            ->groupBy('user_id')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get();

        return $rows->map(function ($row) {
            return [
                'name' => $row->user?->name ?? 'Unknown',
                'orders' => (int) $row->orders,
                'totalSpent' => (float) $row->total_spent,
                'lastOrder' => $row->last_order ? Carbon::parse($row->last_order)->toDateString() : null,
                'joined' => $row->user?->created_at ? $row->user->created_at->toDateString() : null,
            ];
        })->toArray();
    }

    private function ordersReport(Carbon $start, Carbon $end): array
    {
        $orders = Order::with(['user', 'items'])
            ->whereBetween('created_at', [$start, $end])
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return $orders->map(function (Order $order) {
            return [
                'id' => $order->id,
                'customer' => $order->user?->name ?? $order->user?->email ?? 'Guest',
                'date' => optional($order->created_at)->toDateString(),
                'total' => (float) $order->total,
                'status' => $this->mapOrderStatus($order->status),
                'items' => (int) $order->items->sum('quantity'),
            ];
        })->toArray();
    }

    private function inventoryReport(Carbon $start, Carbon $end): array
    {
        $productSales = OrderItem::whereNotNull('product_id')
            ->whereHas('order', function ($query) use ($start, $end) {
                $query->whereBetween('created_at', [$start, $end]);
            })
            ->selectRaw('product_id, SUM(quantity) as sold')
            ->groupBy('product_id')
            ->get()
            ->keyBy('product_id');

        $supplySales = OrderItem::whereNotNull('supply_id')
            ->whereHas('order', function ($query) use ($start, $end) {
                $query->whereBetween('created_at', [$start, $end]);
            })
            ->selectRaw('supply_id, SUM(quantity) as sold')
            ->groupBy('supply_id')
            ->get()
            ->keyBy('supply_id');

        $products = Product::orderByDesc('id')->limit(20)->get()->map(function (Product $product) use ($productSales) {
            $sold = $productSales->get($product->id)?->sold ?? 0;
            $stock = $product->is_available ? max(1, min(30, 10 + (int) floor($sold / 2))) : 0;
            $minStock = 5;
            $maxStock = 20;

            return [
                'name' => $product->name,
                'category' => $product->category,
                'stock' => $stock,
                'minStock' => $minStock,
                'maxStock' => $maxStock,
                'value' => (float) $product->price * $stock,
                'turnover' => $stock > 0 ? round(((float) $sold) / $stock, 1) : 0.0,
            ];
        });

        $supplies = Supply::orderByDesc('id')->limit(10)->get()->map(function (Supply $supply) use ($supplySales) {
            $sold = $supplySales->get($supply->id)?->sold ?? 0;
            $stock = $supply->is_available ? max(1, min(30, 8 + (int) floor($sold / 2))) : 0;
            $minStock = 4;
            $maxStock = 18;

            return [
                'name' => $supply->name,
                'category' => $supply->category,
                'stock' => $stock,
                'minStock' => $minStock,
                'maxStock' => $maxStock,
                'value' => (float) $supply->price * $stock,
                'turnover' => $stock > 0 ? round(((float) $sold) / $stock, 1) : 0.0,
            ];
        });

        return $products->merge($supplies)->values()->toArray();
    }

    private function financialReport(Carbon $start, Carbon $end): array
    {
        $rows = Order::whereBetween('created_at', [$start, $end])
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as ym, SUM(total) as revenue, COUNT(*) as orders")
            ->groupBy('ym')
            ->orderBy('ym')
            ->get()
            ->keyBy('ym');

        $months = [];
        $cursor = $start->copy()->startOfMonth();
        $last = $end->copy()->startOfMonth();

        while ($cursor->lessThanOrEqualTo($last)) {
            $key = $cursor->format('Y-m');
            $row = $rows->get($key);
            $revenue = $row ? (float) $row->revenue : 0.0;
            $orders = $row ? (int) $row->orders : 0;
            $expenses = $revenue > 0 ? round($revenue * 0.4, 2) : 0.0;
            $profit = $revenue - $expenses;

            $months[] = [
                'month' => $this->formatMonthName($cursor),
                'revenue' => $revenue,
                'expenses' => $expenses,
                'profit' => $profit,
                'orders' => $orders,
            ];

            $cursor->addMonth();
        }

        return $months;
    }

    private function marketingReport(Carbon $start, Carbon $end): array
    {
        $totalOrders = (int) Order::whereBetween('created_at', [$start, $end])->count();
        $channels = [
            ['label' => 'Website', 'rate' => 3.0, 'share' => 0.4, 'cost_per' => 4.5],
            ['label' => 'Facebook', 'rate' => 2.5, 'share' => 0.2, 'cost_per' => 4.0],
            ['label' => 'Instagram', 'rate' => 2.8, 'share' => 0.2, 'cost_per' => 4.2],
            ['label' => 'Google', 'rate' => 3.8, 'share' => 0.15, 'cost_per' => 5.5],
            ['label' => 'Referrals', 'rate' => 4.5, 'share' => 0.05, 'cost_per' => 2.0],
        ];

        return collect($channels)->map(function ($channel) use ($totalOrders) {
            $conversions = (int) max(0, round($totalOrders * $channel['share']));
            $rate = (float) $channel['rate'];
            $visitors = $rate > 0 ? (int) round($conversions / ($rate / 100)) : 0;
            $cost = (float) round($conversions * $channel['cost_per'], 2);

            return [
                'channel' => $channel['label'],
                'visitors' => $visitors,
                'conversions' => $conversions,
                'rate' => $rate,
                'cost' => $cost,
            ];
        })->toArray();
    }

    private function performanceReport(): array
    {
        return [
            ['metric' => 'Site speed', 'current' => 2.3, 'target' => 2.0, 'unit' => 's', 'status' => 'good'],
            ['metric' => 'Load time', 'current' => 1.8, 'target' => 2.0, 'unit' => 's', 'status' => 'excellent'],
            ['metric' => 'Bounce rate', 'current' => 35, 'target' => 40, 'unit' => '%', 'status' => 'good'],
            ['metric' => 'Page time', 'current' => 3.2, 'target' => 3.0, 'unit' => 's', 'status' => 'warning'],
            ['metric' => 'Service uptime', 'current' => 99.5, 'target' => 99.0, 'unit' => '%', 'status' => 'excellent'],
        ];
    }

    private function mapOrderStatus(string $status): string
    {
        $normalized = strtolower($status);

        return match ($normalized) {
            'confirmed',
            'completed',
            'processing',
            'shipped',
            'delivered',
            'pending' => $normalized,
            default => $status,
        };
    }

    private function formatMonthName(Carbon $date): string
    {
        try {
            return $date->locale('ar')->translatedFormat('F');
        } catch (\Throwable $e) {
            return $date->format('M');
        }
    }
}
