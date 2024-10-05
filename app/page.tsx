// app/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import {Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [specification, setSpecification] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedSessionId = searchParams.get('session');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      const storedIdeas = localStorage.getItem(`ideas_${storedSessionId}`);
      if (storedIdeas) {
        setIdeas(JSON.parse(storedIdeas));
      }
      const storedSpec = localStorage.getItem(`specification_${storedSessionId}`);
      if (storedSpec) {
        setSpecification(storedSpec);
      }
    }
  }, [searchParams]);

  const generateIdeas = () => {
    // Hardcoded ideas for now
    const generatedIdeas = [
      "A real-time collaboration tool for developers",
      "An AI-powered code review assistant",
      "A visual debugging tool for complex algorithms"
    ];
    setIdeas(generatedIdeas);
    
    const newSessionId = sessionId || uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem(`ideas_${newSessionId}`, JSON.stringify(generatedIdeas));
    localStorage.setItem(`specification_${newSessionId}`, specification);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Idea Generator</h1>
      <div className="mb-4">
        <Input
          placeholder="Enter your specification..."
          value={specification}
          onChange={(e) => setSpecification(e.target.value)}
          className="mb-2"
        />
        <Button onClick={generateIdeas}>Generate Ideas</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea, index) => (
          <Card key={index}>
            <CardHeader>Idea {index + 1}</CardHeader>
            <CardContent>{idea}</CardContent>
            <CardFooter>
              <Link 
                href={`/chat?session=${sessionId || uuidv4()}&initialMessage=${encodeURIComponent(specification)}&idea=${encodeURIComponent(idea)}`}
                passHref
              >
                <Button variant="outline">Explore This Idea</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}