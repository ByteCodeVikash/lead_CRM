import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';
import { AlertCircle, Copy } from 'lucide-react';

export default function Duplicates() {
    const [duplicates, setDuplicates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDuplicates();
    }, []);

    const fetchDuplicates = async () => {
        try {
            const response = await api.get('/files/duplicates');
            setDuplicates(response.data.data);
        } catch (error) {
            toast.error('Failed to load duplicates');
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        New: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Hot: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        Warm: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        Cold: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        Won: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        Lost: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Duplicate Leads</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Leads that were detected as duplicates during import/merge
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : duplicates.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No duplicates found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        All your leads are unique!
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    {/* Stats Banner */}
                    <div className="p-6 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
                        <div className="flex items-center space-x-3">
                            <Copy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            <div>
                                <p className="text-lg font-semibold text-orange-900 dark:text-orange-300">
                                    {duplicates.length} Duplicate Leads Found
                                </p>
                                <p className="text-sm text-orange-700 dark:text-orange-400">
                                    These leads have been merged with existing records
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Duplicate Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {duplicates.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {lead.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {lead.company_name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {lead.email || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {lead.contact_number || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                {lead.duplicate_count} {lead.duplicate_count === 1 ? 'duplicate' : 'duplicates'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
