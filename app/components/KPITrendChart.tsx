'use client';

import { KPI } from '../types/kpi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface KPITrendChartProps {
  kpi: KPI;
}

// 샘플 트렌드 데이터 생성
function generateTrendData(kpi: KPI) {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월'];
  const baseValue = kpi.current * 0.7;
  const increment = (kpi.current - baseValue) / 5;

  return months.map((month, index) => ({
    month,
    목표: kpi.target,
    실적: Math.round(baseValue + increment * index),
  }));
}

export function KPITrendChart({ kpi }: KPITrendChartProps) {
  const data = generateTrendData(kpi);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {kpi.name} 추이
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="목표"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="실적"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

