import React from 'react';
import { useAppContext } from '../contexts/AppContext';

interface HeaderProps {}

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.001 2C6.478 2 2 6.477 2 11.999c0 5.522 4.478 9.999 10.001 9.999 1.833 0 3.55-.492 5.064-1.352-1.22-1.46-1.92-3.32-1.92-5.32 0-4.646 3.76-8.406 8.406-8.406.01 0 .02 0 .03-.001C21.782 3.32 17.23 2 12.001 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c.34 0 .68.02 1.01.07-3.92 1.4-6.79 5.06-6.79 9.3s2.87 7.9 6.79 9.3c-.33.05-.67.07-1.01.07z"/>
    </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);


export const Header: React.FC<HeaderProps> = () => {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <LeafIcon className="h-10 w-10 text-green-600" />
            <h1 className="ml-3 text-3xl font-bold text-green-800 tracking-tight">Prabha Vegetables</h1>
          </div>
          {currentUser && (
            <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium hidden sm:block">Welcome, {currentUser.name}</span>
                <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 bg-red-500 text-white shadow hover:bg-red-600"
                >
                    <LogoutIcon className="h-5 w-5 mr-2" />
                    Logout
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};