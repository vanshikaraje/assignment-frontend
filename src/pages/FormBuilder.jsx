import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const defaultQuestion = {
  id: Date.now(),
  type: "categorized", 
  questionText: "",
  options: [],
  categories: [], 
  correctAnswers: [], 
  image: null,
};

export default function FormBuilder() {
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("My Custom Form");
  const [questions, setQuestions] = useState([{ ...defaultQuestion }]);


  function addQuestion(type) {
    setQuestions((q) => [
      ...q,
      {
        ...defaultQuestion,
        id: Date.now(),
        type,
        questionText: "",
        options: [],
        categories: type === "categorized" ? ["Category 1"] : [],
        correctAnswers: [],
      },
    ]);
  }

 
  function updateQuestion(id, field, value) {
    setQuestions((q) =>
      q.map((quest) =>
        quest.id === id ? { ...quest, [field]: value } : quest
      )
    );
  }

  
  async function saveForm() {
    try {
      const res = await axios.post("http://localhost:5000/api/forms", {
        title: formTitle,
        questions,
      });
      alert("Form saved!");

      if (res.data && res.data._id) {
        navigate(`/fill/${res.data._id}`);
      }
    } catch (e) {
      alert("Error saving form");
      console.error(e);
    }
  }


  function addCategory(questionId) {
    setQuestions((q) =>
      q.map((quest) => {
        if (quest.id === questionId) {
          return {
            ...quest,
            categories: [...quest.categories, `Category ${quest.categories.length + 1}`],
          };
        }
        return quest;
      })
    );
  }

  function addOption(questionId) {
    setQuestions((q) =>
      q.map((quest) => {
        if (quest.id === questionId) {
          return {
            ...quest,
            options: [...quest.options, `Option ${quest.options.length + 1}`],
          };
        }
        return quest;
      })
    );
  }

  
  function addMCQOption(questionId) {
    setQuestions((q) =>
      q.map((quest) => {
        if (quest.id === questionId) {
          return {
            ...quest,
            options: [...quest.options, { text: "", isCorrect: false }],
          };
        }
        return quest;
      })
    );
  }

 
  function updateMCQOption(questionId, idx, field, value) {
    setQuestions((q) =>
      q.map((quest) => {
        if (quest.id === questionId) {
          const newOptions = [...quest.options];
          newOptions[idx] = { ...newOptions[idx], [field]: value };
          return { ...quest, options: newOptions };
        }
        return quest;
      })
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Custom Form Builder</h1>

      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />

      <div className="mb-6 space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => addQuestion("categorized")}
        >
          Add Categorized Question
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => addQuestion("cloze")}
        >
          Add Cloze Question
        </button>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => addQuestion("comprehension")}
        >
          Add Comprehension (MCQ)
        </button>
      </div>

      <div className="space-y-8">
        {questions.map((q, i) => (
          <div key={q.id} className="border p-4 rounded">
            <h2 className="font-semibold mb-2">
              Q{i + 1} ({q.type})
            </h2>
            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Enter question text"
              value={q.questionText}
              onChange={(e) => updateQuestion(q.id, "questionText", e.target.value)}
            />

            {q.type === "categorized" && (
              <>
                <div className="mb-2">
                  <strong>Categories:</strong>
                  {q.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-yellow-200 px-2 py-1 mr-2 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                  <button
                    className="ml-2 text-sm text-blue-500"
                    onClick={() => addCategory(q.id)}
                  >
                    + Add Category
                  </button>
                </div>
                <div className="mb-2">
                  <strong>Options (Drag & Drop answers):</strong>
                  {q.options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="border p-1 mr-2 mb-1"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...q.options];
                        newOpts[idx] = e.target.value;
                        updateQuestion(q.id, "options", newOpts);
                      }}
                    />
                  ))}
                  <button
                    className="ml-2 text-sm text-blue-500"
                    onClick={() => addOption(q.id)}
                  >
                    + Add Option
                  </button>
                </div>
              </>
            )}

            {q.type === "cloze" && (
              <div>
                <p className="mb-2">
                  <em>Underline words to create blanks (implement this in preview mode).</em>
                </p>
                <textarea
                  className="border p-2 w-full"
                  placeholder="Write your paragraph here with words to be blanked underlined (for example, use underscores or brackets)."
                  value={q.questionText}
                  onChange={(e) => updateQuestion(q.id, "questionText", e.target.value)}
                  rows={4}
                />
              </div>
            )}

            {q.type === "comprehension" && (
              <>
                <textarea
                  className="border p-2 w-full mb-2"
                  placeholder="Comprehension passage"
                  value={q.questionText}
                  onChange={(e) => updateQuestion(q.id, "questionText", e.target.value)}
                  rows={4}
                />
                <div>
                  <strong>MCQ Options:</strong>
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center mb-1 space-x-2">
                      <input
                        type="text"
                        className="border p-1 flex-grow"
                        value={opt.text}
                        onChange={(e) => updateMCQOption(q.id, idx, "text", e.target.value)}
                        placeholder="Option text"
                      />
                      <label className="inline-flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) =>
                            updateMCQOption(q.id, idx, "isCorrect", e.target.checked)
                          }
                        />
                        <span>Correct</span>
                      </label>
                    </div>
                  ))}
                  <button
                    className="text-sm text-blue-500"
                    onClick={() => addMCQOption(q.id)}
                  >
                    + Add MCQ Option
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={saveForm}
        className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Save Form
      </button>
    </div>
  );
}
