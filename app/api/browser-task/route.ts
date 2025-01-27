import { NextResponse } from 'next/server';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Agent } from '@/lib/browser-agent';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { task, apiKey, model, headless } = await request.json();

    // Validate inputs
    if (!task || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize the agent
    const agent = new Agent({
      task,
      llm: new ChatOpenAI({
        modelName: model,
        openAIApiKey: apiKey,
      }),
    });

    // Run the task
    const result = await agent.run();

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
