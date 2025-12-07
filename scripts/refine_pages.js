const fs = require('fs');
const path = require('path');

const pageDefinitions = {
   // SYSTEM
   'system/status': {
      title: 'System Status',
      desc: 'Real-time operational status of all system components',
      importIcons: 'CheckCircle, XCircle, AlertTriangle, Server, Wifi, Activity',
      content: `
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Component Status</h2>
          <div className="space-y-4">
            {[
              { name: 'API Gateway', status: 'Operational', icon: Server },
              { name: 'Database Primary', status: 'Operational', icon: Server },
              { name: 'Storage Service', status: 'Operational', icon: Server },
              { name: 'Notification Service', status: 'Operational', icon: Wifi },
              { name: 'Authentication', status: 'Operational', icon: CheckCircle },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <item.icon className="text-gray-500" size={20} />
                  <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Active Incidents</h2>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <CheckCircle className="text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Systems Operational</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">There are no active incidents at this time.</p>
          </div>
        </div>
      </div>
    `
   },
   'system/observability': {
      title: 'Observability',
      desc: 'System logs and tracing metrics',
      importIcons: 'Search, FileText, Download, Filter, RefreshCw',
      content: `
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
             <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Search logs..." className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" />
                </div>
                <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Filter size={16} />
                </button>
             </div>
             <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded"><RefreshCw size={16} /></button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded"><Download size={16} /></button>
             </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                  { time: '2025-12-07 10:45:22', level: 'INFO', service: 'api-gateway', msg: 'Request received from 192.168.1.4' },
                  { time: '2025-12-07 10:45:21', level: 'DEBUG', service: 'auth-service', msg: 'Token validated successfully' },
                  { time: '2025-12-07 10:44:58', level: 'WARN', service: 'db-pool', msg: 'Connection pool usage at 85%' },
                  { time: '2025-12-07 10:44:12', level: 'INFO', service: 'notification', msg: 'Email sent to user_123' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">{log.time}</td>
                  <td className="px-6 py-4">
                    <span className={"px-2 py-1 round text-xs font-bold " + (log.level === 'INFO' ? 'bg-blue-100 text-blue-800' : log.level === 'WARN' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800')}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{log.service}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{log.msg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    `
   },
   'system/metrics': {
      title: 'System Metrics',
      desc: 'Resource usage and performance telemetry',
      importIcons: 'Cpu, HardDrive, Activity, Zap',
      content: `
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'CPU Usage', value: '45%', icon: Cpu, color: 'text-indigo-600' },
          { label: 'Memory', value: '62%', icon: HardDrive, color: 'text-purple-600' },
          { label: 'Network I/O', value: '1.2 GB/s', icon: Activity, color: 'text-blue-600' },
          { label: 'Requests/sec', value: '840', icon: Zap, color: 'text-yellow-600' },
        ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-between">
              <div>
                 <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                 <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <stat.icon className={stat.color} size={32} />
           </div>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
         <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Real-time Performance</h2>
         <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded border border-dashed border-gray-300 dark:border-gray-600 text-gray-400">
             <Activity className="mr-2" /> Live metric charts component would render here
         </div>
      </div>
    `
   },

   // SUPPORT
   'support/help': {
      title: 'Help Center',
      desc: 'Frequently asked questions and support resources',
      importIcons: 'Search, BookOpen, MessageSquare, Phone',
      content: `
       <div className="max-w-4xl mx-auto">
          <div className="mb-8 relative">
             <input type="text" placeholder="How can we help you today?" className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg" />
             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             {[
                { title: 'Documentation', icon: BookOpen, desc: 'Browse detailed guides' },
                { title: 'Live Chat', icon: MessageSquare, desc: 'Chat with support' },
                { title: 'Contact Us', icon: Phone, desc: '1-800-DILIGENT' },
             ].map((item, i) => (
                <button key={i} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                   <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                      <item.icon size={24} />
                   </div>
                   <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                   <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </button>
             ))}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8">
             <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Common Questions</h2>
             <div className="space-y-4">
                {['How do I reset my password?', 'Can I export lead data to CSV?', 'How do I add a new team member?', 'What do the different lead statuses mean?'].map((q, i) => (
                   <details key={i} className="group border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-900 dark:text-white list-none">
                         {q}
                         <span className="transition group-open:rotate-180">
                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                         </span>
                      </summary>
                      <p className="text-gray-600 dark:text-gray-400 mt-3 group-open:animate-fadeIn">
                         Detailed answer for "{q}" would appear here, providing step-by-step instructions or policy information.
                      </p>
                   </details>
                ))}
             </div>
          </div>
       </div>
    `
   },

   // SETTINGS
   'settings/general': {
      title: 'General Settings',
      desc: 'Configure application-wide defaults',
      importIcons: 'Globe, Clock, DollarSign, Image',
      content: `
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
         <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"><Globe size={20} className="mr-2" /> Localization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                  <select className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                     <option>English (US)</option>
                     <option>Spanish</option>
                  </select>
               </div>
               <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                   <select className="w-full border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600">
                      <option>UTC-6 (Central Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                   </select>
               </div>
            </div>
         </div>
         <div className="p-6">
             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"><Image size={20} className="mr-2" /> Branding</h3>
             <div className="flex items-center space-x-4">
                 <div className="h-16 w-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">Logo</div>
                 <button className="text-sm text-indigo-600 font-medium hover:text-indigo-500">Upload new logo</button>
             </div>
         </div>
         <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg flex justify-end">
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
         </div>
      </div>
    `
   },
   'settings/preferences': {
      title: 'User Preferences',
      desc: 'Customize your personal workspace',
      importIcons: 'Bell, Moon, Sidebar, Layout',
      content: `
        <div className="space-y-6">
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"><Bell size={20} className="mr-2" /> Notifications</h3>
              <div className="space-y-4">
                 {['Email notifications for new leads', 'Push notifications for mentions', 'Daily summary email', 'Weekly report digest'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-gray-700 dark:text-gray-300">{item}</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                       </label>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"><Layout size={20} className="mr-2" /> Interface</h3>
               <div className="space-y-4">
                   <div className="flex items-center justify-between">
                       <span className="text-gray-700 dark:text-gray-300">Compact Mode (High Density)</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                       </label>
                   </div>
               </div>
           </div>
        </div>
     `
   },
   'settings/feature-flags': {
      title: 'Feature Flags',
      desc: 'Manage experimental features and rollouts',
      importIcons: 'Flag, FlaskConical, AlertCircle',
      content: `
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/30 flex items-start space-x-3">
             <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
             <p className="text-sm text-yellow-800 dark:text-yellow-200">
                These features are experimental. Enabling them may affect system stability.
             </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
             {[
                { name: 'AI Predictive Scoring', id: 'ai_scoring_v2', desc: 'Use Gemini 1.5 Pro for lead scoring models', status: 'Beta' },
                { name: 'New Kanban Board', id: 'kanban_react_dnd', desc: 'Performance optimized drag-and-drop board', status: 'Alpha' },
                { name: 'Dark Mode V2', id: 'theme_v2', desc: 'High contrast dark mode with OLED support', status: 'RC' },
             ].map((flag, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                   <div>
                      <div className="flex items-center space-x-2">
                         <h3 className="text-lg font-medium text-gray-900 dark:text-white">{flag.name}</h3>
                         <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">{flag.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{flag.desc}</p>
                      <code className="text-xs text-gray-400 mt-2 block font-mono">{flag.id}</code>
                   </div>
                   <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                   </div>
                </div>
             ))}
          </div>
       </div>
    `
   },

   // REPORTS
   'reports/conversion': {
      title: 'Conversion Report',
      desc: 'Lead funnel and conversion rate analysis',
      importIcons: 'TrendingUp, Filter, Download, Funnel',
      content: `
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                 { label: 'Lead to Quote', val: '42%', change: '+5%', color: 'text-blue-600' },
                 { label: 'Quote to Deal', val: '28%', change: '+2%', color: 'text-indigo-600' },
                 { label: 'Overall Conversion', val: '12%', change: '+1.5%', color: 'text-green-600' },
              ].map((kpi, i) => (
                 <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 text-sm uppercase font-semibold">{kpi.label}</p>
                    <p className={"text-3xl font-bold mt-2 " + kpi.color}>{kpi.val}</p>
                    <p className="text-sm text-green-600 mt-1">{kpi.change} vs last month</p>
                 </div>
              ))}
           </div>
           
           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-6">Conversion Funnel</h3>
              <div className="space-y-4 max-w-3xl mx-auto">
                 {[
                    { stage: 'Total Leads', count: 1250, pct: '100%', bg: 'bg-blue-100' },
                    { stage: 'Qualified', count: 850, pct: '68%', bg: 'bg-blue-200' },
                    { stage: 'Proposal Sent', count: 520, pct: '41%', bg: 'bg-blue-400' },
                    { stage: 'Negotiation', count: 320, pct: '25%', bg: 'bg-blue-500' },
                    { stage: 'Closed Won', count: 150, pct: '12%', bg: 'bg-blue-600' },
                 ].map((step, i) => (
                    <div key={i} className="relative h-12 rounded-lg overflow-hidden flex items-center">
                       <div className={"absolute top-0 left-0 h-full " + step.bg} style={{ width: step.pct }}></div>
                       <div className="relative z-10 flex justify-between w-full px-4 font-medium text-gray-800 dark:text-gray-900">
                          <span>{step.stage}</span>
                          <span>{step.count} ({step.pct})</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      `
   },
   'reports/activity': {
      title: 'Activity Report',
      desc: 'Log of calls, emails, and meetings',
      importIcons: 'Phone, Mail, Users, Calendar, BarChart',
      content: `
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Activity Volume (Last 30 Days)</h3>
              <div className="h-64 flex items-end justify-between space-x-2 px-4">
                 {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                    <div key={i} className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t hover:bg-indigo-200 transition-colors relative group">
                       <div className="absolute bottom-0 w-full bg-indigo-600 rounded-t" style={{ height: h + "%" }}></div>
                       <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}
                       </div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-400 border-t pt-2">
                 <span>Week 1</span>
                 <span>Week 2</span>
                 <span>Week 3</span>
                 <span>Week 4</span>
              </div>
           </div>
           
           <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                 <h3 className="text-lg font-bold mb-4">Activity Breakdown</h3>
                 <div className="space-y-4">
                    {[
                       { type: 'Calls', count: 450, icon: Phone, color: 'text-green-500', bg: 'bg-green-100' },
                       { type: 'Emails', count: 820, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-100' },
                       { type: 'Meetings', count: 120, icon: Users, color: 'text-purple-500', bg: 'bg-purple-100' },
                    ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                             <div className={"p-2 rounded-lg " + item.bg}>
                                <item.icon className={item.color} size={20} />
                             </div>
                             <span className="font-medium text-gray-700 dark:text-gray-300">{item.type}</span>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      `
   },

   // PIPELINE
   'pipeline/summary': {
      title: 'Pipeline Summary',
      desc: 'Overview of all active opportunities',
      importIcons: 'DollarSign, Briefcase, TrendingUp',
      content: `
         <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                  { label: 'Total Value', val: '$1.2M', sub: 'Active Pipeline' },
                  { label: 'Weighted Value', val: '$480K', sub: 'Probability Adjusted' },
                  { label: 'Avg Deal Size', val: '$12.5K', sub: 'Per Opportunity' },
                  { label: 'Open Deals', val: '86', sub: 'Active Opportunities' },
               ].map((c, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                      <p className="text-sm text-gray-500">{c.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{c.val}</p>
                      <p className="text-xs text-indigo-600 mt-1">{c.sub}</p>
                  </div>
               ))}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-bold mb-4">Pipeline by Stage</h3>
               <div className="space-y-6">
                  {[
                     { stage: 'Discovery', val: '$250k', pct: 20 },
                     { stage: 'Qualification', val: '$350k', pct: 30 },
                     { stage: 'Proposal', val: '$400k', pct: 35 },
                     { stage: 'Negotiation', val: '$200k', pct: 15 },
                  ].map((s, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                           <span className="text-gray-700 dark:text-gray-300">{s.stage}</span>
                           <span className="text-gray-900 dark:text-white">{s.val}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-600" style={{ width: s.pct + "%" }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      `
   },
   'pipeline/stalled': {
      title: 'Stalled Opportunities',
      desc: 'Deals with no activity for 14+ days',
      importIcons: 'AlertTriangle, Clock, ArrowRight',
      content: `
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 flex justify-between items-center">
               <div className="flex items-center text-red-800 dark:text-red-200">
                  <AlertTriangle size={20} className="mr-2" />
                  <span className="font-medium">24 Opportunities require attention</span>
               </div>
               <button className="text-sm text-red-700 font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
               {[
                  { name: 'Acme Corp Renewal', value: '$45,000', days: 18, stage: 'Negotiation', owner: 'Sarah J.' },
                  { name: 'Globex Enterprise Lic', value: '$120,000', days: 22, stage: 'Proposal', owner: 'Mike T.' },
                  { name: 'Soylent Corp Deal', value: '$15,000', days: 15, stage: 'Discovery', owner: 'Jessica R.' },
                  { name: 'Initech Upgrade', value: '$28,000', days: 30, stage: 'Qualification', owner: 'Bill L.' },
               ].map((deal, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{deal.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{deal.stage} • Owned by {deal.owner}</p>
                     </div>
                     <div className="flex items-center space-x-6">
                        <div className="text-right">
                           <p className="font-bold text-gray-900 dark:text-white">{deal.value}</p>
                           <p className="text-sm text-red-600 font-medium flex items-center justify-end">
                              <Clock size={14} className="mr-1" /> {deal.days} days inactive
                           </p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-indigo-600">
                           <ArrowRight size={20} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      `
   },
   'pipeline/aging': {
      title: 'Aging Report',
      desc: 'Time-in-stage analysis',
      importIcons: 'Clock, BarChart2, AlertCircle',
      content: `
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-6">Average Time in Stage</h3>
              <div className="space-y-4">
                 {[
                    { stage: 'Discovery', days: 12, avg: 10, status: 'Normal' },
                    { stage: 'Qualification', days: 18, avg: 14, status: 'Slow' },
                    { stage: 'Proposal', days: 8, avg: 10, status: 'Fast' },
                    { stage: 'Negotiation', days: 25, avg: 15, status: 'Critical' },
                 ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-700/30">
                       <span className="font-medium text-gray-700 dark:text-gray-300 w-1/3">{s.stage}</span>
                       <div className="flex-1 px-4">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                             <div className={"h-full " + (s.status === 'Critical' ? 'bg-red-500' : s.status === 'Slow' ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: (s.days / 30) * 100 + "%" }}></div>
                          </div>
                       </div>
                       <div className="w-16 text-right font-bold text-gray-900 dark:text-white">{s.days} days</div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-bold mb-4">Slowest Moving Deals</h3>
               <div className="divide-y divide-gray-100">
                  {[
                     { name: 'Massive Dynamic Corp', stage: 'Negotiation', days: 45 },
                     { name: 'Cyberdyne Systems', stage: 'Qualification', days: 38 },
                     { name: 'Umbrella Corp', stage: 'Discovery', days: 32 },
                  ].map((d, i) => (
                     <div key={i} className="py-3 flex justify-between items-center">
                        <div>
                           <p className="font-medium text-gray-900 dark:text-white">{d.name}</p>
                           <p className="text-xs text-gray-500">{d.stage}</p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">{d.days} days</span>
                     </div>
                  ))}
               </div>
           </div>
        </div>
      `
   },

   // COMPLIANCE
   'compliance/retention': {
      title: 'Data Retention Policies',
      desc: 'Automatic data clearing configuration',
      importIcons: 'Trash2, Shield, Calendar, Save',
      content: `
         <div className="max-w-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 text-sm text-gray-600 dark:text-gray-300">
               <p className="flex items-start"><Shield className="mr-3 text-indigo-600 flex-shrink-0" size={20} /> Data retention policies ensure compliance with CCPA. Data older than the specified period will be automatically archived or deleted.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
               {[
                  { type: 'Lead Data (Non-Converted)', current: '90 Days', legal: 'CCPA Limit: 12 months' },
                  { type: 'Call Recordings', current: '30 Days', legal: 'Storage Cost Optimization' },
                  { type: 'Email History', current: '6 Months', legal: 'Communication Audit' },
                  { type: 'Inactive User Accounts', current: '1 Year', legal: 'Internal Policy' },
               ].map((policy, i) => (
                  <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{policy.type}</h4>
                        <p className="text-xs text-gray-500 mt-1">{policy.legal}</p>
                     </div>
                     <div className="flex items-center space-x-3">
                        <select className="border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 text-sm">
                           <option>{policy.current}</option>
                           <option>30 Days</option>
                           <option>60 Days</option>
                           <option>90 Days</option>
                           <option>6 Months</option>
                           <option>1 Year</option>
                        </select>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Purge Now">
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
            <div className="mt-6 flex justify-end">
               <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  <Save size={18} className="mr-2" /> Save Policies
               </button>
            </div>
         </div>
      `
   },

   // COMMISSIONS
   'commissions/team': {
      title: 'Team Commissions',
      desc: 'Manager overview of team earnings',
      importIcons: 'Users, DollarSign, Award, TrendingUp',
      content: `
         <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                     <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rep Name</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Revenue Generated</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Commission Rate</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Earned</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                     {[
                        { name: 'Sarah Jenkins', rev: '$124,000', rate: '10%', earned: '$12,400', status: 'Paid' },
                        { name: 'Michael Thompson', rev: '$98,500', rate: '10%', earned: '$9,850', status: 'Processing' },
                        { name: 'Jessica Rodriguez', rev: '$145,200', rate: '12%', earned: '$17,424', status: 'Paid' },
                        { name: 'Bill Lumbergh', rev: '$45,000', rate: '8%', earned: '$3,600', status: 'Pending' },
                     ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                           <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{row.name}</td>
                           <td className="px-6 py-4 text-right text-gray-600 font-mono">{row.rev}</td>
                           <td className="px-6 py-4 text-right">{row.rate}</td>
                           <td className="px-6 py-4 text-right font-bold text-green-600">{row.earned}</td>
                           <td className="px-6 py-4 text-center">
                              <span className={"text-xs px-2 py-1 rounded-full font-semibold " + (row.status === 'Paid' ? 'bg-green-100 text-green-800' : row.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}>
                                 {row.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      `
   },
   'commissions/projection': {
      title: 'Commission Projection',
      desc: 'Estimated earnings based on open pipeline',
      importIcons: 'TrendingUp, Calendar, AlertCircle',
      content: `
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Projected (Next 30 Days)</h3>
              <p className="text-4xl font-bold text-indigo-600">$8,450</p>
              <p className="text-sm text-green-600 mt-2 flex items-center justify-center"><TrendingUp size={16} className="mr-1" /> +12% from last month</p>
           </div>
           
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Projected (Q4 Total)</h3>
              <p className="text-4xl font-bold text-purple-600">$24,100</p>
              <p className="text-sm text-gray-400 mt-2">Based on 35% probability weighting</p>
           </div>
           
           <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 border border-indigo-100 dark:border-indigo-800">
               <div className="flex items-start">
                  <AlertCircle className="text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-200">How is this calculated?</h4>
                      <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                          Projections are based on "Proposal" and "Negotiation" stage deals weighted by their probability of closing. Deals in preliminary stages are excluded to ensure accuracy.
                      </p>
                  </div>
               </div>
           </div>
        </div>
      `
   },

   // AI
   'ai/predictive': {
      title: 'Predictive Analytics',
      desc: 'AI-driven business forecasts',
      importIcons: 'Brain, TrendingUp, Zap',
      content: `
        <div className="space-y-6">
           <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                 <Brain size={48} className="text-purple-200" />
                 <div>
                    <h2 className="text-3xl font-bold">Sales Forecast</h2>
                    <p className="text-purple-200">Confidence Score: 92%</p>
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-8 text-center bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                 <div>
                    <p className="text-sm text-purple-200 uppercase">Next Month Revenue</p>
                    <p className="text-3xl font-bold">$185k</p>
                 </div>
                 <div>
                    <p className="text-sm text-purple-200 uppercase">Predicted Growth</p>
                    <p className="text-3xl font-bold">+18%</p>
                 </div>
                 <div>
                    <p className="text-sm text-purple-200 uppercase">Churn Risk</p>
                    <p className="text-3xl font-bold">Low</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-xl font-bold mb-4 flex items-center"><Zap className="text-yellow-500 mr-2" /> Top Opportunities to Watch</h3>
               <div className="space-y-3">
                  {[
                     { name: 'TechGlobal Expansion', score: 98, reason: 'High engagement, Budget confirmed' },
                     { name: 'City Services Contract', score: 95, reason: 'Decision maker meeting set' },
                     { name: 'Logistics Plus', score: 88, reason: 'Request for proposal received' },
                  ].map((opp, i) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-l-4 border-green-500">
                        <div>
                           <p className="font-bold text-gray-900 dark:text-white">{opp.name}</p>
                           <p className="text-xs text-gray-500">{opp.reason}</p>
                        </div>
                        <div className="text-right">
                           <span className="text-2xl font-bold text-green-600">{opp.score}</span>
                           <span className="text-xs text-gray-400 block">AI Score</span>
                        </div>
                     </div>
                  ))}
               </div>
           </div>
        </div>
     `
   },
   'ai/pipeline': {
      title: 'Pipeline Intelligence',
      desc: 'AI analysis of pipeline health',
      importIcons: 'CheckCircle, AlertTriangle, ArrowRight',
      content: `
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-bold mb-4 text-green-600 flex items-center"><CheckCircle className="mr-2" /> Healthy Deals</h3>
               <p className="text-sm text-gray-500 mb-4">These deals are progressing faster than average.</p>
               <ul className="space-y-3">
                  {['Metro Systems', 'Alpha Logistics', 'Beta Corp'].map((d, i) => (
                      <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                         <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> {d}
                      </li>
                  ))}
               </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
               <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center"><AlertTriangle className="mr-2" /> At Risk Deals</h3>
               <p className="text-sm text-gray-500 mb-4">Lack of recent communication detected.</p>
               <ul className="space-y-3">
                  {['Gamma Inc', 'Delta Force', 'Epsilon Group'].map((d, i) => (
                      <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                         <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> {d}
                      </li>
                  ))}
               </ul>
            </div>
         </div>
      `
   },
   'ai/insights': {
      title: 'Smart Insights',
      desc: 'Automated business recommendations',
      importIcons: 'Lightbulb, ThumbsUp, X, ArrowRight',
      content: `
         <div className="space-y-4">
            {[
               { title: 'Follow up with precision', body: 'Leads contacted on Tuesday mornings have a 20% higher conversion rate. Schedule your calls for tomorrow 9 AM.', type: 'Optimization' },
               { title: 'Re-engage cold lead', body: 'InterTech Systems viewed the pricing page yesterday but has not replied to emails. Send a check-in now.', type: 'Alert' },
               { title: 'Upsell Opportunity', body: 'Client "Global Corp" is nearing their usage limit. Good time to propose the Enterprise plan.', type: 'Growth' },
            ].map((card, i) => (
               <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-indigo-500">
                  <div className="flex justify-between items-start">
                     <div className="flex items-start space-x-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded text-indigo-600">
                           <Lightbulb size={24} />
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-gray-900 dark:text-white">{card.title}</h3>
                           <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{card.type}</span>
                           <p className="mt-2 text-gray-600 dark:text-gray-300">{card.body}</p>
                        </div>
                     </div>
                     <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full border border-gray-200"><X size={16} /></button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-full border border-green-200"><ThumbsUp size={16} /></button>
                     </div>
                  </div>
                  <div className="mt-4 pl-14">
                      <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center">
                         Take Action <ArrowRight size={16} className="ml-1" />
                      </button>
                  </div>
               </div>
            ))}
         </div>
      `
   },

   // ADMIN
   'admin/permissions': {
      title: 'Role Permissions',
      desc: 'Matrix of access rights per role',
      importIcons: 'Shield, Lock, Unlock, Check',
      content: `
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
               <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                     <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                     <th className="px-6 py-4 text-center font-medium text-gray-500">Admin</th>
                     <th className="px-6 py-4 text-center font-medium text-gray-500">Manager</th>
                     <th className="px-6 py-4 text-center font-medium text-gray-500">Rep</th>
                     <th className="px-6 py-4 text-center font-medium text-gray-500">Viewer</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                     'View Leads',
                     'Create Leads',
                     'Delete Leads',
                     'View Reports',
                     'Manage Users',
                     'System Settings'
                  ].map((perm, i) => (
                     <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{perm}</td>
                        <td className="px-6 py-4 text-center text-green-600"><Check size={18} className="mx-auto" /></td>
                        <td className="px-6 py-4 text-center">
                           {i > 4 ? <span className="text-gray-300">-</span> : <Check size={18} className="mx-auto text-green-600" />}
                        </td>
                        <td className="px-6 py-4 text-center">
                           {i > 2 ? <span className="text-gray-300">-</span> : <Check size={18} className="mx-auto text-green-600" />}
                        </td>
                        <td className="px-6 py-4 text-center">
                            {i === 0 || i === 3 ? <Check size={18} className="mx-auto text-green-600" /> : <span className="text-gray-300">-</span>}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      `
   },
   'admin/integrations': {
      title: 'Integrations',
      desc: 'Manage connections to external services',
      importIcons: 'Plug, CheckCircle, RefreshCw, ExternalLink',
      content: `
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
               { name: 'Google Workspace', status: 'Connected', desc: 'Sync calendars and email' },
               { name: 'Slack', status: 'Connected', desc: 'Channel notifications' },
               { name: 'Stripe', status: 'Active', desc: 'Payment processing' },
               { name: 'QuickBooks', status: 'Disconnected', desc: 'Accounting sync' },
               { name: 'Twilio', status: 'Connected', desc: 'SMS and Voice' },
               { name: 'Zapier', status: 'Disconnected', desc: 'Automation workflows' },
            ].map((app, i) => (
               <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between h-48">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Plug size={24} className="text-gray-600 dark:text-gray-300" />
                     </div>
                     <span className={"px-2 py-1 text-xs rounded-full " + (app.status === 'Connected' || app.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}>
                        {app.status}
                     </span>
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 dark:text-white">{app.name}</h3>
                     <p className="text-sm text-gray-500">{app.desc}</p>
                  </div>
                  <button className="w-full mt-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                     {app.status === 'Disconnected' ? 'Connect' : 'Manage'}
                  </button>
               </div>
            ))}
         </div>
      `
   },
   'admin/env': {
      title: 'Environment Variables',
      desc: 'System configuration values',
      importIcons: 'Server, Lock, EyeOff, Copy',
      content: `
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
             <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Environment: <span className="font-mono font-bold text-green-600">Production</span></p>
             </div>
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700">
                   <tr>
                      <th className="px-6 py-3 font-medium text-gray-500">Variable</th>
                      <th className="px-6 py-3 font-medium text-gray-500">Value</th>
                      <th className="px-6 py-3 font-medium text-gray-500 w-24">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                   {[
                      { k: 'NEXT_PUBLIC_API_URL', v: 'https://api.diligentos.com' },
                      { k: 'DATABASE_URL', v: 'postgres://user:pass@...' },
                      { k: 'AUTH_SECRET', v: '********************' },
                      { k: 'STRIPE_KEY', v: 'pk_live_************' },
                      { k: 'RESEND_API_KEY', v: 're_****************' },
                   ].map((env, i) => (
                      <tr key={i} className="font-mono">
                         <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400">{env.k}</td>
                         <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{env.v}</td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-gray-600"><Copy size={16} /></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
         </div>
      `
   },

   // ACTIVITIES
   'activities/calendar': {
      title: 'Calendar',
      desc: 'Schedule of upcoming events',
      importIcons: 'Calendar, Clock, MapPin, ChevronLeft, ChevronRight',
      content: `
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">December 2025</h2>
                  <div className="flex space-x-1">
                     <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft size={20} /></button>
                     <button className="p-1 rounded hover:bg-gray-100"><ChevronRight size={20} /></button>
                  </div>
               </div>
               <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-medium">Week</button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium">Month</button>
               </div>
            </div>
            
            <div className="space-y-4">
               {[
                  { day: 'Today', date: 'Dec 7', events: [{ time: '10:00 AM', title: 'Team Sync', type: 'Internal', color: 'bg-blue-100 border-blue-500 text-blue-800' }] },
                  { day: 'Tomorrow', date: 'Dec 8', events: [
                      { time: '2:00 PM', title: 'Client Demo - Acme', type: 'Sales', color: 'bg-green-100 border-green-500 text-green-800' },
                      { time: '4:30 PM', title: 'Q4 Review', type: 'Internal', color: 'bg-blue-100 border-blue-500 text-blue-800' }
                  ]},
                  { day: 'Wednesday', date: 'Dec 9', events: [] },
                  { day: 'Thursday', date: 'Dec 10', events: [{ time: '11:00 AM', title: 'Lunch with prospect', type: 'External', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' }] },
               ].map((dayEvent, i) => (
                  <div key={i} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                     <p className="text-sm font-semibold text-gray-500 mb-2">{dayEvent.day}, {dayEvent.date}</p>
                     {dayEvent.events.length > 0 ? (
                        <div className="space-y-2">
                           {dayEvent.events.map((evt, j) => (
                              <div key={j} className={"flex items-center p-3 rounded-lg border-l-4 bg-opacity-50 " + evt.color}>
                                 <Clock size={16} className="mr-3 opacity-70" />
                                 <span className="font-mono text-sm font-bold mr-4">{evt.time}</span>
                                 <span className="font-medium">{evt.title}</span>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm text-gray-400 italic pl-4">No events scheduled</p>
                     )}
                  </div>
               ))}
            </div>
         </div>
      `
   }
};

const generateFile = (pathName, config) => {
   return `'use client';

import { ${config.importIcons} } from 'lucide-react';

export default function Page() {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">${config.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">${config.desc}</p>
            </div>
            ${config.content}
        </div>
    );
}
`;
};

Object.entries(pageDefinitions).forEach(([pagePath, config]) => {
   // Corrected path to point to 'src/app' from the 'scripts' directory
   const fullPath = path.join(__dirname, '..', 'src', 'app', pagePath, 'page.tsx');
   try {
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
         fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, generateFile(pagePath, config));
      console.log(`Updated: ${pagePath}`);
   } catch (err) {
      console.error(`Error updating ${pagePath}: ${err.message}`);
   }
});
