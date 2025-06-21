import { useEffect, useState } from "react";
import { fetchCafeOwners } from "@/utils/fetchCafeOwners";
import { CafeOwner } from "@/types/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CafeOwnersTable = () => {
  const [owners, setOwners] = useState<CafeOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIds, setCopiedIds] = useState<Record<string, 'username' | 'password' | null>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCafeOwners();
      setOwners(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      toast({
        variant: "destructive",
        title: "Loading error",
        description: message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const copyToClipboard = async (text: string, ownerId: string, type: 'username' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIds(prev => ({...prev, [ownerId]: type}));
      toast({
        title: "Copied",
        description: `${type === 'username' ? 'Username' : 'Password'} "${text}" copied to clipboard`,
      });
      
      // Reset copied status after 2 seconds
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cafe Owners List</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadOwners} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="secondary" onClick={handleBackClick}>
            Back to Home
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cafe Owners in Database</CardTitle>
          <CardDescription>
            Full list of all cafe owners registered in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>Error: {error}</p>
            </div>
          ) : owners.length === 0 ? (
            <div className="text-center py-10">
              <p>No registered cafe owners in database</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell>{owner.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-mono">{owner.username}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(owner.username, owner.id, 'username')}
                            title="Copy username"
                          >
                            {copiedIds[owner.id] === 'username' ? 
                              <Check size={14} className="text-green-500" /> : 
                              <Copy size={14} />
                            }
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-mono">{owner.password}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(owner.password, owner.id, 'password')}
                            title="Copy password"
                          >
                            {copiedIds[owner.id] === 'password' ? 
                              <Check size={14} className="text-green-500" /> : 
                              <Copy size={14} />
                            }
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            owner.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {owner.status === "active" ? "active" : "inactive"}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(owner.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CafeOwnersTable;
