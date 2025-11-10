import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { Header } from './components/Header';
import { CustomerView } from './views/CustomerView';
import { SellerView } from './views/SellerView';
import { LoginView } from './views/LoginView';
import { UserRole } from './types';

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
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;