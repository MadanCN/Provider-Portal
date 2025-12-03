
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, Phone, ExternalLink, HelpCircle, FileText } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I reset my EPCS token?", a: "To reset your EPCS token, go to Settings > Security > Two-Factor Authentication and click 'Configure'. You will need to verify your identity again." },
    { q: "Can I customize my dashboard?", a: "Yes! Click the 'Customize Layout' button on the top right of the dashboard. You can drag and drop widgets, resize them, or hide/show specific panels." },
    { q: "How do I start a Telehealth visit?", a: "Navigate to the Telehealth module, find the patient in the 'Upcoming Sessions' or 'Waiting Room' list, and click 'Admit' or 'Join Session'." },
    { q: "Where can I find patient insurance authorization?", a: "Go to the Patient's profile, click the 'Insurance' tab. Authorizations are listed below the primary insurance card." },
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center py-8">
           <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">How can we help you?</h2>
           <div className="max-w-xl mx-auto relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                 type="text" 
                 placeholder="Search for articles, guides, and more..." 
                 className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Quick Links */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <FileText size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Documentation</h3>
              <p className="text-sm text-slate-500 mb-4">Detailed guides on billing, clinical notes, and admin tools.</p>
              <span className="text-sm text-primary-600 font-medium flex items-center gap-1">Read Docs <ExternalLink size={14}/></span>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <HelpCircle size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Tutorials</h3>
              <p className="text-sm text-slate-500 mb-4">Video walkthroughs for common workflows and features.</p>
              <span className="text-sm text-primary-600 font-medium flex items-center gap-1">Watch Videos <ExternalLink size={14}/></span>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <Phone size={24} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Contact Support</h3>
              <p className="text-sm text-slate-500 mb-4">Need urgent help? Reach out to our 24/7 support team.</p>
              <span className="text-sm text-primary-600 font-medium flex items-center gap-1">Get Help <ExternalLink size={14}/></span>
           </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
           <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h3>
           </div>
           <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {faqs.map((faq, idx) => (
                 <div key={idx} className="p-4">
                    <button 
                       onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                       className="w-full flex justify-between items-center text-left focus:outline-none"
                    >
                       <span className="font-medium text-slate-700 dark:text-slate-200">{faq.q}</span>
                       {openFaq === idx ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>
                    {openFaq === idx && (
                       <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-1">
                          {faq.a}
                       </p>
                    )}
                 </div>
              ))}
           </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Send us a message</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Your Name" className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-transparent" />
              <input type="email" placeholder="Email Address" className="p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-transparent" />
           </div>
           <textarea placeholder="Describe your issue..." className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-transparent min-h-[120px] mb-4"></textarea>
           <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm transition">Send Message</button>
        </div>

        {/* System Status */}
        <div className="text-center text-sm text-slate-500">
           <p className="flex items-center justify-center gap-2">
              System Status: <span className="flex items-center gap-1 text-green-600 font-bold"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Operational</span>
           </p>
           <p className="mt-1">Version 2.4.0 • Build 8821a</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
