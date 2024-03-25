"use client"

import ChatComponent from './ChatComponent';
import React, { useState } from 'react';

const App: React.FC = () => {
  // State management for input fields
  const [vorname, setVorname] = useState<string>(''); // State for first name
  const [nachname, setNachname] = useState<string>(''); // State for last name

  // Handler function to update form fields based on chat function calls
  const handleFormChange = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'vorname': // Directly match the field name for clarity
        setVorname(value);
        break;
      case 'nachname': // Directly match the field name for clarity
        setNachname(value);
        break;
      default:
        console.warn(`Unbekanntes Feld: ${fieldName}`);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left side: Input fields for Vorname and Nachname */}
      <div className="flex-1 p-5">
        <h1 className="text-xl font-bold mb-5">User Information</h1>
        <div className="mb-4">
          <label htmlFor="vorname" className="block text-sm font-medium text-gray-700">Vorname</label>
          <input 
            type="text"
            id="vorname"
            value={vorname}
            onChange={(e) => setVorname(e.target.value)}
            placeholder="Enter your first name"
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nachname" className="block text-sm font-medium text-gray-700">Nachname</label>
          <input 
            type="text"
            id="nachname"
            value={nachname}
            onChange={(e) => setNachname(e.target.value)}
            placeholder="Enter your last name"
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
      </div>

      {/* Right side: Chat Component */}
      <div className="flex-1 p-5 border-l border-gray-300">
        <ChatComponent onFormChange={handleFormChange} />
      </div>
    </div>
  );
}

export default App;