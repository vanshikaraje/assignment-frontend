import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FormPreview() {
  const { id } = useParams();  // form ID from URL
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/forms/${id}`)
      .then(res => setForm(res.data))
      .catch(() => alert("Failed to load form"));
  }, [id]);

  if (!form) return <div>Loading form...</div>;

  const handleChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    axios.post("http://localhost:5000/api/responses", { formId: id, answers })
      .then(() => alert("Answers submitted!"))
      .catch(() => alert("Failed to submit answers"));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{form.title}</h1>
      {form.questions.map((q, i) => (
        <div key={q.id} className="mb-6 border p-4 rounded">
          <p className="mb-2 font-semibold">Q{i + 1}: {q.questionText}</p>

          {q.type === "categorized" && (
            <select
              className="border p-2 w-full"
              onChange={e => handleChange(q.id, e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select category</option>
              {q.categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          {q.type === "cloze" && (
            <input
              type="text"
              className="border p-2 w-full"
              placeholder="Fill in the blank"
              onChange={e => handleChange(q.id, e.target.value)}
            />
          )}

          {q.type === "comprehension" && (
            <>
              {q.options.map((opt, idx) => (
                <label key={idx} className="block mb-1">
                  <input
                    type="radio"
                    name={`mcq-${q.id}`}
                    value={opt.text}
                    onChange={() => handleChange(q.id, opt.text)}
                  />
                  {opt.text}
                </label>
              ))}
            </>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Submit Answers
      </button>
    </div>
  );
}
