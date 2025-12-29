
import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';

interface AdminDashboardProps {
  complaints: Complaint[];
  onUpdate: (id: string, status: ComplaintStatus, message: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ complaints, onUpdate }) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateMsg, setUpdateMsg] = useState('');
  const [filter, setFilter] = useState<ComplaintStatus | 'all'>('all');

  const filtered = filter === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === ComplaintStatus.SUBMITTED).length,
    inProgress: complaints.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length,
    resolved: complaints.filter(c => c.status === ComplaintStatus.RESOLVED).length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">City-Wide Overview</h1>
        <p className="text-slate-500">Command center for municipal issue resolution.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Issues', val: stats.total, color: 'blue' },
          { label: 'Unassigned', val: stats.pending, color: 'amber' },
          { label: 'Active', val: stats.inProgress, color: 'indigo' },
          { label: 'Resolved', val: stats.resolved, color: 'emerald' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-2xl font-black text-${stat.color}-600`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
        >
          All Cases
        </button>
        {Object.values(ComplaintStatus).map(s => (
          <button 
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === s ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
          >
            {s.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Case Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase hidden md:table-cell">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Severity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={c.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 capitalize">{c.issueType}</p>
                      <p className="text-[10px] text-slate-400">By {c.userName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-xs text-slate-600 truncate max-w-[150px]">{c.address}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-3 rounded-full ${i < c.severityScore ? 'bg-red-500' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    c.status === ComplaintStatus.RESOLVED ? 'bg-emerald-100 text-emerald-700' : 
                    c.status === ComplaintStatus.IN_PROGRESS ? 'bg-indigo-100 text-indigo-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedComplaint(c)}
                    className="text-blue-600 font-bold text-xs hover:underline"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400">No cases match the selected filter.</div>
        )}
      </div>

      {/* Admin Management Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Case #{selectedComplaint.id.slice(-6)}</h2>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img src={selectedComplaint.imageUrl} className="w-full aspect-video object-cover rounded-2xl mb-4" />
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Analysis</p>
                    <p className="text-sm text-slate-700 leading-relaxed italic">"{selectedComplaint.aiDescription}"</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Update Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED, ComplaintStatus.REJECTED].map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            onUpdate(selectedComplaint.id, s, updateMsg || `Status changed to ${s}`);
                            setSelectedComplaint(null);
                            setUpdateMsg('');
                          }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                            selectedComplaint.status === s 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                          }`}
                        >
                          {s.replace('_', ' ').toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Admin Note</label>
                    <textarea 
                      value={updateMsg}
                      onChange={e => setUpdateMsg(e.target.value)}
                      placeholder="Add an internal note or message to the citizen..."
                      className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold mb-4">Case History</h3>
                <div className="space-y-4">
                  {selectedComplaint.updates.map(u => (
                    <div key={u.updateId} className="flex gap-4">
                      <div className="w-px bg-slate-200 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-300" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-bold text-slate-900">{u.updatedBy}</p>
                          <p className="text-[10px] text-slate-400">{new Date(u.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-slate-600">{u.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
