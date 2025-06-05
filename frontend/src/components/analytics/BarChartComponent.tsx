'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

// Cores da paleta Kapexia
const COLORS = ['#40E0D0', '#53B6AC', '#588C87', '#27514E', '#D040E0', '#E0D040'];

export default function BarChartComponent({ 
  title, 
  subtitle,
  data, 
  loading = false, 
  dataKey = 'valor',
  xAxisKey = 'dia',
  color = '#40E0D0',
  height = 200,
  showLegend = false,
  stacked = false,
  stackedKeys = []
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
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ACBCBA" />
              <XAxis dataKey={xAxisKey} stroke="#1C1C1C" />
              <YAxis stroke="#1C1C1C" />
              <Tooltip />
              {showLegend && <Legend />}
              
              {stacked && stackedKeys.length > 0 ? (
                // Renderizar barras empilhadas
                stackedKeys.map((key, index) => (
                  <Bar 
                    key={key} 
                    dataKey={key} 
                    stackId="a" 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))
              ) : (
                // Renderizar barra única
                <Bar dataKey={dataKey} fill={color}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
