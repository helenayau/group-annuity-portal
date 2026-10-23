import { Badge } from '@/components/ui/badge';
import type { PensionPaymentStatus } from '@/constants/mock-api-pension';

export const statusLabels: Record<PensionPaymentStatus, string> = {
  processing: 'Processing',
  transmitted: 'Transmitted',
  returned: 'Returned'
};

export const statusDescriptions: Record<PensionPaymentStatus, string> = {
  processing: 'The payment is being prepared and will be sent to your bank on the payment date.',
  transmitted: 'The payment was sent to your bank. Funds usually post within 1-2 business days.',
  returned:
    'Your bank sent the payment back, usually because the account was closed. Update your payment settings and we will reissue it.'
};

export function PaymentStatusBadge({
  status,
  className
}: {
  status: PensionPaymentStatus;
  className?: string;
}) {
  return (
    <Badge variant={status === 'transmitted' ? 'secondary' : 'outline'} className={className}>
      {statusLabels[status]}
    </Badge>
  );
}
