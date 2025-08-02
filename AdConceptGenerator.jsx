import React, { useState } from "react";

const techniques = [
  // ...same as before (unchanged for brevity)
];

async function fetchAdConcept(technique, brief) {
  const prompt = `Generate a unique, imaginative 30-second ad script using the '${technique}' creative technique based on this brief: "${brief}". Include visual description, key action beats, tone, and a clever closing shot.`;
  const response = await fetch("/api/generate-ad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  return data.result;
}

export default function AdConceptGenerator() {
  const [brief, setBrief] = useState("");
  const [concepts, setConcepts] = useState(Array(techniques.length).fill(""));
  const [loading, setLoading] = useState(false);

  const generateConcepts = async () => {
    setLoading(true);
    const newConcepts = await Promise.all(
      techniques.map((technique) => fetchAdConcept(technique.name, brief))
    );
    setConcepts(newConcepts);
    setLoading(false);
  };

  const regenerateConcept = async (idx) => {
    const updated = [...concepts];
    updated[idx] = await fetchAdConcept(techniques[idx].name, brief);
    setConcepts(updated);
  };

  const exportToPDF = async () => {
    const content = techniques.map((technique, idx) => `\n\n${technique.name}\n${technique.description}\n\n${concepts[idx]}`).join("\n\n---\n");
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ad-concepts.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <header className="sticky top-0 bg-white z-10 shadow-sm py-4">
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Enter your creative brief here..."
          className="w-full border p-2"
        />
        <div className="flex gap-4 mt-2">
          <button onClick={generateConcepts} disabled={loading}>
            {loading ? "Generating..." : "Submit Brief & Generate Concepts"}
          </button>
          <button onClick={exportToPDF} disabled={concepts.every(c => !c)}>
            📄 Export All to PDF
          </button>
        </div>
      </header>

      {techniques.map((technique, idx) => (
        <div key={technique.name} className="border p-4 my-4 rounded">
          <h2 className="text-xl font-semibold">{technique.name}</h2>
          <p className="italic text-gray-600">{technique.description}</p>
          <p className="mt-2 whitespace-pre-wrap">{concepts[idx]}</p>
          <button
            className="border mt-2 px-4 py-1"
            onClick={() => regenerateConcept(idx)}
            disabled={loading}
          >
            🔄 Regenerate
          </button>
        </div>
      ))}
    </div>
  );
}
