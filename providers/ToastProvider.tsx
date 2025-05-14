import Toast from "@/components/Toast";
import React, { createContext, ReactNode, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ToastItem = {
  id: number;
  title: string;
  message: string;
};

type ToastContextType = {
  addToast: (title: string, message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const theme = useTheme();

  const addToast = (title: string, message: string) => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, title, message }]);
    setTimeout(() => {
      setToasts((prev) => {
        return prev.filter((toast) => toast.id !== toastId);
      });
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <SafeAreaView
        style={[{ alignItems: "center", position: "absolute", zIndex: 10 }]}
        pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            theme={theme}
          />
        ))}
      </SafeAreaView>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export { ToastProvider, useToast };
