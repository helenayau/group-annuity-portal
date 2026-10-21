import { Badge } from '@/components/ui/badge';
import type { PaymentStatus } from '@/constants/mock-api-annuity';

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  scheduled: 'Scheduled',
  processing: 'Processing',
  deposited: 'Deposited'
};

export const paymentStatusDescriptions: Record<PaymentStatus, string> = {
  scheduled: 'The payment is set up and will be sent on the payment date.',
  processing: 'The payment has been sent to your bank and should arrive within 1-2 business days.',
  deposited: 'Your bank has received the payment.'
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant={status === 'deposited' ? 'secondary' : 'outline'}>
      {paymentStatusLabels[status]}
    </Badge>
  );
}
