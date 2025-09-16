import React, { useState } from 'react';
import { Search, Filter, FileText, User, Calendar, Eye, Download, Trash2, Archive, Edit3 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'patient' | 'general';
  patientInfo?: {
    id: string;
    name: string;
    department: string;
  };
  uploadedBy: string;
  uploadDate: Date;
  size: string;
  status: 'processed' | 'processing' | 'error' | 'archived';
  pages: number;
  accessLevel: 'public' | 'department' | 'private';
}

export const DocumentRepository: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'patient' | 'general' | 'archived'>('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const documents: Document[] = [
    {
      id: '1',
      name: 'Patient_John_Doe_CardiacReport.pdf',
      type: 'patient',
      patientInfo: { id: 'P12345', name: 'John Doe', department: 'Cardiology' },
      uploadedBy: 'Dr. Sarah Johnson',
      uploadDate: new Date('2024-01-15'),
      size: '2.3 MB',
      status: 'processed',
      pages: 12,
      accessLevel: 'department'
    },
    {
      id: '2',
      name: 'Cardiology_Guidelines_2024.pdf',
      type: 'general',
      uploadedBy: 'Admin Staff',
      uploadDate: new Date('2024-01-10'),
      size: '5.8 MB',
      status: 'processed',
      pages: 245,
      accessLevel: 'public'
    },
    {
      id: '3',
      name: 'Legacy_Archive_Protocol_2023.pdf',
      type: 'general',
      uploadedBy: 'Admin Staff',
      uploadDate: new Date('2023-12-20'),
      size: '3.1 MB',
      status: 'archived',
      pages: 89,
      accessLevel: 'department'
    },
    {
      id: '4',
      name: 'Patient_Jane_Smith_LabResults.pdf',
      type: 'patient',
      patientInfo: { id: 'P12346', name: 'Jane Smith', department: 'Hematology' },
      uploadedBy: 'Dr. Michael Chen',
      uploadDate: new Date('2024-01-12'),
      size: '1.2 MB',
      status: 'processed',
      pages: 4,
      accessLevel: 'private'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.patientInfo && doc.patientInfo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterType === 'patient') matchesFilter = doc.type === 'patient';
    else if (filterType === 'general') matchesFilter = doc.type === 'general';
    else if (filterType === 'archived') matchesFilter = doc.status === 'archived';
    else if (filterType === 'all') matchesFilter = doc.status !== 'archived';
    
    return matchesSearch && matchesFilter;
  });

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const bulkAction = (action: 'archive' | 'delete' | 'public' | 'department') => {
    console.log(`Performing ${action} on documents:`, selectedDocuments);
    setSelectedDocuments([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'public':
        return 'bg-blue-100 text-blue-800';
      case 'department':
        return 'bg-purple-100 text-purple-800';
      case 'private':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Document Repository</h2>
            <p className="text-gray-600 mt-1">Manage all medical documents and access controls</p>
          </div>
          {selectedDocuments.length > 0 && (
            <div className="mt-4 lg:mt-0 flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedDocuments.length} selected
              </span>
              <button
                onClick={() => bulkAction('archive')}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
              >
                Archive
              </button>
              <button
                onClick={() => bulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents, patients, or uploaders..."
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
              <option value="all">All Active Documents</option>
              <option value="patient">Patient Documents</option>
              <option value="general">General Documents</option>
              <option value="archived">Archived Documents</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocuments(filteredDocuments.map(doc => doc.id));
                      } else {
                        setSelectedDocuments([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => toggleDocumentSelection(doc.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-2 rounded-lg ${
                        doc.type === 'patient' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {doc.type === 'patient' ? (
                          <User className={`w-4 h-4 ${doc.type === 'patient' ? 'text-blue-600' : 'text-green-600'}`} />
                        ) : (
                          <FileText className={`w-4 h-4 ${doc.type === 'patient' ? 'text-blue-600' : 'text-green-600'}`} />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doc.size} • {doc.pages} pages
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {doc.uploadDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="capitalize font-medium">{doc.type}</span>
                    </div>
                    {doc.patientInfo && (
                      <div className="text-xs text-blue-600">
                        <div className="font-medium">{doc.patientInfo.name}</div>
                        <div>ID: {doc.patientInfo.id}</div>
                        <div>{doc.patientInfo.department}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doc.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessColor(doc.accessLevel)}`}>
                      {doc.accessLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {doc.status !== 'archived' && (
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};