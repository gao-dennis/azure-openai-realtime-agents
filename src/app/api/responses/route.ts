import { NextRequest, NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';

// Proxy endpoint for the Azure OpenAI Responses API
export async function POST(req: NextRequest) {
  const body = await req.json();
  
  const openai = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiVersion: '2024-08-01-preview',
  });

  if (body.text?.format?.type === 'json_schema') {
    return await structuredResponse(openai, body);
  } else {
    return await textResponse(openai, body);
  }
}

async function structuredResponse(openai: AzureOpenAI, body: any) {
  try {
    console.log('structuredResponse', body);
    const response = await openai.chat.completions.create({
      model: body.model || 'gpt-4.1', // Use model from request body
      messages: body.messages || body.input || [],
      tools: body.tools?.length > 0 ? body.tools.map((tool: any) => ({
        type: "function",
        function: tool.function || tool
      })) : undefined,
      stream: false,
      response_format: body.text?.format ? {
        type: "json_schema",
        json_schema: {
          name: body.text.format.name || "response",
          schema: body.text.format.schema || body.text.format
        }
      } : undefined,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    console.error('responses proxy error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 }); 
  }
}

async function textResponse(openai: AzureOpenAI, body: any) {
  try {
    console.log('textResponse', body);
    const response = await openai.chat.completions.create({
      model: body.model || 'gpt-4.1', // Use model from request body
      messages: body.messages || body.input || [],
      tools: body.tools?.length > 0 ? body.tools.map((tool: any) => ({
        type: "function",
        function: tool.function || tool
      })) : undefined,
      stream: false,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    console.error('responses proxy error', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}