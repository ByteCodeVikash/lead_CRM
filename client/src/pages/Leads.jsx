import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Download,
    Upload,
    Filter,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    X
} from 'lucide-react';
import AddEditLeadModal from '../components/AddEditLeadModal';
import UploadModal from '../components/UploadModal';

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        source: '',
        budget_min: '',
        budget_max: ''
    });
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [sort, setSort] = useState('-createdAt');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, [pagination.page, search, filters, sort]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search,
                sort,
                ...filters
            };

            const response = await api.get('/leads', { params });
            setLeads(response.data.data.leads);
            setPagination(response.data.data.pagination);
        } catch (error) {
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        try {
            await api.delete(`/leads/${id}`);
            toast.success('Lead deleted successfully');
            fetchLeads();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete lead');
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/files/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `leads_${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Leads exported successfully');
        } catch (error) {
            toast.error('Failed to export leads');
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your lead database</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-lg"
                    >
                        <Upload className="w-4 h-4" />
                        <span>Import</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Lead</span>
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search leads by name, email, phone, company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">All</option>
                                <option value="New">New</option>
                                <option value="Hot">Hot</option>
                                <option value="Warm">Warm</option>
                                <option value="Cold">Cold</option>
                                <option value="Won">Won</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
                            <input
                                type="text"
                                value={filters.source}
                                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., Website"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Budget</label>
                            <input
                                type="number"
                                value={filters.budget_min}
                                onChange={(e) => setFilters({ ...filters, budget_min: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Budget</label>
                            <input
                                type="number"
                                value={filters.budget_max}
                                onChange={(e) => setFilters({ ...filters, budget_max: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="10000"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No leads found
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{lead.company_name || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{lead.email || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{lead.contact_number || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {lead.budget ? `$${lead.budget.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingLead(lead);
                                                        setShowAddModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lead._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Page {pagination.page} of {pagination.pages} ({pagination.total} total leads)
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                disabled={pagination.page === 1}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                disabled={pagination.page === pagination.pages}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddModal && (
                <AddEditLeadModal
                    lead={editingLead}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingLead(null);
                    }}
                    onSuccess={() => {
                        fetchLeads();
                        setShowAddModal(false);
                        setEditingLead(null);
                    }}
                />
            )}

            {showUploadModal && (
                <UploadModal
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={fetchLeads}
                />
            )}
        </div>
    );
}
