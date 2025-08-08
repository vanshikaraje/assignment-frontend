import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import FormBuilder from "./pages/FormBuilder";
import FormPreview from "./pages/FormPreview";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/preview/:formId" element={<FormPreview />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
