
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

// Mock data - replace with actual API data
const mockData = {
  requests: [
    {
      id: 1,
      request: "<xml>...</xml>",
      response: "<xml>...</xml>",
      status: "success",
      error: null,
      responseTime: 150,
    },
    {
      id: 2,
      request: "<xml>...</xml>",
      response: "<xml>...</xml>",
      status: "failure",
      error: "Invalid format",
      responseTime: 200,
    },
  ],
  stats: {
    totalSuccess: 15,
    totalFailure: 5,
    avgResponseTime: 175,
  },
};

const COLORS = ['#22c55e', '#ef4444'];

const Report = () => {
  const [data] = useState(mockData);

  const pieData = [
    { name: 'Success', value: data.stats.totalSuccess },
    { name: 'Failure', value: data.stats.totalFailure },
  ];

  const downloadRow = (row: any) => {
    const csvContent = `Request,Response,Status,Error\n${row.request},${row.response},${row.status},${row.error || ''}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bre-record-${row.id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">BRE Analysis Report</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Total Requests</h3>
            <p className="text-3xl font-bold">
              {data.stats.totalSuccess + data.stats.totalFailure}
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-green-600">
              {Math.round((data.stats.totalSuccess / (data.stats.totalSuccess + data.stats.totalFailure)) * 100)}%
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Avg Response Time</h3>
            <p className="text-3xl font-bold">
              {data.stats.avgResponseTime}ms
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Success vs Failure</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.requests.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm">
                    {row.request.substring(0, 50)}...
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {row.response.substring(0, 50)}...
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>{row.error || '-'}</TableCell>
                  <TableCell>{row.responseTime}ms</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadRow(row)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default Report;
