import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Agent } from '../../lib/browser-agent';

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // specify regions as needed
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  try {
    const { task, apiKey, model, headless } = await req.json();

    // Validate inputs
    if (!task || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
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

    return new Response(
      JSON.stringify({ result }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
