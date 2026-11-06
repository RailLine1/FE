import { Toast } from '@/components/Toast';
import { useErrorToastMessage } from '@/lib/errorToast';

export function ErrorToast() {
  const message = useErrorToastMessage();
  return message ? <Toast message={message} icon={false} /> : null;
}
