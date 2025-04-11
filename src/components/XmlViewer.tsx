
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface XmlViewerProps {
  xml: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const XmlViewer: React.FC<XmlViewerProps> = ({ xml, title, isOpen, onClose }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(xml);
    toast({
      title: "Copied to clipboard",
      description: "XML content has been copied to clipboard",
    });
  };

  const downloadXml = () => {
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>XML {title}</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadXml}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="bg-gray-50 p-4 rounded-md overflow-auto flex-grow">
          <pre className="text-xs">{xml}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default XmlViewer;
