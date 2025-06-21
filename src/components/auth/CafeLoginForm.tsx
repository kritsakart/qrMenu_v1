import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Info } from "lucide-react";

interface CafeLoginFormProps {
  username: string;
  isSubmitting: boolean;
  loading: boolean;
  setUsername: (username: string) => void;
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
    console.log("Location field input:", value);
    console.log("Value type:", typeof value);
    console.log("Character codes:", Array.from(value).map(c => c.charCodeAt(0)));
    setUsername(value);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-code">Location Code</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="location-code"
            type="text"
            placeholder="Enter cafe location code"
            value={username}
            onChange={handleLocationCodeChange}
            required
            disabled={isSubmitting}
            className="pl-10"
            autoComplete="off"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the unique cafe location code to log in
        </p>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
        {(isSubmitting || loading) ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Logging in...
          </>
        ) : (
          "Login to Cafe"
        )}
      </Button>
    </form>
  );
};

export default CafeLoginForm;
