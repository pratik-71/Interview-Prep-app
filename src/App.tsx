
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import PracticeInterview from './Webpage/PracticeInterview';
import QuestionsDisplay from './Webpage/QuestionsDisplay';
import TestComponent from './Webpage/Test_Component';
import Layout from './Webpage/Layout';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/practice" replace />} />
            <Route path="/practice" element={<PracticeInterview />} />
            <Route path="/practice/questions" element={<QuestionsDisplay />} />
            <Route path="/test" element={<TestComponent />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
