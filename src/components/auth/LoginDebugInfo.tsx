
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
      <h3 className="font-semibold mb-2">Інформація про спробу входу:</h3>
      <p><strong>Введений логін:</strong> {loginAttempt.enteredUsername}</p>
      {loginAttempt.enteredPassword && <p><strong>Введений пароль:</strong> {loginAttempt.enteredPassword}</p>}
      
      <p className="mt-2 text-sm text-blue-600">
        Запит до бази даних виконано...
      </p>
      
      {loginAttempt.comparisonResults && loginAttempt.comparisonResults.databaseQueryInfo && (
        <div className="mt-2">
          <p><strong>Виконаний SQL запит:</strong></p>
          <pre className="text-xs bg-blue-50 p-2 mt-1 overflow-auto rounded">
            {loginAttempt.comparisonResults.databaseQueryInfo.query || "Запит не виконано"}
          </pre>
          
          <p className="mt-2"><strong>Тип клієнта:</strong></p>
          <pre className="text-xs bg-green-50 p-2 mt-1 overflow-auto rounded">
            {loginAttempt.comparisonResults.databaseQueryInfo.clientType || "Не вказано"}
          </pre>
          
          <p className="mt-2"><strong>Дата і час виконання запиту:</strong></p>
          <pre className="text-xs p-2 mt-1 overflow-auto rounded">
            {loginAttempt.comparisonResults.databaseQueryInfo.timestamp || "Невідомо"}
          </pre>
          
          {loginAttempt.comparisonResults.databaseQueryInfo.error && (
            <div className="mt-2">
              <p className="font-semibold text-red-700"><strong>Помилка запиту:</strong></p>
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
            <strong>Всі власники кафе в базі даних ({loginAttempt.comparisonResults.allCafeOwners.length}):</strong>
          </p>
          {loginAttempt.comparisonResults.allCafeOwners.length === 0 ? (
            <p className="text-red-500 mt-2">Власників кафе не знайдено в базі даних</p>
          ) : (
            <div className="max-h-[400px] overflow-auto mt-2 border rounded">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">ID</th>
                    <th className="py-2 px-4 border-b text-left">Ім'я</th>
                    <th className="py-2 px-4 border-b text-left">Логін</th>
                    <th className="py-2 px-4 border-b text-left">Email</th>
                    <th className="py-2 px-4 border-b text-left">Статус</th>
                    <th className="py-2 px-4 border-b text-left">Створено</th>
                  </tr>
                </thead>
                <tbody>
                  {loginAttempt.comparisonResults.allCafeOwners.map((owner: any, index: number) => (
                    <tr key={owner.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="py-2 px-4 border-b">{owner.id}</td>
                      <td className="py-2 px-4 border-b">{owner.name}</td>
                      <td className="py-2 px-4 border-b">{owner.username}</td>
                      <td className="py-2 px-4 border-b">{owner.email}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-xs ${
                          owner.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {owner.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{new Date(owner.createdAt).toLocaleString()}</td>
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
          <p><strong>Перевірка в тестових даних:</strong></p>
          <pre className="text-xs bg-yellow-50 p-2 mt-1 overflow-auto max-h-[200px] rounded">
            {JSON.stringify(loginAttempt.comparisonResults.mockDataCheck, null, 2)}
          </pre>
        </div>
      )}
      
      {loginAttempt.comparisonResults && loginAttempt.comparisonResults.userExistsCheck && (
        <div className="mt-2">
          <p><strong>Результати пошуку в базі даних:</strong></p>
          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-auto max-h-[200px] rounded">
            {JSON.stringify(loginAttempt.comparisonResults.userExistsCheck.result || {}, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LoginDebugInfo;
