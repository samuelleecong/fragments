// app/judging-results/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import Link from 'next/link';

interface JudgingResult {
  score: string;
  rubric: string;
}

// Default judging results to use if API call fails
const defaultJudgingResults: JudgingResult[] = [
  {
    "score": "7",
    "rubric": `Correctness of code: 8/10 - The code is functional and implements a basic Todo app without obvious errors. However, there's a minor issue with the export statement at the beginning that should be at the end.
    Quality of code: 7/10 - The code is well-structured, using React hooks appropriately and following modern React practices. It uses Tailwind CSS for styling, which is a good choice for rapid development. However, there's room for improvement in code organization and reusability.
    Real world impact of code: 6/10 - A Todo app is a practical application that can be useful for personal task management. However, it lacks more advanced features that would make it stand out in the real world, such as persistence, categories, or due dates.
    Creativity of coding solution: 7/10 - While a Todo app is a common project, this implementation shows some creativity in its use of React hooks and Tailwind CSS for a clean, modern UI. The delete functionality is a nice touch, but more innovative features could have been included.`
  },
  {
    "score": "8",
    "rubric": `Correctness of code: 8/10 - The code appears to be mostly correct, implementing a basic drawing functionality with real-time updates using sockets. However, there are a few minor issues, such as not defining 'ctx' and 'socket'.
    Quality of code: 7/10 - The code is well-structured and uses React hooks appropriately. It separates concerns into different event handlers. However, it could benefit from more comments and better error handling.
    Real world impact of code: 8/10 - This code implements a collaborative drawing application, which has practical applications in remote collaboration, online education, and creative projects. The real-time aspect adds significant value.
    Creativity of coding solution: 9/10 - The combination of a drawing canvas with real-time collaboration through sockets is creative. The addition of color selection and different drawing tools (pen, shapes, text) shows thoughtful feature implementation.`
    }
    ];

export default function JudgingResults() {
  const [results, setResults] = useState<JudgingResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  useEffect(() => {
    const fetchJudgingResults = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/get_judging');
        if (!response.ok) {
          throw new Error('Failed to fetch judging results');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching judging results:', err);
        // Use default judging results if there's any error
        setResults(defaultJudgingResults);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJudgingResults();
  }, [sessionId]);

  if (isLoading) {
    return <div>Loading judging results...</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Judging Results</h1>
      <Link href={`/?session=${sessionId}`}>
        <Button className="mb-4">Back to Ideas</Button>
      </Link>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <Card key={index}>
            <CardHeader>Idea {index + 1}</CardHeader>
            <CardContent>
              <p><strong>Score:</strong> {result.score}</p>
              <p><strong>Rubric:</strong> {result.rubric}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}