import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '20px', textAlign: 'center', fontSize: '24px', color: 'green' }}>
        Якщо ви це бачите, QueryClientProvider працює!
      </div>
    </QueryClientProvider>
  );
};

export default App;
