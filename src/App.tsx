import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import SchemaBuilder from "./pages/builder";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<SchemaBuilder />} />
      </Routes>
    </Router>
  );
};

export default App;
