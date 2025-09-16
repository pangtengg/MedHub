import React, { useState } from 'react';
import { AlertTriangle, Clock, User, FileText, Filter, Search } from 'lucide-react';

interface Alert {
  id: string;
  type: 'allergy' | 'condition' | 'medication' | 'safety';
  severity: 'high' | 'medium' | 'low';
  message: string;
  patientInfo: {
    id: string;
    name: string;
  };
  documentName: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  documentsQueried: string[];
  resultsSummary: string;
  hasAlerts: boolean;
}

export const AlertsHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'history'>('alerts');
  const [alertFilter, setAlertFilter] = useState<'all' | 'high' | 'unacknowledged'>('all');

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'allergy',
      severity: 'high',
      message: 'Patient has documented severe allergy to Penicillin. Alternative antibiotics should be considered.',
      patientInfo: { id: 'P12345', name: 'John Doe' },
      documentName: 'Patient_John_Doe_CardiacReport.pdf',
      timestamp: new Date('2024-01-15T10:30:00'),
      acknowledged: false
    },
    {
      id: '2',
      type: 'condition',
      severity: 'medium',
      message: 'Patient has history of cardiac arrhythmia. Monitor heart rhythm during procedures.',
      patientInfo: { id: 'P12345', name: 'John Doe' },
      documentName: 'Patient_John_Doe_CardiacReport.pdf',
      timestamp: new Date('2024-01-15T10:32:00'),
      acknowledged: true
    },
    {
      id: '3',
      type: 'medication',
      severity: 'medium',
      message: 'Patient currently on Warfarin. Check INR levels before any surgical procedures.',
      patientInfo: { id: 'P12346', name: 'Jane Smith' },
      documentName: 'Patient_Jane_Smith_LabResults.pdf',
      timestamp: new Date('2024-01-14T14:15:00'),
      acknowledged: false
    }
  ];

  const queryHistory: QueryHistory[] = [
    {
      id: '1',
      query: 'What are the latest cardiac test results for John Doe?',
      timestamp: new Date('2024-01-15T10:30:00'),
      documentsQueried: ['Patient_John_Doe_CardiacReport.pdf'],
      resultsSummary: 'Found cardiac catheterization results showing 40% LAD stenosis',
      hasAlerts: true
    },
    {
      id: '2',
      query: 'Guidelines for managing moderate coronary stenosis',
      timestamp: new Date('2024-01-15T09:45:00'),
      documentsQueried: ['Cardiology_Guidelines_2024.pdf'],
      resultsSummary: 'Retrieved AHA/ACC guidelines for medical management',
      hasAlerts: false
    },
    {
      id: '3',
      query: 'Lab results interpretation for Jane Smith',
      timestamp: new Date('2024-01-14T14:15:00'),
      documentsQueried: ['Patient_Jane_Smith_LabResults.pdf'],
      resultsSummary: 'CBC and metabolic panel within normal limits',
      hasAlerts: true
    }
  ];

  const filteredAlerts = alerts.filter(alert => {
    switch (alertFilter) {
      case 'high':
        return alert.severity === 'high';
      case 'unacknowledged':
        return !alert.acknowledged;
      default:
        return true;
    }
  });

  const acknowledgeAlert = (alertId: string) => {
    // Here you would update the alert in your state management
    console.log('Acknowledging alert:', alertId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'allergy':
        return '🚨';
      case 'condition':
        return '⚠️';
      case 'medication':
        return '💊';
      default:
        return '⚡';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 pt-6">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Medical Alerts</span>
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {alerts.filter(a => !a.acknowledged).length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Query History</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'alerts' ? (
            <div className="space-y-4">
              {/* Alerts Filter */}
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">All Alerts</option>
                  <option value="high">High Severity</option>
                  <option value="unacknowledged">Unacknowledged</option>
                </select>
              </div>

              {/* Alerts List */}
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)} ${
                      !alert.acknowledged ? 'shadow-md' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-xl">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm uppercase tracking-wide">
                              {alert.type} Alert
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              alert.severity === 'high'
                                ? 'bg-red-100 text-red-800'
                                : alert.severity === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{alert.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{alert.patientInfo.name} ({alert.patientInfo.id})</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="w-3 h-3" />
                              <span>{alert.documentName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{alert.timestamp.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search query history..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Query History */}
              <div className="space-y-3">
                {queryHistory.map((query) => (
                  <div key={query.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{query.query}</p>
                        <p className="text-sm text-gray-600">{query.resultsSummary}</p>
                      </div>
                      {query.hasAlerts && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">Alerts</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{query.timestamp.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{query.documentsQueried.length} document{query.documentsQueried.length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};