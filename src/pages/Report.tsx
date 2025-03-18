import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const COLORS = ['#22c55e', '#ef4444'];

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData } = location.state || {};

  // Redirect if no data is available
  useEffect(() => {
    if (!reportData) {
      navigate('/');
    }
  }, [reportData, navigate]);

  if (!reportData) {
    return null; // Prevent rendering if no data (will redirect)
  }

  // Process report data once instead of repeatedly
  const processReportData = () => {
    const { breReportDetails, count } = reportData;
    let successCount = 0;
    let failureCount = 0;
    let totalResponseTime = 0;

    breReportDetails.forEach(({ status }) => {
      if (status === "SUCCESS") {
        successCount++;
      } else {
        failureCount++;
      }
      // Note: We're not processing response time here as it appears to be a date string
      // that would need different handling
    });

    const successRate = breReportDetails.length > 0 
      ? Math.round((successCount / breReportDetails.length) * 100) 
      : 0;

    return {
      count,
      successCount,
      failureCount,
      successRate,
      breReportDetails
    };
  };

  const processedData = processReportData();
  
  const pieData = [
    { name: 'Success', value: processedData.successCount },
    { name: 'Failure', value: processedData.failureCount },
  ];

  const downloadRow = (row) => {
    const csvContent = `ApplicationId,Status,ResponseTime\n${row.applicationId},${row.status},${row.responseTime}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bre-record-${row.applicationId}.csv`;
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
            <p className="text-3xl font-bold">{processedData.count}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-green-600">{processedData.successRate}%</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Avg Response Time</h3>
            <p className="text-3xl font-bold">
              {/* Using placeholder since the actual time calculation wasn't implemented */}
              {processedData.breReportDetails.length > 0 ? 'Varies' : 'N/A'}
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <TableHead>Application ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.breReportDetails.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>Request</TableCell>
                  <TableCell>Response</TableCell>
                  <TableCell>{row.applicationId}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>{row.responseTime}</TableCell>
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