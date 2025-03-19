import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { Upload, Database, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    toast({ title, description, variant });
  };
  

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return showToast("Error", "Please select a file to upload", "destructive");
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload/file", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        showToast("Success", "File uploaded successfully");
        navigate("/report", {
          state: { reportData: data, source: "fileUpload", fileName: selectedFile.name },
        });
      } else {
        throw new Error();
      }
    } catch {
      showToast("Error", "Failed to upload file", "destructive");
    }
  };

  const handleFetchData = async () => {
    if (!startDate || !endDate) {
      return showToast("Error", "Please select both start and end dates", "destructive");
    }

    try {
      // const response = await fetch(`/api/fetch/data?startDate=${startDate}&endDate=${endDate}`);
      const response = {
        "count": 10,
        "breReportDetails": [
          {
            "applicationId": "237",
            "status": "FAILED",
            "responseTime": "Mar 18, 2025, 6:15:30 PM IST"
          },
          {
            "applicationId": "582",
            "status": "SUCCESS",
            "responseTime": "Mar 18, 2025, 6:16:05 PM IST"
          },
          {
            "applicationId": "812",
            "status": "FAILED",
            "responseTime": "Mar 18, 2025, 6:16:45 PM IST"
          },
          {
            "applicationId": "145",
            "status": "SUCCESS",
            "responseTime": "Mar 18, 2025, 6:17:20 PM IST"
          },
          {
            "applicationId": "987",
            "status": "FAILED",
            "responseTime": "Mar 18, 2025, 6:18:00 PM IST"
          },
          {
            "applicationId": "356",
            "status": "SUCCESS",
            "responseTime": "Mar 18, 2025, 6:18:30 PM IST"
          },
          {
            "applicationId": "620",
            "status": "SUCCESS",
            "responseTime": "Mar 18, 2025, 6:19:10 PM IST"
          },
          {
            "applicationId": "731",
            "status": "SUCCESS",
            "responseTime": "Mar 18, 2025, 6:19:45 PM IST"
          },
          {
            "applicationId": "864",
            "status": "SUCCESS",
            "responseTime": "Mar 18, 2025, 6:20:20 PM IST"
          },
          {
            "applicationId": "475",
            "status": "SUCCESS",
            "responseTime": "Mar 18, 2025, 6:21:00 PM IST"
          }
        ]
      }
      

      if (response) {
        // const data = await response.json();
        const data = response;
        navigate("/report", {
          state: { reportData: data, source: "databaseFetch", queryParams: { startDate, endDate } },
        });
      } else {
        throw new Error();
      }
    } catch {
      showToast("Error", "Failed to fetch data", "destructive");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">BRE Backtesting Tool</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload XML File */}
          <Card className="p-6">
            <div className="space-y-4">
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

          {/* Fetch from Database */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold">Fetch from Database</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "start-date", label: "Start Date", value: startDate, setValue: setStartDate },
                  { id: "end-date", label: "End Date", value: endDate, setValue: setEndDate },
                ].map(({ id, label, value, setValue }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <div className="relative">
                      <Calendar className="h-4 w-4 absolute top-3 left-3 text-gray-500" />
                      <Input id={id} type="date" className="pl-10" value={value} onChange={(e) => setValue(e.target.value)} />
                    </div>
                  </div>
                ))}
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
