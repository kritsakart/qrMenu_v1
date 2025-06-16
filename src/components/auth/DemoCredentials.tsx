import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DemoCredentials = () => {
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [copiedCafe, setCopiedCafe] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: 'admin' | 'cafe') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'admin') {
        setCopiedAdmin(true);
        setTimeout(() => setCopiedAdmin(false), 2000);
      } else {
        setCopiedCafe(true);
        setTimeout(() => setCopiedCafe(false), 2000);
      }
      toast({
        title: "Скопійовано",
        description: `Логін "${text}" скопійовано в буфер обміну`,
      });
    } catch (err) {
      console.error('Не вдалося скопіювати текст:', err);
      toast({
        variant: "destructive",
        title: "Помилка копіювання",
        description: "Не вдалося скопіювати текст в буфер обміну"
      });
    }
  };

  return (
    <div className="text-sm text-center text-muted-foreground">
      <p>Демо-входи:</p>
      <p className="mt-1 flex items-center justify-center">
        Адмін: 
        <span className="font-mono mx-1">admin</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => copyToClipboard("admin", 'admin')}
          title="Копіювати логін"
        >
          {copiedAdmin ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </Button>
        / 
        Пароль:
        <span className="font-mono ml-1">admin</span>
      </p>
      <p className="mt-2 flex items-center justify-center">
        Код локації кафе:
        <span className="font-mono mx-1">cafe6096</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => copyToClipboard("cafe6096", 'cafe')}
          title="Копіювати логін"
        >
          {copiedCafe ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </Button>
      </p>
    </div>
  );
};

export default DemoCredentials;
