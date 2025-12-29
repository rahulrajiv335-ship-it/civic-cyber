
import React, { useState, useRef } from 'react';
import { UserProfile, Complaint, ComplaintStatus, IssueType } from '../types';
import { analyzeCivicIssue, AIAnalysisResult } from '../services/geminiService';

interface ReportFormProps {
  user: UserProfile;
  onSubmit: (complaint: Complaint) => void;
  onCancel: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ user, onSubmit, onCancel }) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'review'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [manualDesc, setManualDesc] = useState('');
  const [address, setAddress] = useState('Fetching location...');
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setImage(reader.result as string);
      startAnalysis(base64String);
    };
    reader.readAsDataURL(file);

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          // In a real app, we'd reverse geocode here.
          setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => setAddress("Location permission denied")
      );
    }
  };

  const startAnalysis = async (base64: string) => {
    setStep('analyzing');
    setError('');
    try {
      const result = await analyzeCivicIssue(base64);
      setAnalysis(result);
      setStep('review');
    } catch (err) {
      console.error(err);
      setError('AI analysis failed. Please try a clearer photo or manually select the category.');
      setStep('review');
      // Set defaults if AI fails
      setAnalysis({
        issueType: 'other',
        description: 'No description provided',
        severity: 3,
        tags: []
      });
    }
  };

  const handleFinalSubmit = () => {
    if (!image || !analysis) return;

    const newComplaint: Complaint = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      userName: user.name,
      imageUrl: image,
      issueType: analysis.issueType,
      aiDescription: analysis.description,
      manualDescription: manualDesc,
      severityScore: analysis.severity,
      latitude: coords.lat,
      longitude: coords.lng,
      address: address,
      status: ComplaintStatus.SUBMITTED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      duplicateFlag: false,
      updates: []
    };

    onSubmit(newComplaint);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold">Report an Issue</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="p-8">
        {step === 'upload' && (
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload Photo</h3>
              <p className="text-slate-500 text-sm">Take a photo of the pothole, leak, or garbage.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-xs text-amber-700 font-medium">Clear photos help our AI accurately identify the issue and route it to the right department faster.</p>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="py-20 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Analyzing Image...</h3>
            <p className="text-slate-500">Gemini AI is identifying the issue and rating severity.</p>
          </div>
        )}

        {step === 'review' && analysis && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img src={image!} className="w-full aspect-square object-cover rounded-2xl shadow-sm border border-slate-100" />
              </div>
              <div className="md:w-2/3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Detected Issue</p>
                    <p className="text-sm font-bold capitalize">{analysis.issueType}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Severity</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-red-600">{analysis.severity}/5</span>
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${(analysis.severity/5)*100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">AI Generated Description</p>
                  <p className="text-sm text-slate-700 leading-relaxed italic">"{analysis.description}"</p>
                </div>

                {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location Information</label>
                <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  <p className="text-sm text-slate-600">{address}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Additional Comments (Optional)</label>
                <textarea 
                  value={manualDesc}
                  onChange={e => setManualDesc(e.target.value)}
                  placeholder="Is there anything else maintenance should know? E.g., 'Behind the main bus stop'"
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                onClick={() => setStep('upload')}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                Back
              </button>
              <button 
                onClick={handleFinalSubmit}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Confirm & Submit Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;
