// lib/fileOperations.ts
import fs from 'fs/promises';
import path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'data', 'messages');

export async function saveMessages(id: string, messages: any[]) {
  await fs.mkdir(MESSAGES_DIR, { recursive: true });
  const filePath = path.join(MESSAGES_DIR, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(messages, null, 2));
}

export async function loadMessages(id: string): Promise<any[]> {
  const filePath = path.join(MESSAGES_DIR, `${id}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading messages for ID ${id}:`, error);
    return [];
  }
}

export async function generateUniqueId(): Promise<string> {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${timestamp}-${randomNum}`;
}