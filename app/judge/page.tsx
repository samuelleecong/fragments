// app/judge/page.tsx
'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function JudgePage() {
  const [code, setCode] = useState('');
  const [judgement, setJudgement] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/judge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ generatedCode: code }),
      });

      if (!response.ok) {
        throw new Error('Failed to judge code');
      }

      const data = await response.json();
      setJudgement(data.judgement);
    } catch (error) {
      console.error('Error:', error);
      setJudgement('An error occurred while judging the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Hackathon Judge</h1>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here..."
          className="mb-4"
          rows={10}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Judging...' : 'Submit for Judging'}
        </Button>
      </form>
      {judgement && (
        <Card className="mt-4">
          <CardHeader>Judgement Result</CardHeader>
          <CardContent>
            <pre>{judgement}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}