// app/api/judge/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Fireworks } from 'fireworks-js';

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { generatedCode } = await req.json();

    const client = new Fireworks(FIREWORKS_API_KEY);
    const response = await client.chat.completions.create({
      model: "accounts/fireworks/models/llama-v3p1-8b-instruct",
      messages: [{
        role: "system",
        content: `You are an AI based hackathon judge, knowledgeable in coding. Your judging criteria is as follows: 

        - Correctness of code
        - Quality of code
        - Real world impact of code
        - Creativity of coding solution

        Based on this, score the code from a scale of 1 to 10. Output this score and your reasoning in the following JSON format:
        {score: 'Suggest your score here', rubric: 'Abide by the judging criteria to create a rubric'}

        If you get 'Code has error', that means the hacker submitted buggy code, so you can give them a -1 for everything and justify it
        by saying their code is so terrible that it deserves a negative score.`
      },
      {
        role: "user",
        content: generatedCode
      }],
    });

    const judgement = response.choices[0].message.content;

    return NextResponse.json({ judgement });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while judging the code.' }, { status: 500 });
  }
}