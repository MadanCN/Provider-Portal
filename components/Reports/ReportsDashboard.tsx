
import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

const KPICard: React.FC<{ title: string; value: string; trend: string; isPositive: boolean; icon: React.ReactNode }> = ({ title, value, trend, isPositive, icon }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
  </div>
);

const ReportsDashboard: React.FC = () => {
  // Mock Data
  const volumeData = [
    { name: 'Jan', visits: 120, telehealth: 40 },
    { name: 'Feb', visits: 132, telehealth: 45 },
    { name: 'Mar', visits: 145, telehealth: 50 },
    { name: 'Apr', visits: 138, telehealth: 48 },
    { name: 'May', visits: 155, telehealth: 60 },
    { name: 'Jun', visits: 170, telehealth: 75 },
  ];

  const revenueData = [
    { name: 'Mon', revenue: 4200 },
    { name: 'Tue', revenue: 3800 },
    { name: 'Wed', revenue: 5100 },
    { name: 'Thu', revenue: 4500 },
    { name: 'Fri', revenue: 4900 },
    { name: 'Sat', revenue: 2100 },
  ];

  const demographicsData = [
    { name: '18-30', value: 20 },
    { name: '31-50', value: 45 },
    { name: '51-70', value: 25 },
    { name: '71+', value: 10 },
  ];
  
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reports & Analytics</h2>
           <p className="text-sm text-slate-500">Practice performance insights</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium focus:outline-none">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition">
             <Download size={16} />
             <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Appointments" 
          value="482" 
          trend="+12.5%" 
          isPositive={true} 
          icon={<Calendar size={20} />} 
        />
        <KPICard 
          title="Gross Revenue" 
          value="$124,500" 
          trend="+8.2%" 
          isPositive={true} 
          icon={<DollarSign size={20} />} 
        />
        <KPICard 
          title="New Patients" 
          value="45" 
          trend="-2.4%" 
          isPositive={false} 
          icon={<Users size={20} />} 
        />
        <KPICard 
          title="No-Show Rate" 
          value="4.2%" 
          trend="-1.1%" 
          isPositive={true} // Lower is better
          icon={<TrendingUp size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Appointment Volume */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Appointment Volume</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 cursor={{fill: '#f1f5f9'}}
              />
              <Legend />
              <Bar dataKey="visits" name="In-Person" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="telehealth" name="Telehealth" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenue Trend (Weekly)</h3>
          <ResponsiveContainer width="100%" height="85%">
             <AreaChart data={revenueData}>
                <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
             </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Demographics Pie */}
         <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-[350px]">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Patient Age Groups</h3>
            <ResponsiveContainer width="100%" height="85%">
               <PieChart>
                  <Pie
                     data={demographicsData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     fill="#8884d8"
                     paddingAngle={5}
                     dataKey="value"
                  >
                     {demographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
               </PieChart>
            </ResponsiveContainer>
         </div>
         
         {/* Top Procedures */}
         <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-[350px] overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Top CPT Codes</h3>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                     <tr>
                        <th className="px-4 py-3 font-semibold">Code</th>
                        <th className="px-4 py-3 font-semibold">Description</th>
                        <th className="px-4 py-3 font-semibold">Volume</th>
                        <th className="px-4 py-3 font-semibold text-right">% of Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     <tr>
                        <td className="px-4 py-3 font-mono text-primary-600">99213</td>
                        <td className="px-4 py-3">Office/outpatient visit est</td>
                        <td className="px-4 py-3">215</td>
                        <td className="px-4 py-3 text-right">45%</td>
                     </tr>
                     <tr>
                        <td className="px-4 py-3 font-mono text-primary-600">99214</td>
                        <td className="px-4 py-3">Office/outpatient visit est (mod)</td>
                        <td className="px-4 py-3">120</td>
                        <td className="px-4 py-3 text-right">25%</td>
                     </tr>
                     <tr>
                        <td className="px-4 py-3 font-mono text-primary-600">99203</td>
                        <td className="px-4 py-3">Office/outpatient visit new</td>
                        <td className="px-4 py-3">45</td>
                        <td className="px-4 py-3 text-right">9%</td>
                     </tr>
                     <tr>
                        <td className="px-4 py-3 font-mono text-primary-600">36415</td>
                        <td className="px-4 py-3">Routine venipuncture</td>
                        <td className="px-4 py-3">85</td>
                        <td className="px-4 py-3 text-right">18%</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
