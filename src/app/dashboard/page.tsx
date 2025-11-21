'use client';

import React from 'react';
import { Users, CheckCircle, TrendingUp, Building2, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const donationData = [
  { month: 'Jan', value: 25000 },
  { month: 'Feb', value: 15000 },
  { month: 'Mar', value: 35000 },
  { month: 'Apr', value: 20000 },
  { month: 'May', value: 22000 },
  { month: 'Jun', value: 18000 },
  { month: 'Jul', value: 45000 }, // Peak
  { month: 'Aug', value: 15000 },
  { month: 'Sep', value: 25000 },
  { month: 'Oct', value: 28000 },
  { month: 'Nov', value: 48000 },
  { month: 'Dec', value: 55000 },
];

const cityData = [
  { city: 'Bangalore', value: 65000 },
  { city: 'Delhi', value: 58000 },
  { city: 'Vizag', value: 50000 },
  { city: 'Chennai', value: 42000 },
  { city: 'Hyderabad', value: 35000 },
  { city: 'Pune', value: 28000 },
];

const StatCard = ({ title, value, trend, trendUp, icon: Icon, iconBg, iconColor }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="text-gray-500 text-sm mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
    <div className="flex items-center text-xs">
      <span className={`font-medium ${trendUp ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
        {trendUp ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
        {trend}
      </span>
      <span className="text-gray-400 ml-1">{trendUp ? 'Up' : 'Down'} from this week</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] text-white px-4 py-2 rounded-lg text-sm shadow-xl border border-gray-800">
        <p className="text-xs text-gray-400 mb-1">Donation</p>
        <p className="font-bold text-lg">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Volunteers" 
          value="1,000" 
          trend="3.5%" 
          trendUp={true} 
          icon={Users} 
          iconBg="bg-indigo-100" 
          iconColor="text-indigo-600" 
        />
        <StatCard 
          title="Pending Approvals" 
          value="4,900" 
          trend="1.3%" 
          trendUp={true} 
          icon={CheckCircle} 
          iconBg="bg-orange-100" 
          iconColor="text-orange-500" 
        />
        <StatCard 
          title="Total Donations" 
          value="₹87,000" 
          trend="4.3%" 
          trendUp={false} 
          icon={TrendingUp} 
          iconBg="bg-green-100" 
          iconColor="text-green-600" 
        />
        <StatCard 
          title="Active Cities" 
          value="12" 
          trend="1.8%" 
          trendUp={true} 
          icon={Building2} 
          iconBg="bg-red-100" 
          iconColor="text-red-500" 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Donation Trends</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={donationData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D007B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3D007B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#3D007B', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3D007B" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City wise contributions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">City wise contributions</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#8B70B5" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Pending approvals</h2>
          <button className="px-4 py-2 bg-[#3D007B] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
            View all
          </button>
        </div>

        <div className="bg-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Name/ID</th>
                <th className="px-6 py-4 font-medium">City / Division</th>
                <th className="px-6 py-4 font-medium">Date Submitted</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">Volunteer</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">Rajesh Shah - SCID12461</td>
                <td className="px-6 py-4 text-gray-500">Hyderabad – Engineering Unit.</td>
                <td className="px-6 py-4 text-gray-500">02 August 2025</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

