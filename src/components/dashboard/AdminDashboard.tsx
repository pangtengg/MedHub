import React, { useState } from 'react';
import { Navigation } from '../shared/Navigation';
import { DocumentRepository } from '../documents/DocumentRepository';
import { UserManagement } from '../admin/UserManagement';

type AdminView = 'repository' | 'users';

export const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('repository');

  const renderView = () => {
    switch (activeView) {
      case 'repository':
        return <DocumentRepository />;
      case 'users':
        return <UserManagement />;
      default:
        return <DocumentRepository />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeView={activeView}
        onViewChange={setActiveView}
        userRole="admin"
      />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderView()}
      </main>
    </div>
  );
};