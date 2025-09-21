import React, { useState } from 'react';
import { Upload, FileText, User, FolderOpen, AlertCircle, CheckCircle, X } from 'lucide-react';
import { uploadFile } from "../../service/api/upload";

interface Document {
  id: string;
  name: string;
  type: 'patient' | 'general';
  patientInfo?: {
    id: string;
    name: string;
    department?: string;
  };
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
}

export const DocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadType, setUploadType] = useState<'patient' | 'general'>('patient');
  const [patientInfo, setPatientInfo] = useState({ id: '', name: '', department: '' });
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

const handleFiles = async (files: FileList) => {
  const fileArray = Array.from(files);
  
  for (const file of fileArray) {
    const newDoc: Document = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: uploadType,
      patientInfo: uploadType === "patient" ? { ...patientInfo } : undefined,
      status: "uploading",
      progress: 0,
    };

    setDocuments((prev) => [...prev, newDoc]);

    try {
      await uploadFile(
        file,
        uploadType,
        uploadType === "patient" ? patientInfo : undefined,
        (progress) => {
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === newDoc.id ? { ...doc, progress: progress.percentage } : doc
            )
          );
        }
      );

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === newDoc.id ? { ...doc, status: "processing" } : doc
        )
      );
    } catch (error) {
      console.error("Upload failed", error);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === newDoc.id ? { ...doc, status: "error" } : doc
        )
      );
    }
  }
};

  // const simulateUpload = (docId: string) => {
  //   const updateProgress = (progress: number) => {
  //     setDocuments(prev => prev.map(doc => 
  //       doc.id === docId ? { ...doc, progress } : doc
  //     ));
  //   };

  //   const updateStatus = (status: Document['status']) => {
  //     setDocuments(prev => prev.map(doc => 
  //       doc.id === docId ? { ...doc, status } : doc
  //     ));
  //   };

  //   let progress = 0;
  //   const interval = setInterval(() => {
  //     progress += Math.random() * 30;
  //     if (progress >= 100) {
  //       progress = 100;
  //       updateProgress(progress);
  //       updateStatus('processing');
  //       clearInterval(interval);
        
  //       // Simulate processing
  //       setTimeout(() => {
  //         updateStatus(Math.random() > 0.1 ? 'completed' : 'error');
  //       }, 2000);
  //     } else {
  //       updateProgress(progress);
  //     }
  //   }, 500);
  // };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Medical Documents</h2>
        
        {/* Upload Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Document Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUploadType('patient')}
              className={`p-4 rounded-lg border-2 flex items-center space-x-3 transition-all ${
                uploadType === 'patient'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <User className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Patient Document</div>
                <div className="text-sm opacity-70">Linked to specific patient</div>
              </div>
            </button>
            <button
              onClick={() => setUploadType('general')}
              className={`p-4 rounded-lg border-2 flex items-center space-x-3 transition-all ${
                uploadType === 'general'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <FolderOpen className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">General Medical Document</div>
                <div className="text-sm opacity-70">Guidelines, research, protocols</div>
              </div>
            </button>
          </div>
        </div>

        {/* Patient Info (if patient document) */}
        {uploadType === 'patient' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-3">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Patient ID</label>
                <input
                  type="text"
                  value={patientInfo.id}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="P12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">Department</label>
                <input
                  type="text"
                  value={patientInfo.department}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cardiology"
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Click to upload files
              </span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">PDF files only, up to 10MB each</p>
        </div>
      </div>

      {/* Upload Progress */}
      {documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Progress</h3>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {doc.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : doc.status === 'error' ? (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <FileText className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {doc.type === 'patient' && doc.patientInfo && (
                    <p className="text-xs text-blue-600">
                      Patient: {doc.patientInfo.name} ({doc.patientInfo.id})
                    </p>
                  )}
                  
                  <div className="mt-2">
                    {doc.status === 'uploading' || doc.status === 'processing' ? (
                      <div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${doc.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.status === 'uploading' ? 'Uploading...' : 'Processing with OCR...'}
                        </p>
                      </div>
                    ) : doc.status === 'completed' ? (
                      <p className="text-xs text-green-600">Upload completed</p>
                    ) : (
                      <p className="text-xs text-red-600">Upload failed</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};