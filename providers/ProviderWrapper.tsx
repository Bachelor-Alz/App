import { AuthenticationProvider } from "@/providers/AuthenticationProvider";


type CustomLayoutProps = {
  children: React.ReactNode;
};

const ProviderWrapper = ({ children }: CustomLayoutProps) => {
  return (
    <AuthenticationProvider>
      {children}
    </AuthenticationProvider>
  );
}

export default ProviderWrapper;