import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from 'ai';
import OpenAI from 'openai';
import { ChatCompletionCreateParams } from "openai/resources/chat/index";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

// Define available form fields
const availableFormFields = ['vorname', 'nachname'];

const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'change_form',
    description: `Change the form fields based on user input. Available fields: ${availableFormFields.join(', ')}.`,
    parameters: {
      type: 'object',
      properties: {
        fieldName: {
          type: 'string',
          description: `The name of the form field to change. Available fields: ${availableFormFields.join(', ')}.`,
          enum: availableFormFields, // Specify available fields as enum options
        },
        value: {
          type: 'string',
          description: 'The new value for the form field.',
        },
      },
      required: ['fieldName', 'value'],
    },
  },
];

export async function POST(req: Request) {
  let { messages } = await req.json();

  console.log('Received messages:', messages);

  messages = [
    {
      role: 'system',
      content: 'You are a Helpful Assistant. Use the function call `change_form` to change form fields.',
    },
    ...messages,
  ];
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    stream: true,
    messages,
    functions,
  });

  const data = new experimental_StreamData();
  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      if (name === 'change_form') {
        console.log(`Handling change_form for ${args.fieldName} to ${args.value}`);
        // Here, you could add additional logic, such as validation or more complex handling based on fieldName
      }
    },
    onCompletion(completion) {
      console.log('completion', completion);
    },
    onFinal(completion) {
      data.close();
    },
    experimental_streamData: true,
  });

  data.append({
    text: 'Hello, how are you?',
  });

  return new StreamingTextResponse(stream, {}, data);
}