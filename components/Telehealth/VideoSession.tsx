
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Share, Monitor, X, Send, FileText, ChevronRight, ChevronLeft,
  Layout, Maximize2
} from 'lucide-react';
import { MOCK_CHAT_HISTORY } from '../../constants';

const VideoSession: React.FC = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [chatMessage, setChatMessage] = useState('');

  const endCall = () => {
    if (confirm("End session with patient?")) {
      navigate('/telehealth');
    }
  };

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-slate-800/80 backdrop-blur flex justify-between items-center px-4 border-b border-slate-700 shrink-0">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="font-mono text-sm">00:14:23</span>
            <div className="h-4 w-px bg-slate-600 mx-1"></div>
            <span className="font-bold">Steve Rogers</span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">Mental Health Check</span>
         </div>
         <div className="flex items-center gap-2">
            <button 
               onClick={() => setShowNotes(!showNotes)}
               className={`p-2 rounded hover:bg-slate-700 transition ${showNotes ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
               title="Toggle Notes"
            >
               <FileText size={18} />
            </button>
            <button className="p-2 rounded hover:bg-slate-700 transition text-slate-400" title="Maximize">
               <Maximize2 size={18} />
            </button>
         </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
         {/* Video Area */}
         <div className="flex-1 relative bg-black flex items-center justify-center">
            {/* Patient Video Placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-slate-800 relative">
               <div className="text-center opacity-50">
                  <span className="text-6xl">👤</span>
                  <p className="mt-4 text-xl">Patient Video Stream</p>
               </div>
               
               {/* Self View (PIP) */}
               <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-900 border border-slate-700 rounded shadow-lg flex items-center justify-center overflow-hidden">
                  {!isVideoOff ? (
                     <span className="text-4xl">👨‍⚕️</span>
                  ) : (
                     <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-500 text-xs">Camera Off</div>
                  )}
                  {isMuted && <div className="absolute top-2 right-2 bg-red-600 p-1 rounded-full"><MicOff size={10} /></div>}
               </div>
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/90 p-3 rounded-full border border-slate-700 shadow-xl backdrop-blur">
               <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}
               >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
               </button>
               <button 
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-full transition ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}
               >
                  {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
               </button>
               <button className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 transition" title="Share Screen">
                  <Monitor size={20} />
               </button>
               <button 
                  onClick={() => setShowChat(!showChat)}
                  className={`p-3 rounded-full transition ${showChat ? 'bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600'}`}
               >
                  <MessageSquare size={20} />
               </button>
               <button 
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition ml-2" title="End Call"
               >
                  <PhoneOff size={20} />
               </button>
            </div>
         </div>

         {/* Side Panel (Notes + Chat) */}
         {(showNotes || showChat) && (
            <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col text-slate-900 dark:text-white transition-all">
               {/* Panel Header Toggle if both are active, or just section title */}
               <div className="flex border-b border-slate-200 dark:border-slate-700">
                  {showNotes && (
                     <button className="flex-1 py-3 text-sm font-bold border-b-2 border-indigo-500 bg-slate-50 dark:bg-slate-800">
                        Clinical Note
                     </button>
                  )}
                  {showChat && (
                     <button className={`flex-1 py-3 text-sm font-bold ${!showNotes ? 'border-b-2 border-indigo-500 bg-slate-50 dark:bg-slate-800' : 'text-slate-500 border-b border-transparent'}`}>
                        Chat
                     </button>
                  )}
               </div>

               <div className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-slate-900">
                  {showNotes && (
                     <div className="p-4 space-y-4">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                           <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Subjective</label>
                           <textarea className="w-full text-sm p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent h-24" placeholder="Patient reports..." />
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                           <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Assessment</label>
                           <textarea className="w-full text-sm p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent h-20" placeholder="Assessment..." />
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                           <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Plan</label>
                           <textarea className="w-full text-sm p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent h-24" placeholder="Plan details..." />
                        </div>
                     </div>
                  )}

                  {/* Chat Overlay or Separate View - Simplified for this layout */}
                  {showChat && !showNotes && (
                     <div className="flex flex-col h-full">
                        <div className="flex-1 p-4 space-y-3">
                           {MOCK_CHAT_HISTORY.map(msg => (
                              <div key={msg.id} className={`flex flex-col ${msg.sender === 'Provider' ? 'items-end' : 'items-start'}`}>
                                 <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                                    msg.sender === 'Provider' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : msg.sender === 'System' 
                                       ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-center w-full italic'
                                       : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                                 }`}>
                                    {msg.text}
                                 </div>
                                 {msg.sender !== 'System' && <span className="text-[10px] text-slate-400 mt-1">{msg.timestamp}</span>}
                              </div>
                           ))}
                        </div>
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                           <div className="flex gap-2">
                              <input 
                                 type="text" 
                                 value={chatMessage}
                                 onChange={(e) => setChatMessage(e.target.value)}
                                 placeholder="Type a message..."
                                 className="flex-1 text-sm p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-900"
                              />
                              <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                 <Send size={16} />
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default VideoSession;