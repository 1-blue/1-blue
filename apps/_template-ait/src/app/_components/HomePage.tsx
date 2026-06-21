"use client";

import { useState } from "react";
import { Button } from "@1-blue/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@1-blue/ui/components/card";
import { Input } from "@1-blue/ui/components/input";
import { Label } from "@1-blue/ui/components/label";
import { AdSensePlaceholder } from "@/app/_components/AdSensePlaceholder";

export const HomePage = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = () => {
    setResult(input.trim() ? `Result: ${input.trim()}` : null);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{{ APP_NAME }}</CardTitle>
          <CardDescription>{{ APP_DESCRIPTION }}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Input</Label>
            <Input
              id="input"
              placeholder="Enter value..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
          {result && <p className="text-muted-foreground text-sm">{result}</p>}
        </CardContent>
      </Card>
      <AdSensePlaceholder slotId="template-slot" />
      <footer className="text-muted-foreground text-center text-xs">
        <a href="/privacy" className="underline">
          Privacy
        </a>
        {" · "}
        <a href="/terms" className="underline">
          Terms
        </a>
      </footer>
    </main>
  );
};
