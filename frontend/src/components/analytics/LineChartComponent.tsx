'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function LineChartComponent({ 
  title, 
  subtitle,
  data, 
  loading = false, 
  dataKey = 'valor',
  xAxisKey = 'dia',
  color = '#53B6AC',
  height = 200,
  showLegend = false
}) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white dark:bg-white rounded-xl shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-montserrat font-light text-center text-gray-800">
            {title}
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </CardTitle>
        </CardHeader>
        <CardContent className={`h-${height}`}>
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Sem dados disponíveis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-white rounded-xl shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-montserrat font-light text-center text-gray-800">
          {title}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </CardTitle>
      </CardHeader>
      <CardContent className={`h-${height}`}>
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ACBCBA" />
              <XAxis dataKey={xAxisKey} stroke="#1C1C1C" />
              <YAxis stroke="#1C1C1C" />
              <Tooltip />
              {showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
