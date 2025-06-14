import { zodTextFormat } from 'openai/helpers/zod';
import { GuardrailOutputZod, GuardrailOutput } from '@/app/types';

export async function runGuardrailClassifier(
  message: string,
): Promise<GuardrailOutput> {
  const messages = [
    {
      role: 'user',
      content: `You are an expert at classifying text according to moderation policies. Consider the provided message, analyze potential classes from output_classes, and output the best classification. Output json, following the provided schema. Keep your analysis and reasoning short and to the point, maximum 2 sentences.

      <info>
      - Company name: newTelco, or Snowy Peak Boards
      </info>

      <message>
      ${message}
      </message>

      <output_classes>
      - OFFENSIVE: Content that includes hate speech, discriminatory language, insults, slurs, or harassment.
      - OFF_BRAND: Content that discusses competitors in a disparaging way.
      - VIOLENCE: Content that includes explicit threats, incitement of harm, or graphic descriptions of physical injury or violence.
      - NONE: If no other classes are appropriate and the message is fine.
      </output_classes>
      `,
    },
  ];

  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      input: messages,
      text: {
        format: zodTextFormat(GuardrailOutputZod, 'output_format'),
      },
    }),
  });

  if (!response.ok) {
    console.warn('Server returned an error:', response);
    return Promise.reject('Error with runGuardrailClassifier.');
  }

  const data = await response.json();
  console.log('Full response data:', JSON.stringify(data, null, 2));

  try {
    // Handle different response formats
    let parsedContent;
    if (data.output_parsed) {
      console.log('Using output_parsed:', data.output_parsed);
      parsedContent = data.output_parsed;
    } else if (data.choices?.[0]?.message?.content) {
      console.log('Using message content:', data.choices[0].message.content);
      const contentStr = data.choices[0].message.content;
      
      // Safely parse JSON with better error handling
      if (typeof contentStr !== 'string') {
        throw new Error('Message content is not a string');
      }
      
      if (contentStr.trim().length === 0) {
        throw new Error('Message content is empty');
      }
      
      try {
        parsedContent = JSON.parse(contentStr);
      } catch (jsonError) {
        console.error('JSON parsing failed:', jsonError);
        console.error('Raw content that failed to parse:', contentStr);
        throw new Error(`Invalid JSON in API response: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`);
      }
    } else {
      console.error('No parseable content found. Available keys:', Object.keys(data));
      throw new Error('No parseable content found in response');
    }
    
    console.log('Parsed content before Zod validation:', parsedContent);
    const output = GuardrailOutputZod.parse(parsedContent);
    return output;
  } catch (error) {
    console.error('Error parsing the message content as GuardrailOutput:', error);
    console.error('Raw response data:', data);
    return Promise.reject('Failed to parse guardrail output.');
  }
}
