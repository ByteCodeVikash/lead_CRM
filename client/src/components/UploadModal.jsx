import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';
import { X, Upload, FileSpreadsheet, Loader, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UploadModal({ onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [uploadType, setUploadType] = useState('import'); // 'import' or 'merge'
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv'
            ];

            if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile);
            } else {
                toast.error('Please select a valid Excel or CSV file');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const endpoint = uploadType === 'merge' ? '/files/merge' : '/files/import';
            const response = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResult(response.data.data);
            toast.success(`${uploadType === 'merge' ? 'Merge' : 'Import'} completed successfully`);
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Upload Leads
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Upload Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Upload Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setUploadType('import')}
                                className={`p-4 rounded-xl border-2 transition-all ${uploadType === 'import'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                    }`}
                            >
                                <Upload className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Import</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add all leads</p>
                            </button>
                            <button
                                onClick={() => setUploadType('merge')}
                                className={`p-4 rounded-xl border-2 transition-all ${uploadType === 'merge'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                    }`}
                            >
                                <FileSpreadsheet className="w-6 h-6 mx-auto mb-2 text-green-500" />
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Merge</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Detect duplicates</p>
                            </button>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select File
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                            >
                                {file ? (
                                    <div className="text-center">
                                        <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Click to upload Excel or CSV
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            Max file size: 10MB
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Upload Result */}
                    {result && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-start space-x-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
                                        {uploadType === 'merge' ? 'Merge Complete' : 'Import Complete'}
                                    </p>
                                    <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                                        {uploadType === 'merge' ? (
                                            <>
                                                <p>✓ New leads: {result.new_leads}</p>
                                                <p>✓ Duplicates found: {result.duplicates}</p>
                                                <p>✓ Updated: {result.updated}</p>
                                                <p>✓ Skipped: {result.skipped}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p>✓ New leads: {result.new_leads}</p>
                                                {result.errors > 0 && <p>⚠ Errors: {result.errors}</p>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        >
                            {result ? 'Close' : 'Cancel'}
                        </button>
                        {!result && (
                            <button
                                onClick={handleUpload}
                                disabled={!file || loading}
                                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        <span>{uploadType === 'merge' ? 'Merge' : 'Import'}</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
