import React from 'react';
import '@/index.css'
import { Card, CardContent } from "../components/ui/card.tsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Phone, Clock, SmilePlus, Bot, ShoppingCart } from 'lucide-react';

const data = [
  { week: 'Week 1', calls: 1000 },
  { week: 'Week 2', calls: 1500 },
  { week: 'Week 3', calls: 1200 },
  { week: 'Week 4', calls: 1800 },
];

const MetricCard = ({ title, value, icon: Icon }) => (
  <Card className="bg-gray-800 border-gray-700 hover:border-emerald-500 transition-all duration-300 transform hover:scale-105">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
        </div>
        <Icon className="h-8 w-8 text-emerald-400" />
      </div>
    </CardContent>
  </Card>
);

const ActionCard = ({ title, icon: Icon }) => (
  <Card className="bg-gray-800 border-gray-700 hover:border-emerald-500 transition-all duration-300 transform hover:scale-105 cursor-pointer">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <Icon className="h-6 w-6 text-emerald-400" />
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 animate-fade-in-down">Welcome, User</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Total Calls" value="1,243" icon={Phone} />
        <MetricCard title="Avg. Call Duration" value="5m 23s" icon={Clock} />
        <MetricCard title="Customer Satisfaction" value="89%" icon={SmilePlus} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActionCard title="Manage Bot Data" icon={Bot} />
        <ActionCard title="View Orders" icon={ShoppingCart} />
      </div>
      
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h2 className="text-2xl font-bold mb-4">Weekly Call Volume</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                itemStyle={{ color: '#10B981' }}
              />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}