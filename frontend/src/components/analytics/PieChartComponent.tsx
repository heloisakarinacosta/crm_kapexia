'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { PieChartComponentProps } from '@/types/ui';

// Cores da paleta Kapexia
const COLORS = ['#40E0D0', '#53B6AC', '#588C87', '#27514E', '#D040E0', '#E0D040'];

export default function PieChartComponent({ 
  title, 
  data, 
  loading = false, 
  donut = false,
  showPercentage = true,
  height = 200
}: PieChartComponentProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white dark:bg-white rounded-xl shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-montserrat font-light text-center text-gray-800">
            {title}
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
        </CardTitle>
      </CardHeader>
      <CardContent className={`h-${height}`}>
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={donut ? 60 : 0}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={showPercentage ? 
                  ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : 
                  ({ name }) => name
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
