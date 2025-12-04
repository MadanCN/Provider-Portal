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
        // Fix: Use nullish coalescing to handle potential undefined values for optional fields
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
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
          <h2 className="text-2xl font-bold text-grey-800 dark:text-white">Patients</h2>
          <p className="text-sm text-grey-500 dark:text-grey-400">Manage patient directory and profiles</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-sm">
          <Plus size={16} />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="bg-white dark:bg-grey-800 rounded-xl shadow-sm border border-grey-200 dark:border-grey-700 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-grey-200 dark:border-grey-700 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-grey-50 dark:bg-grey-900 border border-grey-200 dark:border-grey-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-grey-700 dark:text-grey-200"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 bg-grey-50 dark:bg-grey-900 border border-grey-200 dark:border-grey-700 rounded-lg text-sm text-grey-700 dark:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="New Patient">New Patient</option>
              <option value="Follow Up">Follow Up</option>
            </select>
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-grey-600 dark:text-grey-400">
            <thead className="bg-grey-50 dark:bg-grey-800/50 uppercase tracking-wider font-semibold border-b border-grey-200 dark:border-grey-700">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-grey-100 dark:hover:bg-grey-800 transition" onClick={() => handleSort('firstName')}>
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <ArrowUpDown size={14} className="opacity-50" />
                  </div>
                </th>
                <th className="px-6 py-4">DOB</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-grey-100 dark:hover:bg-grey-800 transition" onClick={() => handleSort('registrationDate')}>
                  <div className="flex items-center space-x-1">
                    <span>Reg. Date</span>
                    <ArrowUpDown size={14} className="opacity-50" />
                  </div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100 dark:divide-grey-800">
              {filteredPatients.map(patient => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-grey-50 dark:hover:bg-grey-800/30 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-grey-800 dark:text-grey-200 group-hover:text-primary-600 transition-colors">
                          {patient.lastName}, {patient.firstName} {patient.preferredName && `(${patient.preferredName})`}
                        </p>
                        <p className="text-xs text-grey-500">MRN: {patient.mrn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{new Date(patient.dob).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-grey-400" />
                        <span className="text-xs">{patient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-grey-400" />
                        <span className="text-xs truncate max-w-[150px]">{patient.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{new Date(patient.registrationDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.type === 'New Patient' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      }`}>
                        {patient.type}
                      </span>
                      {patient.insuranceStatus === 'Verified' ? (
                         <span className="text-[10px] text-success-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success-500"></span>Ins. Verified</span>
                      ) : (
                         <span className="text-[10px] text-error-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-error-500"></span>Check Insurance</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-grey-400 hover:text-grey-600 dark:hover:text-grey-200 hover:bg-grey-100 dark:hover:bg-grey-700 rounded-full transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-grey-500 dark:text-grey-400">
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
        <div className="p-4 border-t border-grey-200 dark:border-grey-700 flex justify-between items-center text-xs text-grey-500">
           <span>Showing 1-{filteredPatients.length} of {filteredPatients.length} patients</span>
           <div className="flex space-x-2">
             <button className="px-3 py-1 border border-grey-300 dark:border-grey-600 rounded hover:bg-grey-50 dark:hover:bg-grey-800 disabled:opacity-50" disabled>Previous</button>
             <button className="px-3 py-1 border border-grey-300 dark:border-grey-600 rounded hover:bg-grey-50 dark:hover:bg-grey-800 disabled:opacity-50" disabled>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;