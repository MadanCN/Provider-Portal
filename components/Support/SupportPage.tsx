
import React, { useState } from 'react';
import { 
  Search, ChevronDown, ChevronUp, FileText, Plus, ExternalLink, 
  MessageCircle, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { MOCK_TICKETS } from '../../constants';
import { SupportTicket } from '../../types';

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Submit Ticket' | 'My Tickets' | 'FAQ'>('Submit Ticket');
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState('Low');
  const [description, setDescription] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: SupportTicket = {
      id: `tk${Date.now()}`,
      subject,
      category,
      priority: priority as any,
      status: 'Open',
      createdAt: new Date().toLocaleDateString(),
      lastUpdated: 'Just now'
    };
    setTickets([newTicket, ...tickets]);
    setActiveTab('My Tickets');
    alert('Ticket submitted successfully!');
    // Reset form
    setSubject('');
    setDescription('');
  };

  const faqs = [
    { q: "How do I reset my EPCS token?", a: "To reset your EPCS token, go to Settings > Security > Two-Factor Authentication and click 'Configure'. You will need to verify your identity again." },
    { q: "Can I customize my dashboard?", a: "Yes! Click the 'Customize Dashboard' button on the top right of the dashboard home. You can drag and drop widgets, resize them, or hide/show specific panels." },
    { q: "How do I start a Telehealth visit?", a: "Navigate to the Telehealth module, find the patient in the 'Upcoming Sessions' or 'Waiting Room' list, and click 'Admit' or 'Join Session'." },
    { q: "Where can I find patient insurance authorization?", a: "Go to the Patient's profile, click the 'Insurance' tab. Authorizations are listed below the primary insurance card." },
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Support Center</h2>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-fit mb-8 shadow-sm">
          {['Submit Ticket', 'My Tickets', 'FAQ'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab 
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm ring-1 ring-primary-200 dark:ring-primary-800' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[400px]">
          
          {/* Submit Ticket Tab */}
          {activeTab === 'Submit Ticket' && (
            <div className="p-8 max-w-2xl">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Create New Support Request</h3>
              <form onSubmit={handleTicketSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Brief summary of the issue"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                    >
                      <option>General</option>
                      <option>IT Support</option>
                      <option>Billing</option>
                      <option>Clinical</option>
                      <option>Feature Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                    <select 
                      value={priority}
                      onChange={e => setPriority(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent min-h-[150px] focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Please provide detailed steps to reproduce the issue..."
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2">
                    <Plus size={18} /> Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === 'My Tickets' && (
            <div className="flex flex-col h-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">ID</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Subject</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Category</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Priority</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                      <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tickets.map(ticket => (
                      <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-mono text-slate-500">{ticket.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{ticket.subject}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ticket.category}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                            ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${
                            ticket.status === 'Resolved' ? 'text-green-600' : 
                            ticket.status === 'Open' ? 'text-blue-600' : 'text-slate-500'
                          }`}>
                            {ticket.status === 'Resolved' && <CheckCircle size={14} />}
                            {ticket.status === 'Open' && <AlertCircle size={14} />}
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{ticket.lastUpdated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {tickets.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No tickets found.</p>
                </div>
              )}
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'FAQ' && (
            <div className="p-8 max-w-3xl mx-auto space-y-6">
               <div className="relative mb-8">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                     type="text" 
                     placeholder="Search frequently asked questions..." 
                     className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
               </div>
               
               <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                     <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button 
                           onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                           className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                        >
                           <span className="font-semibold text-slate-800 dark:text-slate-200">{faq.q}</span>
                           {openFaq === idx ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>
                        {openFaq === idx && (
                           <div className="p-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700">
                              {faq.a}
                           </div>
                        )}
                     </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <MessageCircle className="text-blue-600" size={24} />
                     <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-100">Still need help?</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Our support team is available 24/7.</p>
                     </div>
                  </div>
                  <button onClick={() => setActiveTab('Submit Ticket')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Contact Us</button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SupportPage;
