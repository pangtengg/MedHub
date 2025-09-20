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
      content: 'Hello! I\'m your medical document assistant. Please select documents from the sidebar to start querying, or ask general medical questions. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedDocuments] = useState<SelectedDocument[]>([]);
  const [queryScope, setQueryScope] = useState<'patient' | 'general' | 'both'>('both');

  const querySuggestions = [
    {
      category: 'Cardiology',
      suggestions: [
        'Analyze the echocardiogram results',
        'Review medication compliance for heart conditions',
        'What is the recommended treatment plan?'
      ]
    },
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
  };

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
            type: 'condition',
            message: 'Patient has history of hypertension requiring monitoring'
          }
        ] : undefined
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
    
    // Default response for unrecognized queries
    return `I understand you're asking about "${query}". Based on the available medical records for John Doe (Patient ID: P12345), I can see information about cardiac conditions, hypertension, and cholesterol management. However, I may need more specific information or additional documents to provide a comprehensive answer. Could you please clarify your question or ensure the relevant documents are selected for analysis?`;
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual voice recording
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Document Selector */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4 overflow-y-auto">
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
        <div className="flex-1 min-h-0">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Documents</h4>
          <div className="space-y-2 h-full overflow-y-auto">
            {selectedDocuments.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No documents selected</p>
                <p className="text-xs text-gray-400 mt-1">Select documents from the repository to start querying</p>
              </div>
            ) : (
              selectedDocuments.map((doc) => (
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-200px)] relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
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
                <p className="mt-2 text-xs text-red-600">
                  ⚠️ Always verify medication compatibility before prescribing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 pb-24">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}>
                <p className="mb-2">{message.content}</p>

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

          {/* Query Suggestions - Floating Bars */}
          {showSuggestions && messages.length <= 1 && (
            <div className="space-y-3">
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
                <div key={categoryIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-blue-800 mb-2 uppercase tracking-wide">
                    {category.category}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {category.suggestions.map((suggestion, suggestionIndex) => (
                      <button
                        key={suggestionIndex}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-xs bg-white text-blue-700 border border-blue-300 rounded-full hover:bg-blue-100 hover:border-blue-400 transition-colors"
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

        {/* Input Area - Fixed at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
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