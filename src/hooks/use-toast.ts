
import { toast as sonnerToast, type Toast } from "sonner";

type ToastProps = Toast;

type ToastActionElement = React.ReactElement;

export const toast = sonnerToast;

export function useToast() {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
  };
}
