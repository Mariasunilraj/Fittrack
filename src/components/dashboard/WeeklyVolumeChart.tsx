import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const WEEKLY_DATA = [
  { day: 'Mon', minutes: 45, discipline: 'Calisthenics' },
  { day: 'Tue', minutes: 50, discipline: 'Weightlifting' },
  { day: 'Wed', minutes: 30, discipline: 'Mobility' },
  { day: 'Thu', minutes: 45, discipline: 'Calisthenics' },
  { day: 'Fri', minutes: 60, discipline: 'Taekwondo' },
  { day: 'Sat', minutes: 40, discipline: 'Gym Pull' },
  { day: 'Sun', minutes: 0, discipline: 'Rest Day' }
];

export const WeeklyVolumeChart: React.FC = () => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-brand-surface border border-brand-border flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Activity Analytics</span>
          <h3 className="text-lg font-bold text-white">Weekly Training Volume</h3>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Total: <strong className="text-brand-yellow font-bold">270 mins</strong>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252e3e" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141821',
                borderColor: '#252e3e',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px'
              }}
              cursor={{ fill: 'rgba(226, 241, 99, 0.08)' }}
              formatter={(value: any, name: any, item: any) => [`${value} active mins (${item.payload.discipline})`, 'Duration']}
            />
            <Bar dataKey="minutes" fill="#e2f163" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-brand-border flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-brand-yellow" />
          <span>Active Session Minutes</span>
        </div>
        <span>Target: 250 mins / wk</span>
      </div>
    </div>
  );
};
