
import React from 'react';
import StatsOverviewWidget from './widgets/StatsOverviewWidget';
import RecentOrdersWidget from './widgets/RecentOrdersWidget';
import TopProductsWidget from './widgets/TopProductsWidget';

const AdminDashboardPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                    <StatsOverviewWidget />
                </div>
                <div className="lg:col-span-2">
                    <RecentOrdersWidget />
                </div>
                <div>
                    <TopProductsWidget />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
