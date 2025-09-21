import React, { useState } from 'react';
import { uploadFile, UploadProgress } from '../../service/api/upload';

export const UploadTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      addLog(`File selected: ${file.name} (${file.size} bytes, ${file.type})`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      addLog('❌ No file selected');
      return;
    }

    setUploadStatus('Uploading...');
    setUploadProgress(null);
    addLog('🚀 Starting upload...');

    try {
      const fileKey = await uploadFile(selectedFile, (progress) => {
        setUploadProgress(progress);
        addLog(`📊 Progress: ${progress.percentage}% (${progress.loaded}/${progress.total} bytes)`);
      });

      setUploadStatus('✅ Upload successful!');
      addLog(`🎉 Upload completed! File key: ${fileKey}`);
    } catch (error) {
      setUploadStatus('❌ Upload failed');
      addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Upload error:', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">S3 Upload Test</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a file to upload:
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Selected File:</h3>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {selectedFile.type}</p>
            <p><strong>Last Modified:</strong> {new Date(selectedFile.lastModified).toLocaleString()}</p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === 'Uploading...'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadStatus === 'Uploading...' ? 'Uploading...' : 'Upload to S3'}
          </button>
          
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>

        {uploadProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Upload Progress</span>
              <span>{uploadProgress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {uploadProgress.loaded.toLocaleString()} / {uploadProgress.total.toLocaleString()} bytes
            </p>
          </div>
        )}

        {uploadStatus && (
          <div className={`mt-4 p-3 rounded-lg ${
            uploadStatus.includes('✅') ? 'bg-green-100 text-green-800' : 
            uploadStatus.includes('❌') ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {uploadStatus}
          </div>
        )}
      </div>

      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-medium">Debug Logs</h3>
          <span className="text-gray-400 text-xs">{logs.length} entries</span>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Select a file and try uploading.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
