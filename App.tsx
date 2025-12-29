
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, UserProfile, Complaint, ComplaintStatus, IssueType } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import ReportForm from './components/ReportForm';
import AuthScreen from './components/AuthScreen';

const MOCK_USER_CITIZEN: UserProfile = {
  uid: 'user123',
  name: 'John Citizen',
  email: 'john@example.com',
  phone: '555-0199',
  role: UserRole.CITIZEN,
  createdAt: Date.now()
};

const MOCK_USER_ADMIN: UserProfile = {
  uid: 'admin789',
  name: 'Admin Sarah',
  email: 'sarah.admin@city.gov',
  phone: '555-9000',
  role: UserRole.ADMIN,
  createdAt: Date.now()
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'report'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with some data
  useEffect(() => {
    const saved = localStorage.getItem('civiceye_complaints');
    if (saved) {
      setComplaints(JSON.parse(saved));
    }
  }, []);

  // Save data to "Mock Firestore" (LocalStorage)
  useEffect(() => {
    if (complaints.length > 0) {
      localStorage.setItem('civiceye_complaints', JSON.stringify(complaints));
    }
  }, [complaints]);

  const handleLogin = (role: UserRole) => {
    setUser(role === UserRole.CITIZEN ? MOCK_USER_CITIZEN : MOCK_USER_ADMIN);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const addComplaint = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
    setCurrentView('dashboard');
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, message: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          updatedAt: Date.now(),
          updates: [
            ...c.updates,
            {
              updateId: Math.random().toString(36).substr(2, 9),
              complaintId: c.id,
              updatedBy: user.name,
              message,
              statusChange: status,
              timestamp: Date.now()
            }
          ]
        };
      }
      return c;
    }));
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const filteredComplaints = user.role === UserRole.ADMIN 
    ? complaints 
    : complaints.filter(c => c.userId === user.uid);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        role={user.role} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentView === 'dashboard' ? (
            user.role === UserRole.ADMIN ? (
              <AdminDashboard 
                complaints={filteredComplaints} 
                onUpdate={updateComplaintStatus} 
              />
            ) : (
              <CitizenDashboard 
                complaints={filteredComplaints} 
                onNewReport={() => setCurrentView('report')} 
              />
            )
          ) : (
            <ReportForm 
              user={user} 
              onSubmit={addComplaint} 
              onCancel={() => setCurrentView('dashboard')} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
