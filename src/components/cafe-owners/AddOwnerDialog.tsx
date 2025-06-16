
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabaseAdmin } from "@/integrations/supabase/admin-client";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface AddOwnerDialogProps {
  onOwnerAdded: () => void;
}

interface OwnerFormData {
  name: string;
  email: string;
  isActive: boolean;
}

export const AddOwnerDialog = ({ onOwnerAdded }: AddOwnerDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<OwnerFormData>({
    defaultValues: {
      name: "",
      email: "",
      isActive: true,
    }
  });

  const handleAddOwner = async (formData: OwnerFormData) => {
    try {
      setIsSubmitting(true);
      
      console.log("Adding new cafe owner:", formData);
      
      // Generate random username and password
      const username = `cafe${Math.floor(Math.random() * 10000)}`;
      const password = Math.random().toString(36).slice(-8);
      
      // Create new cafe owner in the database using the admin client to bypass RLS
      const { data, error } = await supabaseAdmin
        .from("cafe_owners")
        .insert([
          {
            username,
            password,
            name: formData.name,
            email: formData.email,
            status: formData.isActive ? "active" : "inactive"
          }
        ])
        .select();
      
      if (error) {
        console.error("Insert error:", error);
        let errorMessage = "Не вдалося додати кафе-власника.";
        
        if (error.message.includes("email")) {
          errorMessage += " Такий email вже існує.";
        } else if (error.message.includes("username")) {
          errorMessage += " Такий логін вже існує.";
        } else if (error.message.includes("violates row-level security policy")) {
          errorMessage += " Проблема з доступом до бази даних.";
        }
        
        throw new Error(errorMessage);
      }
      
      console.log("New cafe owner added successfully:", data);
      
      // Close dialog and reset form
      setIsOpen(false);
      form.reset({
        name: "",
        email: "",
        isActive: true,
      });
      
      toast({
        title: "Кафе-власника додано",
        description: (
          <div>
            <p><strong>Логін:</strong> {username}</p>
            <p><strong>Пароль:</strong> {password}</p>
            <p className="text-xs mt-2 text-muted-foreground">Не забудьте зберегти ці дані, оскільки пароль більше не буде доступний у чистому вигляді.</p>
          </div>
        ),
      });
      
      // Call callback to update owners list
      onOwnerAdded();
    } catch (error: any) {
      console.error("Error adding cafe owner:", error);
      toast({
        variant: "destructive",
        title: "Помилка",
        description: error.message || "Не вдалося додати кафе-власника."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Додати власника кафе</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додати нового власника кафе</DialogTitle>
          <DialogDescription>
            Створіть новий акаунт власника кафе. Система згенерує логін та пароль.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddOwner)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва кафе</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Введіть назву кафе" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Введіть email адресу" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <FormLabel>Активний</FormLabel>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Скасувати
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="inline-flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full border-white"></span>
                    Додавання...
                  </span>
                ) : (
                  'Додати власника кафе'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
