
import { ReactNode } from "react";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;
