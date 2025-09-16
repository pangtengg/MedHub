import React, { useState } from 'react';
import { Navigation } from '../shared/Navigation';
import { DoctorQueryHub } from '../query/DoctorQueryHub';

export const DoctorDashboard: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole="doctor" />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DoctorQueryHub />
      </main>
    </div>
  );
};