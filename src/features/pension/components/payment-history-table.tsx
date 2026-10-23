'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { pensionPayments } from '@/constants/mock-api-pension';
import { formatCurrency } from '@/features/annuity/utils';
import { copy } from '../copy';
import { usePensionActions } from '../pension-context';
import { PaymentStatusBadge } from './payment-status';

const INITIAL_ROWS = 3;
const { columns } = copy.paymentHistory;

export function usePaymentRows() {
  const [showAll, setShowAll] = useState(false);
  return {
    rows: showAll ? pensionPayments : pensionPayments.slice(0, INITIAL_ROWS),
    showAll,
    toggle: () => setShowAll(!showAll)
  };
}

export function PaymentHistoryTable({ rows }: { rows: typeof pensionPayments }) {
  const { viewPayment } = usePensionActions();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{columns.netAmount}</TableHead>
          <TableHead>{columns.method}</TableHead>
          <TableHead>{columns.accountNumber}</TableHead>
          <TableHead>{columns.paymentDate}</TableHead>
          <TableHead>{columns.status}</TableHead>
          <TableHead>
            <span className='sr-only'>Details</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className='font-medium tabular-nums'>
              {formatCurrency(payment.netAmount)}
            </TableCell>
            <TableCell>{payment.method}</TableCell>
            <TableCell className='tabular-nums'>*****{payment.accountLast4}</TableCell>
            <TableCell className='tabular-nums'>{payment.date}</TableCell>
            <TableCell>
              <PaymentStatusBadge status={payment.status} />
            </TableCell>
            <TableCell className='text-right'>
              <Button
                variant='link'
                size='sm'
                aria-label={`${copy.paymentHistory.view} payment on ${payment.date}`}
                onClick={() => viewPayment(payment)}
              >
                {copy.paymentHistory.view}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ViewAllButton({ showAll, onClick }: { showAll: boolean; onClick: () => void }) {
  return (
    <Button variant='outline' size='sm' onClick={onClick}>
      {showAll ? 'Show fewer' : copy.paymentHistory.viewAll}
    </Button>
  );
}
