import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AdminLoginFormProps {
  username: string;
  password: string;
  isSubmitting: boolean;
  loading: boolean;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
}

const AdminLoginForm = ({
  username,
  password,
  isSubmitting,
  loading,
  setUsername,
  setPassword,
  handleLogin,
}: AdminLoginFormProps) => {
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Ім'я користувача</Label>
        <Input
          id="username"
          type="text"
          placeholder="Введіть ім'я адміністратора"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          placeholder="Введіть пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {(isSubmitting || loading) ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Вхід...
          </>
        ) : (
          "Увійти як адмін"
        )}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
