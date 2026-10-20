import React, { useState useMemo } from 'react';

type Step = 'CONTENTCURATOR' | 'DIFFICULTYADAPTER' | 'PROGRESSTRACKER' | 'QUESTIONGENERATOR' | 'WEAKNESSANALYSER' | 'DONE';

export default function App() { 
const [currentStep, setCurrentStep] = useState<Step>('CONTENTCURATOR'); 

 // useMemo caches this array calculation, saving main-thread execution time
  const stepsList = useMemo(() => [
    'CONTENTCURATOR', 
    'DIFFICULTYADAPTER', 
    'PROGRESSTRACKER', 
    'QUESTIONGENERATOR', 
    'WEAKNESSANALYSER', 
    'DONE'
  ], []); 
  
  
  
 return (
   <div className="p-6 bg-coffee-900 text-white min-h-screen"> 
<h1 className="text-2xl font-bold mb-4">🤖 Multi-Agent Debugger</h1> 
  
   {/* Visual Pipeline Progress Bar */} <div className="flex gap-2 mb-6 text-sm"> {['CONTENTCURATOR', 'DIFFICULTYADAPTER', 'PROGRESSTRACKER','QUESTIONGENERATOR', 'WEAKNESSANALYSER','DONE'].map((step) => ( <div key={step} className={`p-2 rounded flex-1 text-center font-bold ${ currentStep === step ? 'bg-coffee-600 text-white' : 'bg-coffee-800 text-white-400' }`} > {step} </div> ))} </div> 
  
    {/* Conditional Agent View Screen */} <div className="bg-coffee-800 p-6 rounded-lg border border-brass-700 min-h-[200px]"> {currentStep === 'CONTENTCURATOR' && ( <div> <h2 className="text-xl font-bold mb-2">🚨 CONTENTCURATOR Agent Active</h2> <p className="text-lemon-300 mb-4">Analyzing issue severity and assigning components...</p> <button onClick={() => setCurrentStep('CONTENTCURATOR')} className="bg-coffee-500 px-4 py-2 rounded font-medium"> Pass to Difficulty Adapter Agent ➔ </button> </div> )}
  {currentStep === 'DIFFICULTYADAPTER' && ( <div> <h2 className="text-xl font-bold mb-2">🔍 Inspector Agent Active</h2> <p className="text-coffee-300 mb-4">Scanning file tokens for TypeScript build blockers...</p> 
    <button onClick={() => setCurrentStep('DIFFICULTYADAPTER')} className="bg-coffee-500 px-4 py-2 rounded font-medium"> Pass to Progress Tracker Agent ➔ </button> </div>
   {currentStep === 'PROGRESSTRACKER' && ( <div> <h2 className="text-xl font-bold mb-2">🔍 Progress Tracker Agent Active</h2>
   <p className="text-coffee-300 mb-4">Scanning file tokens for TypeScript build blockers...</p> 
   <button onClick={() => setCurrentStep('PROGRESSTRACKER')} className="bg-coffee-500 px-4 py-2 rounded font-medium"> Pass to Question Generator Agent ➔ </button> </div>
    {currentStep === 'QUESTIONGENERATOR' && ( <div> <h2 className="text-xl font-bold mb-2">🔍 Inspector Agent Active</h2> <p className="text-coffee-300 mb-4">Scanning file tokens for TypeScript build blockers...</p> <button onClick={() => setCurrentStep('QUESTIONGENERATOR')} className="bg-coffee-500 px-4 py-2 rounded font-medium"> Pass to Weakness Analyser Agent ➔ </button> </div> 
    {currentStep === 'WEAKNESSANALYSER' && (<div> <h2 className="text-xl font-bold mb-2">🔍 Weakness Analyser Agent Active</h2> 
      <p className="text-coffee-300 mb-4">Scanning file tokens for TypeScript build blockers...</p> <button onClick={() => setCurrentStep('WEAKNESSANALYSER')} className="bg-coffee-500 px-4 py-2 rounded font-medium"> Pass to Done ➔ </button> </div> </div> </div> );}
