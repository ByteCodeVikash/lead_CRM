import { useState, useEffect } from 'react';
import api from '../utils/api';
import { TrendingUp, Users, Flame, Snowflake, Trophy, XCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/leads/stats/dashboard');
            setStats(response.data.data);
        } catch (error) {
            toast.error('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Leads', value: stats?.total || 0, icon: Users, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
        { label: 'New Leads', value: stats?.new || 0, icon: Sparkles, color: 'green', gradient: 'from-green-500 to-emerald-500' },
        { label: 'Hot Leads', value: stats?.hot || 0, icon: Flame, color: 'red', gradient: 'from-red-500 to-orange-500' },
        { label: 'Warm Leads', value: stats?.warm || 0, icon: TrendingUp, color: 'yellow', gradient: 'from-yellow-500 to-amber-500' },
        { label: 'Cold Leads', value: stats?.cold || 0, icon: Snowflake, color: 'indigo', gradient: 'from-indigo-500 to-purple-500' },
        { label: 'Won', value: stats?.won || 0, icon: Trophy, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your lead management</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section (Placeholder - can add charts library later) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Leads by Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(stats?.byStatus || {}).map(([status, count]) => (
                        <div key={status} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
