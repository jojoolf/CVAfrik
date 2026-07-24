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

export interface ChartMonthData {
  name: string
  cv: number
  lettres: number
}

interface DashboardChartProps {
  data?: ChartMonthData[]
}

const defaultEmptyData: ChartMonthData[] = [
  { name: 'Jan', cv: 0, lettres: 0 },
  { name: 'Fév', cv: 0, lettres: 0 },
  { name: 'Mar', cv: 0, lettres: 0 },
  { name: 'Avr', cv: 0, lettres: 0 },
  { name: 'Mai', cv: 0, lettres: 0 },
  { name: 'Juin', cv: 0, lettres: 0 },
  { name: 'Juil', cv: 0, lettres: 0 },
  { name: 'Aoû', cv: 0, lettres: 0 },
  { name: 'Sep', cv: 0, lettres: 0 },
  { name: 'Oct', cv: 0, lettres: 0 },
  { name: 'Nov', cv: 0, lettres: 0 },
  { name: 'Déc', cv: 0, lettres: 0 },
]

export function DashboardChart({ data }: DashboardChartProps) {
  const chartData = data && data.length > 0 ? data : defaultEmptyData

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="cvGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lettreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#fff',
              boxShadow: '0 4px 24px -6px rgba(0,0,0,0.5)',
            }}
            formatter={(value: any, name: any) => [
              value,
              name === 'cv' ? 'CV créés' : 'Lettres générées'
            ]}
          />
          <Area
            type="monotone"
            dataKey="cv"
            name="cv"
            stroke="#f59e0b"
            strokeWidth={2.5}
            fill="url(#cvGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="lettres"
            name="lettres"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#lettreGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
