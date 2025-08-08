import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FormBuilder from "./pages/FormBuilder";
import FormPreview from "./pages/FormPreview";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/fill/:id" element={<FormPreview />} />
      </Routes>
    </BrowserRouter>
  );
}
