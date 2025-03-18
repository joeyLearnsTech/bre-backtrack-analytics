
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { HomeIcon, BarChart3Icon } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="border-b px-4 py-3 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => navigate('/')}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => navigate('/report')}
          >
            <BarChart3Icon className="h-5 w-5" />
            <span>Reports</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};
