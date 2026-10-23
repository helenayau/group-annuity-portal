'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  pensionPayments,
  pensionPlan,
  type PensionPayment,
  type PensionPaymentStatus
} from '@/constants/mock-api-pension';
import { formatCurrencyCents } from '@/features/annuity/utils';
import { pillButton } from '../styles';

const INITIAL_ROWS = 3;

const statusLabels: Record<PensionPaymentStatus, string> = {
  processing: 'Processing',
  transmitted: 'Transmitted',
  returned: 'Returned'
};

const statusDescriptions: Record<PensionPaymentStatus, string> = {
  processing: 'The payment is being prepared and will be sent to your bank on the payment date.',
  transmitted: 'The payment was sent to your bank. Funds usually post within 1-2 business days.',
  returned:
    'Your bank sent the payment back, usually because the account was closed. Update your payment settings and we will reissue it.'
};

function StatusBadge({ status }: { status: PensionPaymentStatus }) {
  return (
    <Badge variant={status === 'transmitted' ? 'secondary' : 'outline'}>
      {statusLabels[status]}
    </Badge>
  );
}

function PaymentDetailDialog({
  payment,
  onOpenChange
}: {
  payment: PensionPayment | null;
  onOpenChange: (open: boolean) => void;
}) {
  const rows: Array<[string, string]> = payment
    ? [
        ['Payment date', payment.date],
        ['Net amount', formatCurrencyCents(payment.netAmount)],
        ['Federal tax withheld', formatCurrencyCents(0)],
        ['State tax withheld', formatCurrencyCents(0)],
        ['Method', payment.method],
        ['Account number', `*****${payment.accountLast4}`]
      ]
    : [];

  return (
    <Dialog open={payment !== null} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Payment details</DialogTitle>
          <DialogDescription>{payment && statusDescriptions[payment.status]}</DialogDescription>
        </DialogHeader>
        {payment && (
          <dl className='flex flex-col gap-2 text-sm'>
            <div className='flex items-center justify-between'>
              <dt className='text-muted-foreground'>Status</dt>
              <dd>
                <StatusBadge status={payment.status} />
              </dd>
            </div>
            {rows.map(([label, value]) => (
              <div key={label} className='flex justify-between gap-4'>
                <dt className='text-muted-foreground'>{label}</dt>
                <dd className='text-right tabular-nums'>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

function StatusHelpDialog({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>What does status mean?</DialogTitle>
        </DialogHeader>
        <dl className='flex flex-col gap-3'>
          {(Object.keys(statusLabels) as PensionPaymentStatus[]).map((status) => (
            <div key={status} className='rounded-lg border p-3'>
              <dt>
                <StatusBadge status={status} />
              </dt>
              <dd className='text-muted-foreground mt-1.5 text-sm'>{statusDescriptions[status]}</dd>
            </div>
          ))}
        </dl>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

export function PensionPaymentHistory() {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<PensionPayment | null>(null);
  const [statusHelpOpen, setStatusHelpOpen] = useState(false);
  const visiblePayments = showAll ? pensionPayments : pensionPayments.slice(0, INITIAL_ROWS);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment history</CardTitle>
        <CardDescription>As of {pensionPlan.asOfDate}</CardDescription>
        <div>
          <Button
            variant='link'
            size='sm'
            className='h-auto px-0'
            onClick={() => setStatusHelpOpen(true)}
          >
            What does status mean?
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Net amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Account number</TableHead>
              <TableHead>Payment date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className='sr-only'>Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiblePayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className='tabular-nums'>
                  {formatCurrencyCents(payment.netAmount)}
                </TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell className='tabular-nums'>*****{payment.accountLast4}</TableCell>
                <TableCell className='tabular-nums'>{payment.date}</TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='link'
                    size='sm'
                    aria-label={`View payment to account ending ${payment.accountLast4} on ${payment.date}`}
                    onClick={() => setSelected(payment)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button
          variant='outline'
          size='sm'
          className={pillButton}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show fewer' : 'View all'}
        </Button>
      </CardFooter>
      <PaymentDetailDialog payment={selected} onOpenChange={(open) => !open && setSelected(null)} />
      <StatusHelpDialog open={statusHelpOpen} onOpenChange={setStatusHelpOpen} />
    </Card>
  );
}
