import React from 'react';
import { MentionsPage } from './pages/MentionsPage';
import { AuthRequired } from './components/AuthRequired';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <AuthRequired>
          <MentionsPage />
        </AuthRequired>
      </div>
    </ErrorBoundary>
  );
}

export default App;