import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Plus, ChevronDown, ChevronUp, User, 
  Calendar, Phone, Mail, MoreHorizontal, FileText, ArrowUpDown
} from 'lucide-react';
import { MOCK_PATIENTS } from '../../constants';
import { Patient } from '../../types';

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'New Patient' | 'Follow Up'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Patient; direction: 'asc' | 'desc' } | null>(null);

  const filteredPatients = useMemo(() => {
    let result = MOCK_PATIENTS.filter(p => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${p.firstName} ${p.lastName} ${p.preferredName || ''}`.toLowerCase();
      const matchesSearch = fullName.includes(searchLower) || 
                            p.email.toLowerCase().includes(searchLower) || 
                            p.phone.includes(searchLower);
      const matchesType = filterType === 'All' || p.type === filterType;
      return matchesSearch && matchesType;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchTerm, filterType, sortConfig]);

  const handleSort = (key: keyof Patient) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Patients</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage patient directory and profiles</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-sm">
          <Plus size={16} />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-700 dark:text-slate-200"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="New Patient">New Patient</option>
              <option value="Follow Up">Follow Up</option>
            </select>
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('firstName')}>
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <ArrowUpDown size={14} className="opacity-50" />
                  </div>
                </th>
                <th className="px-6 py-4">DOB</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('registrationDate')}>
                  <div className="flex items-center space-x-1">
                    <span>Reg. Date</span>
                    <ArrowUpDown size={14} className="opacity-50" />
                  </div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map(patient => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 transition-colors">
                          {patient.lastName}, {patient.firstName} {patient.preferredName && `(${patient.preferredName})`}
                        </p>
                        <p className="text-xs text-slate-500">MRN: {patient.mrn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{new Date(patient.dob).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-slate-400" />
                        <span className="text-xs">{patient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-xs truncate max-w-[150px]">{patient.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{new Date(patient.registrationDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.type === 'New Patient' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {patient.type}
                      </span>
                      {patient.insuranceStatus === 'Verified' ? (
                         <span className="text-[10px] text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Ins. Verified</span>
                      ) : (
                         <span className="text-[10px] text-red-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Check Insurance</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center">
                       <User size={48} className="mb-4 opacity-30" />
                       <p>No patients found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Static) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
           <span>Showing 1-{filteredPatients.length} of {filteredPatients.length} patients</span>
           <div className="flex space-x-2">
             <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Previous</button>
             <button className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;