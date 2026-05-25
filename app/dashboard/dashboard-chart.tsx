'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'Juil', cv: 2, lettres: 1 },
  { name: 'Aoû', cv: 3, lettres: 2 },
  { name: 'Sep', cv: 1, lettres: 0 },
  { name: 'Oct', cv: 4, lettres: 2 },
  { name: 'Nov', cv: 2, lettres: 1 },
  { name: 'Déc', cv: 5, lettres: 3 },
  { name: 'Jan', cv: 3, lettres: 2 },
  { name: 'Fév', cv: 6, lettres: 4 },
  { name: 'Mar', cv: 4, lettres: 2 },
  { name: 'Avr', cv: 7, lettres: 3 },
  { name: 'Mai', cv: 5, lettres: 4 },
  { name: 'Juin', cv: 3, lettres: 2 },
]

export function DashboardChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="cvGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.7 0.18 55)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.7 0.18 55)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lettreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.6 0.15 145)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.6 0.15 145)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 85 / 0.4)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 45)' }}
            axisLine={{ stroke: 'oklch(0.9 0.02 85)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'oklch(0.5 0.02 45)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'oklch(1 0 0)',
              border: '1px solid oklch(0.9 0.02 85)',
              borderRadius: '12px',
              fontSize: '13px',
              boxShadow: '0 4px 24px -6px rgba(0,0,0,0.12)',
            }}
          />
          <Area
            type="monotone"
            dataKey="cv"
            stroke="oklch(0.7 0.18 55)"
            strokeWidth={2}
            fill="url(#cvGradient)"
            dot={false}
            activeDot={{ r: 4, fill: 'oklch(0.7 0.18 55)', stroke: 'oklch(1 0 0)', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="lettres"
            stroke="oklch(0.6 0.15 145)"
            strokeWidth={2}
            fill="url(#lettreGradient)"
            dot={false}
            activeDot={{ r: 4, fill: 'oklch(0.6 0.15 145)', stroke: 'oklch(1 0 0)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
