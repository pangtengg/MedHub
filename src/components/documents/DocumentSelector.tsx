import React, { useState } from 'react';
import { Search, Filter, FileText, User, Calendar, Eye, Download, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'patient' | 'general';
  patientInfo?: {
    id: string;
    name: string;
    department: string;
  };
  uploadDate: Date;
  size: string;
  status: 'processed' | 'processing' | 'error';
  pages: number;
}

export const DocumentSelector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'patient' | 'general'>('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const documents: Document[] = [
    {
      id: '1',
      name: 'Patient_John_Doe_CardiacReport.pdf',
      type: 'patient',
      patientInfo: { id: 'P12345', name: 'John Doe', department: 'Cardiology' },
      uploadDate: new Date('2024-01-15'),
      size: '2.3 MB',
      status: 'processed',
      pages: 12
    },
    {
      id: '2',
      name: 'Cardiology_Guidelines_2024.pdf',
      type: 'general',
      uploadDate: new Date('2024-01-10'),
      size: '5.8 MB',
      status: 'processed',
      pages: 245
    },
    {
      id: '3',
      name: 'Patient_Jane_Smith_LabResults.pdf',
      type: 'patient',
      patientInfo: { id: 'P12346', name: 'Jane Smith', department: 'Hematology' },
      uploadDate: new Date('2024-01-12'),
      size: '1.2 MB',
      status: 'processed',
      pages: 4
    },
    {
      id: '4',
      name: 'Clinical_Trial_Protocol_CT2024.pdf',
      type: 'general',
      uploadDate: new Date('2024-01-08'),
      size: '3.4 MB',
      status: 'processing',
      pages: 0
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.patientInfo && doc.patientInfo.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Document Library</h2>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {selectedDocuments.length} selected
            </span>
            <button
              onClick={selectAllDocuments}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50"
            >
              {selectedDocuments.length === filteredDocuments.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents or patient names..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Documents</option>
              <option value="patient">Patient Documents</option>
              <option value="general">General Documents</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                selectedDocuments.includes(doc.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleDocumentSelection(doc.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${
                    doc.type === 'patient' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {doc.type === 'patient' ? (
                      <User className={`w-4 h-4 ${doc.type === 'patient' ? 'text-blue-600' : 'text-green-600'}`} />
                    ) : (
                      <FileText className={`w-4 h-4 ${doc.type === 'patient' ? 'text-blue-600' : 'text-green-600'}`} />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => toggleDocumentSelection(doc.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === 'processed' 
                      ? 'bg-green-100 text-green-800'
                      : doc.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{doc.name}</h3>
                {doc.patientInfo && (
                  <div className="text-xs text-blue-600">
                    <p className="font-medium">{doc.patientInfo.name}</p>
                    <p>ID: {doc.patientInfo.id} • {doc.patientInfo.department}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{doc.uploadDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.pages} pages</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center space-x-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                <button 
                  className="px-2 py-1 text-xs text-gray-500 hover:text-blue-600 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-3 h-3" />
                </button>
                <button 
                  className="px-2 py-1 text-xs text-gray-500 hover:text-red-600 rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Documents Actions */}
        {selectedDocuments.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">
                  {selectedDocuments.length} document{selectedDocuments.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-blue-700">
                  Ready to query with AI assistant
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200">
                Start Query Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};