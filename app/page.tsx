'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams, useRouter } from 'next/navigation';

// Hardcoded fallback ideas (unchanged)
const fallbackIdeas = {
  "idea_1": "Create a basic todo app using Next.js. This app will allow users to add, view, and delete todo items. Use React hooks for state management and Tailwind CSS for styling. The app will consist of a simple form to add new todos and a list to display existing todos with the ability to delete them. Steps: 1) Set up the basic structure of the Next.js page. 2) Create a state to store todo items. 3) Implement a form to add new todos. 4) Display the list of todos. 5) Add functionality to delete todos. 6) Style the app using Tailwind CSS.",
  "idea_2": "Develop a real-time collaborative whiteboard application using React and Socket.io. This app will allow multiple users to draw and edit on a shared canvas simultaneously. Features will include different drawing tools (pen, shapes, text), color selection, and the ability to save and load whiteboard sessions. Steps: 1) Set up a React frontend with a canvas element. 2) Implement basic drawing functionality. 3) Set up a Node.js backend with Socket.io for real-time communication. 4) Add multi-user support and real-time updates. 5) Implement additional features like tool selection and color picker. 6) Add save/load functionality using local storage or a database."
};

export default function Home() {
  const [specification, setSpecification] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let storedSessionId = searchParams.get('session');
    if (!storedSessionId) {
      storedSessionId = localStorage.getItem('currentSessionId');
      if (!storedSessionId) {
        storedSessionId = uuidv4();
        localStorage.setItem('currentSessionId', storedSessionId);
      }
      router.replace(`/?session=${storedSessionId}`, undefined);
    }
    setSessionId(storedSessionId);

    const storedIdeas = localStorage.getItem(`ideas_${storedSessionId}`);
    if (storedIdeas) {
      setIdeas(JSON.parse(storedIdeas));
    }
    const storedSpec = localStorage.getItem(`specification_${storedSessionId}`);
    if (storedSpec) {
      setSpecification(storedSpec);
    }
  }, [searchParams, router]);

  const generateIdeas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/get_ideas');
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        console.warn('API call failed, using fallback ideas');
        data = fallbackIdeas;
      }
      
      const formattedIdeas = Object.values(data) as string[];

      setIdeas(formattedIdeas);
      
      localStorage.setItem(`ideas_${sessionId}`, JSON.stringify(formattedIdeas));
      localStorage.setItem(`specification_${sessionId}`, specification);
    } catch (err) {
      console.error('Error fetching ideas:', err);
      const formattedIdeas = Object.values(fallbackIdeas);
      setIdeas(formattedIdeas);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJudgeIdeas = () => {
    router.push(`/judging-results?session=${sessionId}`);
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
        <Button onClick={generateIdeas} disabled={isLoading} className="mr-2">
          {isLoading ? 'Generating...' : 'Generate Ideas'}
        </Button>
        {ideas.length > 0 && (
          <Button onClick={handleJudgeIdeas}>Judge Ideas</Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea, index) => (
          <Card key={index}>
            <CardHeader>Idea {index + 1}</CardHeader>
            <CardContent>
              <p>{idea}</p>
            </CardContent>
            <CardFooter>
              <Link 
                href={`/chat?session=${sessionId}&initialMessage=${encodeURIComponent(specification)}&idea=${encodeURIComponent(idea)}`}
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