
import React from 'react';
import { Complaint, ComplaintStatus } from '../types';

interface CitizenDashboardProps {
  complaints: Complaint[];
  onNewReport: () => void;
}

const StatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  const styles = {
    [ComplaintStatus.SUBMITTED]: 'bg-blue-100 text-blue-700',
    [ComplaintStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700',
    [ComplaintStatus.RESOLVED]: 'bg-emerald-100 text-emerald-700',
    [ComplaintStatus.REJECTED]: 'bg-slate-100 text-slate-700',
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ complaints, onNewReport }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Reports</h1>
          <p className="text-slate-500">Track and manage your submitted civic concerns.</p>
        </div>
        <button 
          onClick={onNewReport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Report New Issue
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No reports found</h3>
          <p className="text-slate-500 mb-6">You haven't submitted any civic issues yet.</p>
          <button 
            onClick={onNewReport}
            className="text-blue-600 font-semibold hover:underline"
          >
            Submit your first report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 relative overflow-hidden group">
                <img 
                  src={complaint.imageUrl} 
                  alt={complaint.issueType} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={complaint.status} />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-medium">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 capitalize">{complaint.issueType}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-red-500">Severity {complaint.severityScore}</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                  {complaint.aiDescription}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center text-xs text-slate-400 italic truncate max-w-[150px]">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {complaint.address || 'Unknown Location'}
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">ID: {complaint.id.slice(-6)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
