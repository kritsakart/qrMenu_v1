
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, User } from "lucide-react";

interface CafeLoginFormProps {
  username: string;
  isSubmitting: boolean;
  loading: boolean;
  setUsername: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
}

const CafeLoginForm = ({
  username,
  isSubmitting,
  loading,
  setUsername,
  handleLogin,
}: CafeLoginFormProps) => {
  const handleLocationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Store the raw input value without modifications
    console.log("Введення в полі локації:", value);
    console.log("Тип значення:", typeof value);
    console.log("Код символів:", Array.from(value).map(c => c.charCodeAt(0)));
    setUsername(value);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-code">Код локації</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="location-code"
            type="text"
            placeholder="Введіть код локації кафе"
            value={username}
            onChange={handleLocationCodeChange}
            required
            disabled={isSubmitting}
            className="pl-10"
            autoComplete="off"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Введіть унікальний код локації кафе для входу (наприклад, cafe6333)
        </p>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {(isSubmitting || loading) ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Вхід...
          </>
        ) : (
          "Увійти в кафе"
        )}
      </Button>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Для тестового входу використовуйте: <strong>cafe6333</strong>
        </AlertDescription>
      </Alert>
    </form>
  );
};

export default CafeLoginForm;
