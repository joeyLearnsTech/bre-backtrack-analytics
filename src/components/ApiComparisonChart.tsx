
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from "@/components/ui/card";

interface ApiComparisonChartProps {
  primarySuccessCount: number;
  primaryFailureCount: number;
  secondarySuccessCount: number;
  secondaryFailureCount: number;
}

const ApiComparisonChart: React.FC<ApiComparisonChartProps> = ({
  primarySuccessCount,
  primaryFailureCount,
  secondarySuccessCount,
  secondaryFailureCount,
}) => {
  const data = [
    {
      name: 'Success',
      Primary: primarySuccessCount,
      Secondary: secondarySuccessCount,
    },
    {
      name: 'Failure',
      Primary: primaryFailureCount,
      Secondary: secondaryFailureCount,
    },
  ];

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">API Comparison</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Primary" fill="#22c55e" name="Primary API" />
            <Bar dataKey="Secondary" fill="#6366f1" name="Secondary API" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ApiComparisonChart;
