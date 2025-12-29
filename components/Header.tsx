
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
      <div className="md:hidden font-bold text-blue-600 text-lg">CivicEye</div>
      <div className="hidden md:block text-sm text-slate-500 font-medium">
        Welcome back, <span className="text-slate-900">{user.name}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right mr-2">
          <span className="text-xs font-bold text-slate-900">{user.name}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-tight">{user.role}</span>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
