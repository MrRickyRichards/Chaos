import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const techniques = [
  // ... same list of techniques as before
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

  return (
    <div className="p-6 space-y-6">
      <header className="sticky top-0 bg-white z-10 shadow-sm py-4">
        <Textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Enter your creative brief here..."
          className="w-full"
        />
        <Button onClick={generateConcepts} disabled={loading} className="mt-2">
          {loading ? "Generating..." : "Submit Brief & Generate Concepts"}
        </Button>
      </header>

      {techniques.map((technique, idx) => (
        <Card key={technique.name}>
          <CardContent className="space-y-2 p-4">
            <h2 className="text-xl font-semibold">{technique.name}</h2>
            <p className="text-muted-foreground italic">{technique.description}</p>
            <p className="mt-2 whitespace-pre-wrap">{concepts[idx]}</p>
            <Button
              variant="outline"
              onClick={() => regenerateConcept(idx)}
              disabled={loading}
            >
              🔄 Regenerate
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}