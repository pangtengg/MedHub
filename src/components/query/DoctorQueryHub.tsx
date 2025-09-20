import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mic, 
  Send, 
  FileText, 
  User, 
  AlertTriangle, 
  Copy, 
  Download, 
  Plus,
  Search,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  X,
  Upload,
  FolderOpen
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  references?: {
    document: string;
    page: number;
    excerpt: string;
  }[];
  alerts?: {
    type: 'allergy' | 'condition' | 'medication';
    message: string;
  }[];
}

interface Document {
  id: string;
  name: string;
  type: 'patient' | 'general';
  patientInfo?: {
    id: string;
    name: string;
    department?: string;
  };
  uploadDate: Date;
  size: string;
  status: 'processed' | 'processing' | 'error';
  pages: number;
  selected: boolean;
}

export const DoctorQueryHub: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your medical document assistant. I can help you search through patient records, medical literature, and clinical documents. Upload documents using the + button in the sidebar, then select them to start querying. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadType, setUploadType] = useState<'patient' | 'general'>('patient');
  const [patientInfo, setPatientInfo] = useState({ id: '', name: '', department: '' });
  const [dragActive, setDragActive] = useState(false);

  const querySuggestions = [
    {
      category: 'Cardiology',
      suggestions: [
        'What are the patient\'s cardiac risk factors?',
        'Analyze the echocardiogram results',
        'Review medication compliance for heart conditions',
        'What is the recommended treatment plan?',
        'Assess coronary artery disease progression'
      ]
    },
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
  };

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Patient_John_Doe_CardiacReport.pdf',
      type: 'patient',
      patientInfo: { id: 'P12345', name: 'John Doe', department: 'Cardiology' },
      uploadDate: new Date('2024-01-15'),
      size: '2.3 MB',
      status: 'processed',
      pages: 12,
      selected: true
    },
    {
      id: '2',
      name: 'Cardiology_Guidelines_2024.pdf',
      type: 'general',
      uploadDate: new Date('2024-01-10'),
      size: '5.8 MB',
      status: 'processed',
      pages: 245,
      selected: true
    },
    {
      id: '3',
      name: 'Patient_Jane_Smith_LabResults.pdf',
      type: 'patient',
      patientInfo: { id: 'P12346', name: 'Jane Smith', department: 'Hematology' },
      uploadDate: new Date('2024-01-12'),
      size: '1.2 MB',
      status: 'processed',
      pages: 4,
      selected: false
    }
  ]);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.patientInfo && doc.patientInfo.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedDocuments = documents.filter(doc => doc.selected);

  const handleSendMessage = () => { 
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response with hardcoded responses
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        references: [
          {
            document: 'Patient_John_Doe_CardiacReport.pdf',
            page: 3,
            excerpt: 'Patient shows signs of mild coronary artery disease with 40% stenosis in LAD...'
          },
          {
            document: 'Cardiology_Guidelines_2024.pdf',
            page: 127,
            excerpt: 'For patients with moderate stenosis (40-70%), medical management is recommended...'
          }
        ],
        alerts: [
          {
            type: 'condition',
            message: 'Patient has history of hypertension requiring monitoring'
          }
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  }; 

  const generateAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // More specific and contextual responses based on the actual query
    if (lowerQuery.includes('analyze') && lowerQuery.includes('echocardiogram')) {
      return "Based on the echocardiogram results for John Doe (Patient ID: P12345), the patient shows normal left ventricular function with an ejection fraction of 55%. The left atrium is mildly enlarged, and there is mild mitral regurgitation. The right ventricle appears normal in size and function. These findings are consistent with mild cardiac changes and do not indicate significant heart failure.";
    }
    
    if (lowerQuery.includes('review') && lowerQuery.includes('medication compliance')) {
      return "Reviewing medication compliance for heart conditions: The patient is currently prescribed Lisinopril 10mg daily and Metoprolol 50mg twice daily. Based on recent pharmacy records and patient reports, adherence appears to be good with no missed doses in the past 30 days. The patient reports taking medications as prescribed and has not experienced any adverse effects.";
    }
    
    if (lowerQuery.includes('recommended treatment plan')) {
      return "The recommended treatment plan for this patient includes: 1) Continue current ACE inhibitor (Lisinopril) and beta-blocker (Metoprolol) therapy, 2) Maintain statin therapy for cholesterol management, 3) Regular exercise program as tolerated, 4) Low-sodium diet, 5) Follow-up in 3 months for reassessment, 6) Annual echocardiogram to monitor cardiac function. This plan aligns with current AHA/ACC guidelines for coronary artery disease management.";
    }
    
    if (lowerQuery.includes('cardiac risk factors')) {
      return "The patient's cardiac risk factors include: 1) Age (65 years old), 2) History of hypertension, 3) Family history of coronary artery disease, 4) Previous smoking history (quit 5 years ago), 5) Elevated cholesterol levels (now controlled with statin therapy). The patient has a moderate cardiovascular risk profile that requires ongoing monitoring and lifestyle management.";
    }
    
    if (lowerQuery.includes('diabetes') || lowerQuery.includes('glucose') || lowerQuery.includes('insulin')) {
      return "I don't see any diabetes-related information in the current patient records. The available documents focus on cardiac conditions. If you have diabetes-specific documents uploaded, please ensure they are selected for querying, or upload additional diabetes-related medical records for analysis.";
    }
    
    if (lowerQuery.includes('blood pressure') || lowerQuery.includes('hypertension')) {
      return "The patient has a history of hypertension that is currently well-controlled. Recent blood pressure readings average 128/82 mmHg, which is within the target range for this patient's age and risk profile. The current antihypertensive regimen with Lisinopril appears to be effective, and no adjustments are needed at this time.";
    }
    
    if (lowerQuery.includes('medication') || lowerQuery.includes('drug') || lowerQuery.includes('prescription')) {
      return "Current medications for this patient include: 1) Lisinopril 10mg daily (ACE inhibitor for blood pressure and heart protection), 2) Metoprolol 50mg twice daily (beta-blocker for heart rate control), 3) Atorvastatin 20mg daily (statin for cholesterol management). No drug interactions are identified, and all medications are within therapeutic ranges.";
    }
    
    if (lowerQuery.includes('allergy') || lowerQuery.includes('allergic')) {
      return "The patient has documented allergies to Penicillin and Sulfa drugs. These allergies are clearly noted in the medical records and should be communicated to all healthcare providers. Current medications (Lisinopril, Metoprolol, Atorvastatin) do not contain these allergens and are safe for this patient.";
    }
    
    if (lowerQuery.includes('lab') || lowerQuery.includes('blood test') || lowerQuery.includes('laboratory')) {
      return "Recent laboratory results show: Complete Blood Count - within normal limits, Basic Metabolic Panel - normal kidney function, Lipid Panel - LDL 85 mg/dL (well-controlled), Liver Function Tests - normal. All values are within expected ranges for the patient's age and medical conditions.";
    }
    
    if (lowerQuery.includes('surgery') || lowerQuery.includes('procedure') || lowerQuery.includes('operation')) {
      return "The patient has no recent surgical history. Previous procedures include routine colonoscopy (2 years ago) and cataract surgery (3 years ago), both completed successfully without complications. No current surgical interventions are planned or recommended.";
    }
    
    if (lowerQuery.includes('pain') || lowerQuery.includes('discomfort') || lowerQuery.includes('ache')) {
      return "The patient reports occasional mild chest discomfort that is well-controlled with current medication regimen. No acute pain management is needed at this time. The patient should continue current treatment and report any new or worsening symptoms immediately.";
    }
    
    if (lowerQuery.includes('summarize') || lowerQuery.includes('medical history')) {
      return "Medical History Summary for John Doe (Patient ID: P12345): 65-year-old male with coronary artery disease, hypertension, and hyperlipidemia. Current medications include Lisinopril, Metoprolol, and Atorvastatin. No known drug allergies except Penicillin and Sulfa. Recent echocardiogram shows normal left ventricular function. Patient is stable and following recommended treatment plan.";
    }
    
    if (lowerQuery.includes('current medications')) {
      return "Current medications for this patient: 1) Lisinopril 10mg daily - ACE inhibitor for blood pressure control and heart protection, 2) Metoprolol 50mg twice daily - beta-blocker for heart rate control and blood pressure, 3) Atorvastatin 20mg daily - statin for cholesterol management. All medications are being taken as prescribed with good adherence.";
    }
    
    if (lowerQuery.includes('recent lab results')) {
      return "Recent lab results (within last 3 months): Complete Blood Count - normal, Basic Metabolic Panel - normal kidney and liver function, Lipid Panel - Total cholesterol 180 mg/dL, LDL 85 mg/dL, HDL 45 mg/dL, Triglycerides 120 mg/dL. All values are within target ranges for cardiovascular risk management.";
    }
    
    if (lowerQuery.includes('drug interactions')) {
      return "Drug interaction analysis: No significant drug interactions identified between current medications (Lisinopril, Metoprolol, Atorvastatin). All medications are compatible and can be safely taken together. Regular monitoring of kidney function and liver enzymes is recommended due to multiple medications.";
    }
    
    if (lowerQuery.includes('assess') && lowerQuery.includes('overall health status')) {
      return "Overall health status assessment: The patient is in stable condition with well-managed chronic conditions. Cardiovascular risk is moderate and controlled with current medications. No acute concerns identified. Regular monitoring and lifestyle modifications are recommended to maintain current health status.";
    }
    
    // Default response for unrecognized queries
    return `I understand you're asking about "${query}". Based on the available medical records for John Doe (Patient ID: P12345), I can see information about cardiac conditions, hypertension, and cholesterol management. However, I may need more specific information or additional documents to provide a comprehensive answer. Could you please clarify your question or ensure the relevant documents are selected for analysis?`;
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
  };

  const toggleDocumentSelection = (docId: string) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === docId ? { ...doc, selected: !doc.selected } : doc
    ));
  };

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

  const handleFiles = (files: FileList) => {
    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: uploadType,
      patientInfo: uploadType === 'patient' ? { ...patientInfo } : undefined,
      uploadDate: new Date(),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'processing',
      pages: 0,
      selected: false
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
    setShowUpload(false);

    // Simulate processing
    newDocuments.forEach(doc => {
      setTimeout(() => {
        setDocuments(prev => prev.map(d =>
          d.id === doc.id ? { ...d, status: 'processed', pages: Math.floor(Math.random() * 50) + 1 } : d
        ));
      }, 3000);
    });
  };

  const handleDocumentAction = (docId: string, action: 'view' | 'edit' | 'remove') => {
    switch (action) {
      case 'view':
        console.log('Viewing document:', docId);
        break;
      case 'edit':
        console.log('Editing document:', docId);
        break;
      case 'remove':
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
        break;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Left Sidebar - Documents (30% width) */}
      <div className="w-full lg:w-[30%] bg-white border-r border-gray-200 flex flex-col h-screen lg:h-auto">
        {/* Documents Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
            <button
              onClick={() => setShowUpload(true)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Documents */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Selected Documents Summary */}
        {selectedDocuments.length > 0 && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <p className="text-sm font-medium text-blue-900">
              {selectedDocuments.length} document{selectedDocuments.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-sm text-blue-700">Ready for AI queries</p>
          </div>
        )}

        {/* Documents List */}
        <div className="flex-1 overflow-y-auto p-4 pb-6 min-h-0">
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-sm ${
                  doc.selected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Document Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={doc.selected}
                      onChange={() => toggleDocumentSelection(doc.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className={`p-2 rounded-lg ${
                      doc.type === 'patient' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {doc.type === 'patient' ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    doc.status === 'processed' 
                      ? 'bg-green-100 text-green-800'
                      : doc.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                {/* Document Info */}
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{doc.name}</h3>
                  {doc.patientInfo && (
                    <div className="text-xs text-blue-600 mb-1">
                      <p className="font-medium">{doc.patientInfo.name}</p>
                      <p>ID: {doc.patientInfo.id}</p>
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-500 space-x-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{doc.uploadDate.toLocaleDateString()}</span>
                    </div>
                    <span>{doc.size}</span>
                    <span>{doc.pages} pages</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDocumentAction(doc.id, 'view')}
                    className="flex-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDocumentAction(doc.id, 'edit')}
                    className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDocumentAction(doc.id, 'remove')}
                    className="flex-1 px-3 py-2 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Interface (70% width) */}
      <div className="w-full lg:w-[70%] flex flex-col h-screen lg:h-auto relative">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Medical Query Assistant</h1>
                <p className="text-sm text-gray-600">Ask questions about your selected documents</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Copy className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Persistent Allergy Alert */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 flex-shrink-0">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Patient Allergy Alert
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="font-semibold">Known Allergies:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Penicillin - Severe allergic reaction (documented 2023-08-15)</li>
                  <li>Sulfa drugs - Skin rash and respiratory symptoms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 pb-32">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-4xl ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-lg p-4 shadow-sm`}>
                  <p className="mb-2 text-gray-900">{message.content}</p>

                  {/* References */}
                  {message.references && message.references.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">References:</p>
                      <div className="space-y-2">
                        {message.references.map((ref, index) => (
                          <details key={index} className="group">
                            <summary className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                              {ref.document} (Page {ref.page})
                            </summary>
                            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
                              "{ref.excerpt}"
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-3">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {/* Query Suggestions - Floating Bars */}
            {showSuggestions && messages.length <= 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">Quick Query Suggestions</h4>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Hide
                  </button>
                </div>
                
                {querySuggestions.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-blue-800 mb-3 uppercase tracking-wide">
                      {category.category}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {category.suggestions.map((suggestion, suggestionIndex) => (
                        <button
                          key={suggestionIndex}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-2 text-xs bg-white text-blue-700 border border-blue-300 rounded-full hover:bg-blue-100 hover:border-blue-400 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Input at Bottom - Fixed */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about patient conditions, medications, treatment plans..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            {!showSuggestions && (
              <button
                onClick={() => setShowSuggestions(true)}
                className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Show suggestions"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            )}
            <button
              onClick={handleVoiceInput}
              className={`p-3 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Upload Medical Documents</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

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
                <h4 className="font-medium text-blue-900 mb-3">Patient Information</h4>
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
        </div>
      )}
    </div>
  );
};