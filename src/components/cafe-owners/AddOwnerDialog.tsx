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
        let errorMessage = "Failed to add cafe owner.";
        
        if (error.message.includes("email")) {
          errorMessage += " Such email already exists.";
        } else if (error.message.includes("username")) {
          errorMessage += " Such username already exists.";
        } else if (error.message.includes("violates row-level security policy")) {
          errorMessage += " Database access problem.";
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
        title: "Cafe Owner Added",
        description: (
          <div>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Password:</strong> {password}</p>
            <p className="text-xs mt-2 text-muted-foreground">Please save these credentials as the password will not be available in plain text again.</p>
          </div>
        ),
      });
      
      // Call callback to update owners list
      onOwnerAdded();
    } catch (error: any) {
      console.error("Error adding cafe owner:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add cafe owner."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Cafe Owner</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Cafe Owner</DialogTitle>
          <DialogDescription>
            Create a new cafe owner account. The system will generate username and password.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddOwner)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cafe Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter cafe name" 
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
                      placeholder="Enter email address" 
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
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Owner"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
