import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Cafe Management System</h1>
        <p className="text-xl text-gray-600">Choose a page to navigate to</p>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          size="lg" 
          onClick={() => navigate('/login')}
          className="min-w-[250px]"
        >
          Login Page
        </Button>
        
        <Button 
          size="lg" 
          onClick={() => navigate('/cafe-owners-table')}
          className="min-w-[250px]"
        >
          Cafe Owners Table
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => navigate('/super-admin')}
          className="min-w-[250px]"
        >
          Super Admin Panel
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => navigate('/cafe-admin')}
          className="min-w-[250px]"
        >
          Cafe Admin Panel
        </Button>
      </div>
    </div>
  );
};

export default Index;
