import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './views/Onboarding';
import HasResumeFlow from './views/HasResumeFlow';
import CreateResumeFlow from './views/CreateResumeFlow';
import BuilderView from './views/BuilderView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/has-resume" element={<HasResumeFlow />} />
        <Route path="/onboarding/create-resume" element={<CreateResumeFlow />} />
        <Route path="/builder" element={<BuilderView />} />
      </Routes>
    </Router>
  );
};

export default App;
