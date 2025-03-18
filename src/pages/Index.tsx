
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from '@/components/Navigation';
import { Upload, Database, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/upload/file', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
        navigate('/report');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const handleFetchData = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/fetch/data?startDate=${startDate}&endDate=${endDate}`);
      
      if (response.ok) {
        navigate('/report');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">BRE Backtesting Tool</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload XML File Card */}
          <Card className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Upload className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Upload XML File</h2>
              </div>
              <Label htmlFor="file-upload">Select XML File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xml"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <Button onClick={handleFileUpload} className="w-full">
                Upload and Process
              </Button>
            </div>
          </Card>

          {/* Fetch from Database Card */}
          <Card className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold">Fetch from Database</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <div className="relative">
                    <Calendar className="h-4 w-4 absolute top-3 left-3 text-gray-500" />
                    <Input
                      id="start-date"
                      type="date"
                      className="pl-10"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <div className="relative">
                    <Calendar className="h-4 w-4 absolute top-3 left-3 text-gray-500" />
                    <Input
                      id="end-date"
                      type="date"
                      className="pl-10"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleFetchData} className="w-full">
                Fetch Data
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
