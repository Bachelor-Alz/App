import Toast, { ToastType } from "@/components/Toast";
import React, { createContext, ReactNode, useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type ToastItem = {
  id: number;
  title: string;
  message: string;
  type: ToastType;
};

type HandlePromiseOptions<T> = {
  title?: string;
  promise: Promise<T>;
};

type ToastContextType = {
  handlePromise: <T>(options: HandlePromiseOptions<T>) => Promise<T>;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const theme = useTheme();

  const showToast = (title: string, message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const handlePromise = async <T,>({ promise, title }: HandlePromiseOptions<T>): Promise<T> => {
    try {
      const result = await promise;
      const message = typeof result === "string" ? result : "Operation successful";
      showToast(title || "Success", message, "success");
      return result;
    } catch (error) {
      const message = typeof error === "string" ? error : "An error occurred";
      showToast(title || "Error", message, "error");
      throw error;
    }
  };

  return (
    <ToastContext.Provider value={{ handlePromise }}>
      {children}
      <SafeAreaView style={[StyleSheet.absoluteFill, { alignItems: "center" }]} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            type={toast.type}
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
