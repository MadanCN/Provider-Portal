
import React from 'react';
import { 
  Mail, Phone, MapPin, Award, FileText, Shield, Calendar, Edit2 
} from 'lucide-react';

const UserProfile: React.FC = () => {
  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900">
      
      {/* Profile Header */}
      <div className="relative mb-20">
         <div className="h-48 w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md"></div>
         <div className="absolute -bottom-14 left-8 flex items-end">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-white shadow-lg flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden">
               {/* Placeholder Avatar */}
               <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">DS</div>
            </div>
            <div className="mb-4 ml-4">
               <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dr. David Smith, MD</h1>
               <p className="text-slate-500 font-medium">Internal Medicine • Primary Care</p>
            </div>
         </div>
         <div className="absolute bottom-4 right-8">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-lg font-medium transition">
               <Edit2 size={16} /> Edit Profile
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column */}
         <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 uppercase text-xs tracking-wider">Contact Information</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                     <Mail className="text-slate-400" size={18} />
                     <span className="text-slate-600 dark:text-slate-300">dr.smith@practmd.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                     <Phone className="text-slate-400" size={18} />
                     <span className="text-slate-600 dark:text-slate-300">(555) 123-4567</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                     <MapPin className="text-slate-400 mt-0.5" size={18} />
                     <span className="text-slate-600 dark:text-slate-300">
                        Springfield Medical Center<br/>
                        123 Healthcare Blvd, Suite 100<br/>
                        Springfield, IL 62704
                     </span>
                  </div>
               </div>
            </div>

            {/* Credentials */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 uppercase text-xs tracking-wider">Credentials & Identifiers</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-700 pb-2">
                     <span className="text-slate-500">NPI Number</span>
                     <span className="font-mono font-medium text-slate-800 dark:text-white">1234567890</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-700 pb-2">
                     <span className="text-slate-500">DEA Number</span>
                     <span className="font-mono font-medium text-slate-800 dark:text-white">BS1234567</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 dark:border-slate-700 pb-2">
                     <span className="text-slate-500">State License</span>
                     <span className="font-mono font-medium text-slate-800 dark:text-white">MD-554422</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                     <span className="text-slate-500">Specialty Board</span>
                     <span className="font-medium text-green-600 flex items-center gap-1">Certified <Shield size={12}/></span>
                  </div>
               </div>
            </div>
         </div>

         {/* Middle/Right Column */}
         <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-3">Professional Biography</h3>
               <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Dr. David Smith is a board-certified internist with over 15 years of experience in primary care and hospital medicine. He received his medical degree from Johns Hopkins University School of Medicine and completed his residency at Massachusetts General Hospital. Dr. Smith has a special interest in preventive cardiology and diabetes management. He is committed to providing patient-centered care and leveraging technology to improve health outcomes.
               </p>
               <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full">Internal Medicine</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full">Preventive Care</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full">Diabetes Management</span>
               </div>
            </div>

            {/* Statistics / Recent Activity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                     <Calendar size={24} />
                  </div>
                  <div>
                     <p className="text-2xl font-bold text-slate-800 dark:text-white">1,240</p>
                     <p className="text-xs text-slate-500 uppercase">Patient Visits (YTD)</p>
                  </div>
               </div>
               <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                     <Award size={24} />
                  </div>
                  <div>
                     <p className="text-2xl font-bold text-slate-800 dark:text-white">4.9/5</p>
                     <p className="text-xs text-slate-500 uppercase">Patient Rating</p>
                  </div>
               </div>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4">Education & Training</h3>
               <div className="space-y-4">
                  <div className="flex gap-4">
                     <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center font-bold text-slate-500">JH</div>
                     <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Johns Hopkins University</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Doctor of Medicine (MD)</p>
                        <p className="text-xs text-slate-500">2004 - 2008</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center font-bold text-slate-500">MGH</div>
                     <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">Massachusetts General Hospital</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Residency, Internal Medicine</p>
                        <p className="text-xs text-slate-500">2008 - 2011</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default UserProfile;
