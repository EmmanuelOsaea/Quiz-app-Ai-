import React, { useState } from 'react';

type Step = 'TRIAGE' | 'INSPECT' | 'SUMMARIZE' | 'PROPOSE' | 'VALIDATE' | 'DONE';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('TRIAGE');

  return (
    <div className="p-6 bg-lemon-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🤖 Multi-Agent Debugger</h1>
      
      {/* Visual Pipeline Progress Bar */}
      <div className="flex gap-2 mb-6 text-sm">
        {['TRIAGE', 'INSPECT', 'SUMMARIZE', 'PROPOSE', 'VALIDATE'].map((step) => (
          <div 
            key={step} 
            className={`p-2 rounded flex-1 text-center font-bold ${
              currentStep === step ? 'bg-blue-600 text-white' : 'bg-lemon-800 text-lemon-400'
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Conditional Agent View Screen */}
      <div className="bg-lemon-800 p-6 rounded-lg border border-slate-700 min-h-[200px]">
        {currentStep === 'TRIAGE' && (
          <div>
            <h2 className="text-xl font-bold mb-2">🚨 Triage Agent Active</h2>
            <p className="text-lemon-300 mb-4">Analyzing issue severity and assigning components...</p>
            <button onClick={() => setCurrentStep('INSPECT')} className="bg-blue-500 px-4 py-2 rounded font-medium">
              Pass to Inspector Agent ➔
            </button>
          </div>
        )}

        {currentStep === 'INSPECT' && (
          <div>
            <h2 className="text-xl font-bold mb-2">🔍 Inspector Agent Active</h2>
            <p className="text-lemon-300 mb-4">Scanning file tokens for TypeScript build blockers...</p>
            <button onClick={() => setCurrentStep('SUMMARIZE')} className="bg-blue-500 px-4 py-2 rounded font-medium">
              Pass to Summarizer Agent ➔
            </button>
          </div>
        )}

        {/* Repeat simple blocks for SUMMARIZE, PROPOSE, and VALIDATE */}
      </div>
    </div>
  );
}
