
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Система управління кафе</h1>
        <p className="text-xl text-gray-600">Оберіть сторінку для переходу</p>
      </div>
      
      <div className="flex flex-col gap-4">
        <Button 
          size="lg" 
          onClick={() => navigate('/login')}
          className="min-w-[250px]"
        >
          Сторінка входу
        </Button>
        
        <Button 
          size="lg" 
          onClick={() => navigate('/cafe-owners-table')}
          className="min-w-[250px]"
        >
          Таблиця власників кафе
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => navigate('/super-admin')}
          className="min-w-[250px]"
        >
          Панель Super Admin
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => navigate('/cafe-admin')}
          className="min-w-[250px]"
        >
          Панель Cafe Admin
        </Button>
      </div>
    </div>
  );
};

export default Index;
