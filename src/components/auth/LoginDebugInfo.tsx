interface LoginAttemptInfo {
  enteredUsername: string;
  enteredPassword?: string;
  comparisonResults?: any;
  isVisible: boolean;
}

interface LoginDebugInfoProps {
  loginAttempt: LoginAttemptInfo;
}

const LoginDebugInfo = ({ loginAttempt }: LoginDebugInfoProps) => {
  if (!loginAttempt.isVisible) return null;

  return (
    <div className="mt-4 p-3 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Login attempt information:</h3>
      <p><strong>Entered username:</strong> {loginAttempt.enteredUsername}</p>
      {loginAttempt.enteredPassword && <p><strong>Entered password:</strong> {loginAttempt.enteredPassword}</p>}
      
      <p className="mt-2 text-sm text-blue-600">
        Database query executed...
      </p>
      
      {loginAttempt.comparisonResults && loginAttempt.comparisonResults.databaseQueryInfo && (
        <div className="mt-2">
          <p><strong>Executed SQL query:</strong></p>
          <pre className="text-xs bg-blue-50 p-2 mt-1 overflow-auto rounded">
            {loginAttempt.comparisonResults.databaseQueryInfo.query || "Query not executed"}
          </pre>
          
          <p className="mt-2"><strong>Client type:</strong></p>
          <pre className="text-xs bg-green-50 p-2 mt-1 overflow-auto rounded">
            {loginAttempt.comparisonResults.databaseQueryInfo.clientType || "Not specified"}
          </pre>
          
          <p className="mt-2"><strong>Query execution date and time:</strong></p>
          <pre className="text-xs p-2 mt-1 overflow-auto rounded">
            {loginAttempt.comparisonResults.databaseQueryInfo.timestamp || "Unknown"}
          </pre>
          
          {loginAttempt.comparisonResults.databaseQueryInfo.error && (
            <div className="mt-2">
              <p className="font-semibold text-red-700"><strong>Query error:</strong></p>
              <pre className="text-xs bg-red-50 p-2 mt-1 overflow-auto rounded text-red-700">
                {loginAttempt.comparisonResults.databaseQueryInfo.error}
              </pre>
            </div>
          )}
        </div>
      )}
      
      {loginAttempt.comparisonResults && loginAttempt.comparisonResults.allCafeOwners && (
        <div className="mt-2">
          <p className="font-semibold text-green-700">
            <strong>All cafe owners in database ({loginAttempt.comparisonResults.allCafeOwners.length}):</strong>
          </p>
          {loginAttempt.comparisonResults.allCafeOwners.length === 0 ? (
            <p className="text-red-500 mt-2">No cafe owners found in database</p>
          ) : (
            <div className="max-h-[400px] overflow-auto mt-2 border rounded">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">Name</th>
                    <th className="py-2 px-4 border-b text-left">Username</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loginAttempt.comparisonResults.allCafeOwners.map((owner, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{owner.id}</td>
                      <td className="py-2 px-4">{owner.name}</td>
                      <td className="py-2 px-4 font-mono">{owner.username}</td>
                      <td className="py-2 px-4">{owner.email}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          owner.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {owner.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-xs">{new Date(owner.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {loginAttempt.comparisonResults && loginAttempt.comparisonResults.mockDataCheck && (
        <div className="mt-4 pt-2 border-t">
          <p><strong>Mock data check:</strong></p>
          <pre className="text-xs bg-yellow-50 p-2 mt-1 overflow-auto max-h-[200px] rounded">
            {JSON.stringify(loginAttempt.comparisonResults.mockDataCheck, null, 2)}
          </pre>
        </div>
      )}
      
      {loginAttempt.comparisonResults && loginAttempt.comparisonResults.userExistsCheck && (
        <div className="mt-2">
          <p><strong>Database search results:</strong></p>
          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-auto max-h-[200px] rounded">
            {JSON.stringify(loginAttempt.comparisonResults.userExistsCheck.result || {}, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LoginDebugInfo;
