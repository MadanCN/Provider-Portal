
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mic, Wifi, CheckCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

const TechCheck: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Browser, 2: Cam/Mic, 3: Network, 4: Complete
  const [checking, setChecking] = useState(false);

  const simulateCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setStep(prev => prev + 1);
    }, 1500);
  };

  useEffect(() => {
    if (step < 4) simulateCheck();
  }, [step]);

  const renderStatus = (s: number) => {
    if (step > s) return <CheckCircle className="text-green-500" size={24} />;
    if (step === s) return <RefreshCw className="text-blue-500 animate-spin" size={24} />;
    return <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700"></div>;
  };

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
         <div className="p-8 text-center border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">System Check</h2>
            <p className="text-slate-500">Verifying your device readiness for telehealth...</p>
         </div>
         
         <div className="p-8 space-y-6">
            <div className={`flex items-center justify-between p-4 rounded-xl border ${step >= 2 ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}>
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded shadow-sm">
                     <Camera size={20} className="text-slate-700 dark:text-slate-300" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800 dark:text-white">Browser & Camera</h4>
                     <p className="text-xs text-slate-500">Permissions and compatibility</p>
                  </div>
               </div>
               {renderStatus(1)}
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl border ${step >= 3 ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}>
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded shadow-sm">
                     <Mic size={20} className="text-slate-700 dark:text-slate-300" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800 dark:text-white">Microphone & Audio</h4>
                     <p className="text-xs text-slate-500">Input levels and speaker output</p>
                  </div>
               </div>
               {renderStatus(2)}
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl border ${step >= 4 ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900' : 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'}`}>
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded shadow-sm">
                     <Wifi size={20} className="text-slate-700 dark:text-slate-300" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800 dark:text-white">Network Connection</h4>
                     <p className="text-xs text-slate-500">Speed and latency test</p>
                  </div>
               </div>
               {renderStatus(3)}
            </div>
         </div>

         {step === 4 && (
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 text-center animate-fade-in">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">You are ready!</h3>
               <p className="text-slate-500 mb-6">Your system is optimized for a high-quality video session.</p>
               <button 
                  onClick={() => navigate('/telehealth')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
               >
                  Go to Dashboard <ArrowRight size={18} />
               </button>
            </div>
         )}
      </div>
    </div>
  );
};

export default TechCheck;