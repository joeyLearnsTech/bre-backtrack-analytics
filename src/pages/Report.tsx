
import { useEffect, useState } from 'react';
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
import { Download, Eye } from 'lucide-react';
import XmlViewer from '@/components/XmlViewer';
import ApiComparisonChart from '@/components/ApiComparisonChart';

const COLORS = ['#22c55e', '#ef4444'];

interface BRERecord {
  applicationId: string;
  status: string;
  responseTime: string;
  request?: string; // XML request content
  response?: string; // XML response content
}

interface ReportData {
  breReportDetails: BRERecord[];
  count: number;
}

interface ComparisonData {
  primaryApi?: ReportData;
  secondaryApi?: ReportData;
}

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData } = location.state || {};

  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    primaryApi: reportData,
    secondaryApi: undefined,
  });

  const [xmlViewerState, setXmlViewerState] = useState({
    isOpen: false,
    content: '',
    title: '',
  });

  // Fetch secondary API data on component mount
  useEffect(() => {
    const fetchSecondaryData = async () => {
      try {
        // Mocking a secondary API response - in real application, replace with actual API call
        const secondaryApiData = {
          count: 8,
          breReportDetails: [
            {
              applicationId: "237",
              status: "SUCCESS", // Different status for comparison
              responseTime: "Mar 18, 2025, 6:15:30 PM IST",
              request: "<request id='237'>...</request>",
              response: "<response id='237'>...</response>"
            },
            {
              applicationId: "582",
              status: "SUCCESS",
              responseTime: "Mar 18, 2025, 6:16:05 PM IST",
              request: "<request id='582'>...</request>",
              response: "<response id='582'>...</response>"
            },
            {
              applicationId: "812",
              status: "SUCCESS", // Different status for comparison
              responseTime: "Mar 18, 2025, 6:16:45 PM IST",
              request: "<request id='812'>...</request>",
              response: "<response id='812'>...</response>"
            },
            {
              applicationId: "145",
              status: "SUCCESS",
              responseTime: "Mar 18, 2025, 6:17:20 PM IST",
              request: "<request id='145'>...</request>",
              response: "<response id='145'>...</response>"
            },
            {
              applicationId: "987",
              status: "SUCCESS", // Different status for comparison
              responseTime: "Mar 18, 2025, 6:18:00 PM IST",
              request: "<request id='987'>...</request>",
              response: "<response id='987'>...</response>"
            },
            {
              applicationId: "356",
              status: "FAILED", // Different status for comparison
              responseTime: "Mar 18, 2025, 6:18:30 PM IST",
              request: "<request id='356'>...</request>",
              response: "<response id='356'>...</response>"
            },
            {
              applicationId: "620",
              status: "SUCCESS",
              responseTime: "Mar 18, 2025, 6:19:10 PM IST",
              request: "<request id='620'>...</request>",
              response: "<response id='620'>...</response>"
            },
            {
              applicationId: "731",
              status: "SUCCESS",
              responseTime: "Mar 18, 2025, 6:19:45 PM IST",
              request: "<request id='731'>...</request>",
              response: "<response id='731'>...</response>"
            }
          ]
        };

        // Add request/response XML to primary API data for demo
        const primaryApiWithXml = {
          ...reportData,
          breReportDetails: reportData.breReportDetails.map(record => ({
            ...record,
            request: `<request id='${record.applicationId}'>...</request>`,
            response: `<response id='${record.applicationId}'>...</response>`
          }))
        };

        setComparisonData({
          primaryApi: primaryApiWithXml,
          secondaryApi: secondaryApiData,
        });
      } catch (error) {
        console.error("Failed to fetch secondary API data:", error);
      }
    };

    if (reportData) {
      fetchSecondaryData();
    }
  }, [reportData]);

  // Redirect if no data is available
  useEffect(() => {
    if (!reportData) {
      navigate('/');
    }
  }, [reportData, navigate]);

  if (!comparisonData.primaryApi) {
    return null; // Prevent rendering if no data (will redirect)
  }

  // Process report data for primary API
  const processReportData = (data: ReportData) => {
    const { breReportDetails, count } = data;
    let successCount = 0;
    let failureCount = 0;

    breReportDetails.forEach(({ status }) => {
      if (status === "SUCCESS") {
        successCount++;
      } else {
        failureCount++;
      }
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

  const primaryData = processReportData(comparisonData.primaryApi);
  const secondaryData = comparisonData.secondaryApi ? processReportData(comparisonData.secondaryApi) : null;
  
  const primaryPieData = [
    { name: 'Success', value: primaryData.successCount },
    { name: 'Failure', value: primaryData.failureCount },
  ];

  const secondaryPieData = secondaryData ? [
    { name: 'Success', value: secondaryData.successCount },
    { name: 'Failure', value: secondaryData.failureCount },
  ] : [];

  const downloadRow = (row: BRERecord) => {
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

  const viewXml = (content: string, title: string) => {
    setXmlViewerState({
      isOpen: true,
      content,
      title,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">BRE Analysis Report</h1>

        {/* Add Comparison Chart */}
        {secondaryData && (
          <div className="mb-8">
            <ApiComparisonChart
              primarySuccessCount={primaryData.successCount}
              primaryFailureCount={primaryData.failureCount}
              secondarySuccessCount={secondaryData.successCount}
              secondaryFailureCount={secondaryData.failureCount}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Primary API Stats */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Primary API</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-1">Total Requests</h3>
                <p className="text-2xl font-bold">{primaryData.count}</p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-1">Success Rate</h3>
                <p className="text-2xl font-bold text-green-600">{primaryData.successRate}%</p>
              </Card>

              <Card className="p-4">
                <h3 className="text-sm font-medium mb-1">Avg Response Time</h3>
                <p className="text-2xl font-bold">
                  {primaryData.breReportDetails.length > 0 ? 'Varies' : 'N/A'}
                </p>
              </Card>
            </div>

            <Card className="p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">Success vs Failure</h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={primaryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {primaryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Secondary API Stats */}
          {secondaryData && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Secondary API</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-1">Total Requests</h3>
                  <p className="text-2xl font-bold">{secondaryData.count}</p>
                </Card>
                
                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-1">Success Rate</h3>
                  <p className="text-2xl font-bold text-green-600">{secondaryData.successRate}%</p>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-1">Avg Response Time</h3>
                  <p className="text-2xl font-bold">
                    {secondaryData.breReportDetails.length > 0 ? 'Varies' : 'N/A'}
                  </p>
                </Card>
              </div>

              <Card className="p-4 mb-6">
                <h3 className="text-lg font-medium mb-4">Success vs Failure</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={secondaryPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {secondaryPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Primary API Table */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold p-4 border-b">Primary API Results</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>XML Request</TableHead>
                <TableHead>XML Response</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {primaryData.breReportDetails.map((row, index) => (
                <TableRow key={`primary-${index}`}>
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
                      onClick={() => viewXml(row.request || 'No XML available', `Request for ${row.applicationId}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewXml(row.response || 'No XML available', `Response for ${row.applicationId}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
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

        {/* Secondary API Table */}
        {secondaryData && (
          <Card className="mb-8">
            <h2 className="text-xl font-semibold p-4 border-b">Secondary API Results</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>XML Request</TableHead>
                  <TableHead>XML Response</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {secondaryData.breReportDetails.map((row, index) => (
                  <TableRow key={`secondary-${index}`}>
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
                        onClick={() => viewXml(row.request || 'No XML available', `Request for ${row.applicationId}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewXml(row.response || 'No XML available', `Response for ${row.applicationId}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
        )}

        {/* XML Viewer Dialog */}
        <XmlViewer 
          xml={xmlViewerState.content}
          title={xmlViewerState.title}
          isOpen={xmlViewerState.isOpen}
          onClose={() => setXmlViewerState(prev => ({ ...prev, isOpen: false }))}
        />
      </main>
    </div>
  );
};

export default Report;
