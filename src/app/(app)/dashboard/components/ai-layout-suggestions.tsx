"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestLayout, SuggestLayoutInput } from "@/ai/flows/suggest-layout";
import { Sparkles, Loader2, Wand2, Terminal } from "lucide-react";

export default function AiLayoutSuggestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);

    const input: SuggestLayoutInput = {
      elements: ["logo", "main title", "image gallery", "scrolling ticker"],
      designPreferences: "A modern, clean, and minimalist style for a corporate lobby.",
    };

    try {
      const result = await suggestLayout(input);
      setSuggestions(result.layoutSuggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-accent" />
            <span>Layout Ideas</span>
          </CardTitle>
          <CardDescription>
            Let AI generate creative layout ideas for your current elements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={getSuggestions} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Suggestions
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Suggestions</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
