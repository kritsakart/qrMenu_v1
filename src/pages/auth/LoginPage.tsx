import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CafeLoginForm from "@/components/auth/CafeLoginForm";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import LoginDebugInfo from "@/components/auth/LoginDebugInfo";
import DemoCredentials from "@/components/auth/DemoCredentials";
import { fetchCafeOwners } from "@/utils/fetchCafeOwners";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"cafe" | "admin">("cafe");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState<{
    enteredUsername: string;
    enteredPassword?: string;
    comparisonResults?: any;
    isVisible: boolean;
  }>({
    enteredUsername: "",
    isVisible: false
  });
  
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Use useEffect to handle redirection after authentication
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || "/";
      const redirectPath = from === "/" 
        ? (isAuthenticated ? "/super-admin" : "/cafe-admin") 
        : from;
      
      // Add a small delay to avoid too many redirects
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, location.state]);

  const loadCafeOwners = async () => {
    try {
      console.log("Отримання інформації про адміністративне підключення...");
      
      // Note: We avoid direct access to protected properties here
      console.log("Спроба підключення до бази даних...");
      
      // Спроба отримати дані для перевірки підключення
      const connectionData = {
        timestamp: new Date().toISOString(),
        query: "SELECT * FROM cafe_owners",
        clientType: "supabaseAdmin"
      };
      
      // Отримання всіх власників кафе
      const cafeOwners = await fetchCafeOwners();
      
      // Збереження результатів для відображення
      setLoginAttempt(prev => ({
        ...prev,
        comparisonResults: {
          ...(prev.comparisonResults || {}),
          allCafeOwners: cafeOwners || [],
          databaseQueryInfo: {
            query: connectionData.query,
            clientType: connectionData.clientType,
            totalResults: cafeOwners?.length || 0,
            timestamp: connectionData.timestamp
          }
        },
        isVisible: true
      }));
      
    } catch (error) {
      console.error("Помилка завантаження власників кафе:", error);
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      
      setLoginAttempt(prev => ({
        ...prev,
        comparisonResults: {
          ...(prev.comparisonResults || {}),
          databaseQueryInfo: {
            error: errorMessage,
            timestamp: new Date().toISOString()
          }
        },
        isVisible: true
      }));
      
      setLoginError(`Помилка підключення до бази даних: ${errorMessage}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    try {
      setIsSubmitting(true);
      
      // Зберігаємо введені дані
      setLoginAttempt({
        enteredUsername: username,
        enteredPassword: loginType === "admin" ? password : undefined,
        isVisible: true
      });
      
      // Завантажуємо список власників кафе з бази даних
      await loadCafeOwners();
      
      // Продовжуємо стандартний потік логіну
      if (loginType === "cafe") {
        // Вхід для власника кафе - потрібно тільки ім'я користувача
        if (!username) {
          setLoginError("Будь ласка, введіть код локації");
          return;
        }
        
        // Передаємо введене значення без змін
        await login(username);
        console.log("Логін успішний");
      } else {
        // Вхід для адміністратора - потрібні ім'я користувача та пароль
        if (!username || !password) {
          setLoginError("Будь ласка, введіть ім'я користувача та пароль");
          return;
        }
        
        await login(username, password);
        console.log("Логін адміністратора успішний");
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError(loginType === "cafe" 
          ? "Помилка при вході. Перевірте код локації та спробуйте знову." 
          : "Помилка при вході. Перевірте облікові дані адміністратора та спробуйте знову.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginTypeChange = (val: string) => {
    setLoginType(val as "cafe" | "admin");
    setLoginError(""); // Очищаємо помилки при зміні типу входу
    setUsername("");
    setPassword("");
  };

  const handleTestDatabaseConnection = async () => {
    setIsSubmitting(true);
    try {
      // Перевірка підключення та отримання діагностичної інформації
      await loadCafeOwners();
    } catch (error) {
      console.error("Помилка перевірки підключення:", error);
      setLoginError(`Помилка підключення до бази даних: ${error instanceof Error ? error.message : 'Невідома помилка'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Digital Menu Builder</CardTitle>
          <CardDescription>
            Оберіть тип входу та введіть облікові дані
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="cafe" onValueChange={handleLoginTypeChange} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cafe">Локація кафе</TabsTrigger>
              <TabsTrigger value="admin">Адміністратор</TabsTrigger>
            </TabsList>

            <TabsContent value="cafe" className="mt-4">
              <CafeLoginForm 
                username={username}
                isSubmitting={isSubmitting}
                loading={loading}
                setUsername={setUsername}
                handleLogin={handleLogin}
              />
            </TabsContent>

            <TabsContent value="admin" className="mt-4">
              <AdminLoginForm
                username={username}
                password={password}
                isSubmitting={isSubmitting}
                loading={loading}
                setUsername={setUsername}
                setPassword={setPassword}
                handleLogin={handleLogin}
              />
            </TabsContent>
          </Tabs>
          
          <div className="mt-4">
            <button
              onClick={handleTestDatabaseConnection}
              className="w-full px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Перевірка підключення..." : "Перевірити підключення до бази даних"}
            </button>
          </div>
          
          <LoginDebugInfo loginAttempt={loginAttempt} />
        </CardContent>
        <CardFooter className="flex flex-col">
          <DemoCredentials />
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
