import React from 'react';
import { FunctionCallHandler, nanoid } from 'ai';
import { Message, useChat } from 'ai/react';

// Define a new interface for the component props to include the callback
interface ChatComponentProps {
  onFormChange?: (fieldName: string, value: string) => void; // Optional callback prop
}

const ChatComponent: React.FC<ChatComponentProps> = ({ onFormChange }) => {
  const functionCallHandler: FunctionCallHandler = async (
    chatMessages,
    functionCall,
  ) => {
    // Handle "change_form" function call
    if (functionCall.name === 'change_form') {
      if (functionCall.arguments && onFormChange) {
        const args = JSON.parse(functionCall.arguments);
        const { fieldName, value } = args;
        onFormChange(fieldName, value); // Invoke the callback with the field name and new value

        // Optionally, add a response to chat messages indicating the form was updated
        const formUpdateResponse = {
          messages: [
            ...chatMessages,
            {
              id: nanoid(),
              name: 'form_update_response',
              role: 'system' as const,
              content: `The ${fieldName} was updated to ${value}.`,
            },
          ],
        };
        return formUpdateResponse;
      }
    }
    // Continue handling other function calls as before
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat-with-functions',
    experimental_onFunctionCall: functionCallHandler,
  });

  const roleToColorMap: Record<Message['role'], string> = {
    system: 'red',
    user: 'black',
    function: 'blue',
    assistant: 'green',
    data: 'orange', 
    tool: 'purple',
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0
        ? messages.map((m: Message) => (
            <div
              key={m.id}
              className="whitespace-pre-wrap"
              style={{ color: roleToColorMap[m.role] }}
            >
              <strong>{`${m.role}: `}</strong>
              {m.content || JSON.stringify(m.function_call)}
              <br />
              <br />
            </div>
          ))
        : null}
      <form onSubmit={handleSubmit} className="mt-auto">
        <input
          className="w-full p-2 mb-8 border border-gray-300 rounded-lg shadow-sm"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          style={{ position: 'relative', bottom: 'initial', maxWidth: 'none' }}
        />
      </form>
    </div>
  );
}

export default ChatComponent;
