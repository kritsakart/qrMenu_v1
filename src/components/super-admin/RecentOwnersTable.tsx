import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CafeOwner } from "@/types/models";

interface RecentOwnersTableProps {
  owners: CafeOwner[];
  isLoading: boolean;
  error: Error | null;
}

export const RecentOwnersTable = ({ owners, isLoading, error }: RecentOwnersTableProps) => {
  const [copiedIds, setCopiedIds] = useState<Record<string, 'username' | 'password' | null>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const copyToClipboard = async (text: string, ownerId: string, type: 'username' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIds(prev => ({...prev, [ownerId]: type}));
      toast({
        title: "Copied",
        description: `${type === 'username' ? 'Username' : 'Password'} "${text}" copied to clipboard`,
      });
      
      // Remove copied status after 2 seconds
      setTimeout(() => {
        setCopiedIds(prev => {
          const newState = {...prev};
          if (newState[ownerId] === type) {
            newState[ownerId] = null;
          }
          return newState;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast({
        variant: "destructive",
        title: "Copy error",
        description: "Failed to copy text to clipboard"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  } 

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Failed to load data</p>
        <Button 
          variant="outline" 
          size="sm"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  } 

  if (owners.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No café owners registered</p>
        <p className="text-sm mt-1">
          Register new café owners from the Café Owners page
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credentials</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {owners.slice(0, 5).map((owner) => (
            <tr
              key={owner.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={(e) => {
                // Ignore click if it was on a copy button
                if ((e.target as HTMLElement).closest('button')) {
                  e.stopPropagation();
                  return;
                }
                navigate("/super-admin/cafe-owners");
              }}
            >
              <td className="px-4 py-4 whitespace-nowrap">{owner.name}</td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Username:</span>
                    <span>{owner.username}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(owner.username, owner.id, 'username');
                      }}
                      title="Copy username"
                    >
                      {copiedIds[owner.id] === 'username' ? 
                        <Check size={14} className="text-green-500" /> : 
                        <Copy size={14} />
                      }
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Password:</span>
                    <span>{owner.password}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(owner.password, owner.id, 'password');
                      }}
                      title="Copy password"
                    >
                      {copiedIds[owner.id] === 'password' ? 
                        <Check size={14} className="text-green-500" /> : 
                        <Copy size={14} />
                      }
                    </Button>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">{owner.email}</td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  owner.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {owner.status === "active" ? "active" : "inactive"}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(owner.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
