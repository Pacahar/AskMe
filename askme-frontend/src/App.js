import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import CreateSurvey from './pages/CreateSurvey';
import TakeSurvey from './pages/TakeSurvey';
import SurveyInfo from './pages/SurveyInfo';
import Header from './components/Header'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSurvey />} />
        <Route path="/:id" element={<TakeSurvey />} />
        <Route path="/:id/info" element={<SurveyInfo />} />
        <Route path="/login" element={<SurveyInfo />} />
        <Route path="/register" element={<SurveyInfo />} />
      </Routes>
    </div>
  );
}

export default App;
