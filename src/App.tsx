import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";

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
    <div style={{ padding: '20px', textAlign: 'center', fontSize: '24px', color: 'red' }}>
      Тестове повідомлення: Якщо ви це бачите, фронтенд працює!
    </div>
  );
};

export default App;
