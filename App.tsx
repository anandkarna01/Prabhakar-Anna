import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { CustomerView } from './views/CustomerView.tsx';
import { SellerView } from './views/SellerView.tsx';
import { LoginView } from './views/LoginView.tsx';
import { UserRole } from './types.ts';
import { isSupabaseConfigured } from './supabaseClient.ts';

const ConfigurationRequiredScreen: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
    <div className="max-w-3xl w-full bg-white rounded-lg shadow-2xl p-8 text-center border-t-8 border-yellow-400">
      <svg className="mx-auto h-16 w-16 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Configuration Required</h1>
      <p className="mt-4 text-lg text-gray-600">
        Welcome! To make the app functional, you need to connect it to your free Supabase database.
      </p>
      <div className="mt-6 text-left bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Please Follow These Steps:</h2>
        <ol className="mt-3 list-decimal list-inside space-y-4 text-gray-700">
          <li>
            <strong>Find your Project URL:</strong> In your Supabase project, go to <strong>Settings</strong> (gear icon) &rarr; <strong>Data API</strong>. Copy the <strong>Project URL</strong> from this page.
          </li>
          <li>
            <strong>Find your `anon` Key:</strong> In the same settings menu, go to the <strong>API Keys</strong> tab. Copy the key labeled <strong>`anon`</strong> and <strong>`public`</strong>.
          </li>
          <li>
            <strong>Open <code className="bg-gray-200 text-red-600 font-mono p-1 rounded">supabaseClient.ts</code>:</strong> In the file explorer on the left, find and open this file.
          </li>
          <li>
            <strong>Paste Your Credentials:</strong> Paste your copied URL and Key into the placeholder variables inside that file and save it. The app will automatically connect.
          </li>
        </ol>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        This is a one-time setup. Without it, the app cannot save any data.
      </p>
    </div>
  </div>
);


const AppContent: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-green-50/50 font-sans">
      <Header />
      <main>
        {currentUser.role === UserRole.CUSTOMER ? <CustomerView /> : <SellerView />}
      </main>
      <footer className="text-center py-4 text-sm text-gray-500 mt-8">
          <p>&copy; {new Date().getFullYear()} Prabha Vegetables. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  if (!isSupabaseConfigured) {
    return <ConfigurationRequiredScreen />;
  }
  
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;