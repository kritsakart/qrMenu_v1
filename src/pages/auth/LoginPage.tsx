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
      console.log("Getting administrative connection information...");
      
      // Note: We avoid direct access to protected properties here
      console.log("Attempting database connection...");
      
      // Attempt to get data for connection verification
      const connectionData = {
        timestamp: new Date().toISOString(),
        query: "SELECT * FROM cafe_owners",
        clientType: "supabaseAdmin"
      };
      
      // Get all cafe owners
      const cafeOwners = await fetchCafeOwners();
      
      // Save results for display
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
      console.error("Error loading cafe owners:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
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
      
      setLoginError(`Database connection error: ${errorMessage}`);
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
          setLoginError("Please enter the location code");
          return;
        }
        
        // Передаємо введене значення без змін
        await login(username);
        console.log("Login successful");
      } else {
        // Вхід для адміністратора - потрібні ім'я користувача та пароль
        if (!username || !password) {
          setLoginError("Please enter the username and password");
          return;
        }
        
        await login(username, password);
        console.log("Admin login successful");
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError(loginType === "cafe" 
          ? "Login error. Please check the location code and try again." 
          : "Login error. Please check the admin credentials and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginTypeChange = (val: string) => {
    setLoginType(val as "cafe" | "admin");
    setLoginError(""); // Clear errors when changing login type
    setUsername("");
    setPassword("");
  };

  const handleTestDatabaseConnection = async () => {
    setIsSubmitting(true);
    try {
      // Check connection and get diagnostic information
      await loadCafeOwners();
    } catch (error) {
      console.error("Connection check error:", error);
      setLoginError(`Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            Choose login type and enter your credentials
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
              <TabsTrigger value="cafe">Cafe Location</TabsTrigger>
              <TabsTrigger value="admin">Administrator</TabsTrigger>
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
              {isSubmitting ? "Checking connection..." : "Test Database Connection"}
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
