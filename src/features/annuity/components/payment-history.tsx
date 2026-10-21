'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
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
import { payments, type Payment, type PaymentStatus } from '@/constants/mock-api-annuity';
import { formatCurrencyCents } from '../utils';
import {
  PaymentStatusBadge,
  paymentStatusDescriptions,
  paymentStatusLabels
} from './payment-status-badge';

const INITIAL_ROWS = 6;

function PaymentDetailDialog({
  payment,
  onOpenChange
}: {
  payment: Payment | null;
  onOpenChange: (open: boolean) => void;
}) {
  const rows: Array<[string, string]> = payment
    ? [
        ['Payment date', payment.date],
        ['Type', payment.type],
        ['Gross amount', formatCurrencyCents(payment.grossAmount)],
        ['Federal tax withheld', `-${formatCurrencyCents(payment.federalWithholding)}`],
        ['State tax withheld', `-${formatCurrencyCents(payment.stateWithholding)}`],
        ['Net amount', formatCurrencyCents(payment.netAmount)],
        ['Method', `${payment.method} to account ending ${payment.accountLast4}`]
      ]
    : [];

  return (
    <Dialog open={payment !== null} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Payment details</DialogTitle>
          <DialogDescription>
            {payment && paymentStatusDescriptions[payment.status]}
          </DialogDescription>
        </DialogHeader>
        {payment && (
          <dl className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <dt className='text-muted-foreground'>Status</dt>
              <dd>
                <PaymentStatusBadge status={payment.status} />
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
          {(Object.keys(paymentStatusLabels) as PaymentStatus[]).map((status) => (
            <div key={status} className='rounded-lg border p-3'>
              <dt>
                <PaymentStatusBadge status={status} />
              </dt>
              <dd className='text-muted-foreground mt-1.5'>{paymentStatusDescriptions[status]}</dd>
            </div>
          ))}
        </dl>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

export function PaymentHistory() {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [statusHelpOpen, setStatusHelpOpen] = useState(false);
  const visiblePayments = showAll ? payments : payments.slice(0, INITIAL_ROWS);

  return (
    <Card id='payment-history' className='scroll-mt-20'>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>Income payments and withdrawals in 2026</CardDescription>
        <CardAction>
          <Button variant='link' size='sm' onClick={() => setStatusHelpOpen(true)}>
            What does status mean?
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Gross</TableHead>
              <TableHead className='text-right'>Net amount</TableHead>
              <TableHead>
                <span className='sr-only'>Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiblePayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell className='text-muted-foreground'>{payment.method}</TableCell>
                <TableCell className='text-muted-foreground tabular-nums'>
                  *****{payment.accountLast4}
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>
                <TableCell className='text-right tabular-nums'>
                  {formatCurrencyCents(payment.grossAmount)}
                </TableCell>
                <TableCell className='text-right tabular-nums'>
                  {formatCurrencyCents(payment.netAmount)}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='link'
                    size='sm'
                    aria-label={`View ${payment.type.toLowerCase()} on ${payment.date}`}
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
      {payments.length > INITIAL_ROWS && (
        <CardFooter>
          <Button variant='outline' size='sm' onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show fewer' : `View all ${payments.length} payments`}
          </Button>
        </CardFooter>
      )}
      <PaymentDetailDialog payment={selected} onOpenChange={(open) => !open && setSelected(null)} />
      <StatusHelpDialog open={statusHelpOpen} onOpenChange={setStatusHelpOpen} />
    </Card>
  );
}
