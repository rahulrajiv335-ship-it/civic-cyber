
import React from 'react';
import { UserRole } from '../types';

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-CivicEye</h1>
        <p className="text-gray-600 mb-8">Intelligent civic issue reporting for cleaner, safer cities.</p>
        
        <div className="space-y-4">
          <button 
            onClick={() => onLogin(UserRole.CITIZEN)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2"
          >
            <span>Login as Citizen</span>
          </button>
          
          <button 
            onClick={() => onLogin(UserRole.ADMIN)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2"
          >
            <span>Login as Admin</span>
          </button>
        </div>
        
        <p className="mt-8 text-xs text-gray-400">
          Secure, authenticated access for residents and municipal staff.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
