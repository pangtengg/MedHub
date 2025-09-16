import React, { useState } from 'react';
import { MessageSquare, Mic, Send, FileText, User, AlertTriangle, Copy, Download } from 'lucide-react';

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

interface SelectedDocument {
  id: string;
  name: string;
  type: 'patient' | 'general';
  patientInfo?: {
    id: string;
    name: string;
  };
}

export const QueryHub: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your medical document assistant. I can help you search through patient records, medical literature, and clinical documents. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocument[]>([
    {
      id: '1',
      name: 'Patient_John_Doe_CardiacReport.pdf',
      type: 'patient',
      patientInfo: { id: 'P12345', name: 'John Doe' }
    },
    {
      id: '2',
      name: 'Cardiology_Guidelines_2024.pdf',
      type: 'general'
    }
  ]);
  const [queryScope, setQueryScope] = useState<'patient' | 'general' | 'both'>('both');

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

    // Simulate AI response
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
        alerts: queryScope === 'patient' || queryScope === 'both' ? [
          {
            type: 'allergy',
            message: 'Patient has documented allergy to Penicillin (see record from 2023-08-15)'
          },
          {
            type: 'condition',
            message: 'Patient has history of hypertension requiring monitoring'
          }
        ] : undefined
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const generateAIResponse = (query: string) => {
    const responses = [
      "Based on the cardiac report for John Doe (Patient ID: P12345), the patient presents with mild coronary artery disease. The angiogram shows 40% stenosis in the left anterior descending artery. According to current cardiology guidelines, this level of stenosis typically warrants medical management rather than intervention.",
      "The patient's echocardiogram reveals normal left ventricular function with an ejection fraction of 55%. Current medications include Lisinopril 10mg daily and Metoprolol 50mg twice daily. The treatment plan aligns with current AHA/ACC guidelines for coronary artery disease management.",
      "Review of the patient's laboratory results shows well-controlled cholesterol levels (LDL: 85 mg/dL) on current statin therapy. The patient should continue current medications and follow up in 3 months for reassessment."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
      {/* Document Selector */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium text-gray-900 mb-4">Query Settings</h3>
        
        {/* Scope Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Query Scope</label>
          <select
            value={queryScope}
            onChange={(e) => setQueryScope(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="both">Both Patient & General Docs</option>
            <option value="patient">Patient Documents Only</option>
            <option value="general">General Medical Docs Only</option>
          </select>
        </div>

        {/* Selected Documents */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Documents</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {doc.type === 'patient' ? (
                    <User className="w-4 h-4 text-blue-500 mt-0.5" />
                  ) : (
                    <FileText className="w-4 h-4 text-green-500 mt-0.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{doc.name}</p>
                  {doc.patientInfo && (
                    <p className="text-xs text-blue-600">
                      {doc.patientInfo.name} ({doc.patientInfo.id})
                    </p>
                  )}
                  <p className="text-xs text-gray-500 capitalize">{doc.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow-sm flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Medical Query Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}>
                <p className="mb-2">{message.content}</p>
                
                {/* Medical Alerts */}
                {message.alerts && message.alerts.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.alerts.map((alert, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 border border-red-200 rounded-md">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-red-800 uppercase tracking-wide">
                            {alert.type} Alert
                          </p>
                          <p className="text-sm text-red-700">{alert.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* References */}
                {message.references && message.references.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-600 mb-2">References:</p>
                    <div className="space-y-2">
                      {message.references.map((ref, index) => (
                        <details key={index} className="group">
                          <summary className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                            {ref.document} (Page {ref.page})
                          </summary>
                          <div className="mt-2 p-2 bg-white border border-gray-200 rounded text-xs text-gray-700">
                            "{ref.excerpt}"
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-end space-x-2">
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
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
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
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};