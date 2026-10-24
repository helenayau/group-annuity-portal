'use client';

import {
  Button,
  Link,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag
} from '@carbon/react';
import { useState } from 'react';
import {
  pensionPayments,
  pensionPlan,
  type PensionPayment,
  type PensionPaymentStatus
} from '@/constants/mock-api-pension';
import { formatCurrencyCents } from '@/features/annuity/utils';
import styles from '../portal.module.scss';

const INITIAL_ROWS = 3;

const statusLabels: Record<PensionPaymentStatus, string> = {
  processing: 'Processing',
  transmitted: 'Transmitted',
  returned: 'Returned'
};

const statusTags: Record<PensionPaymentStatus, 'blue' | 'green' | 'red'> = {
  processing: 'blue',
  transmitted: 'green',
  returned: 'red'
};

const statusDescriptions: Record<PensionPaymentStatus, string> = {
  processing: 'The payment is being prepared and will be sent to your bank on the payment date.',
  transmitted: 'The payment was sent to your bank. Funds usually post within 1-2 business days.',
  returned:
    'Your bank sent the payment back, usually because the account was closed. Update your payment settings and we will reissue it.'
};

function StatusTag({ status }: { status: PensionPaymentStatus }) {
  return (
    <Tag type={statusTags[status]} size='sm'>
      {statusLabels[status]}
    </Tag>
  );
}

const headers = ['Net amount', 'Method', 'Account number', 'Payment date', 'Status'];

export function PaymentHistory() {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<PensionPayment | null>(null);
  const [statusHelpOpen, setStatusHelpOpen] = useState(false);
  const rows = showAll ? pensionPayments : pensionPayments.slice(0, INITIAL_ROWS);

  return (
    <div className={styles.section}>
      <TableContainer
        title='Payment history'
        description={
          <>
            As of {pensionPlan.asOfDate}
            <br />
            <Link
              href='#payment-status'
              onClick={(e) => {
                e.preventDefault();
                setStatusHelpOpen(true);
              }}
            >
              What does status mean?
            </Link>
          </>
        }
      >
        <div className={styles.tableScroll}>
          <Table aria-label='Payment history'>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader key={header}>{header}</TableHeader>
                ))}
                <TableHeader>
                  <span className='cds--visually-hidden'>Details</span>
                </TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatCurrencyCents(payment.netAmount)}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>*****{payment.accountLast4}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <StatusTag status={payment.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      kind='ghost'
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
        </div>
        <div className={styles.tableActions}>
          <Button kind='tertiary' size='sm' onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show fewer' : 'View all'}
          </Button>
        </div>
      </TableContainer>

      <Modal
        open={selected !== null}
        passiveModal
        size='sm'
        modalHeading='Payment details'
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <p className={styles.tileBody}>{statusDescriptions[selected.status]}</p>
            <dl className={`${styles.definition} ${styles.section}`}>
              {(
                [
                  ['Status', <StatusTag key='s' status={selected.status} />],
                  ['Net amount', formatCurrencyCents(selected.netAmount)],
                  ['Federal tax withheld', formatCurrencyCents(0)],
                  ['State tax withheld', formatCurrencyCents(0)],
                  ['Method', selected.method],
                  ['Account number', `*****${selected.accountLast4}`],
                  ['Payment date', selected.date]
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className={styles.label}>{label}</dt>
                  <dd className={styles.value}>{value}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </Modal>

      <Modal
        open={statusHelpOpen}
        passiveModal
        size='sm'
        modalHeading='What does status mean?'
        onRequestClose={() => setStatusHelpOpen(false)}
      >
        <dl className={styles.definition}>
          {(Object.keys(statusLabels) as PensionPaymentStatus[]).map((status) => (
            <div key={status}>
              <dt>
                <StatusTag status={status} />
              </dt>
              <dd className={styles.value}>{statusDescriptions[status]}</dd>
            </div>
          ))}
        </dl>
      </Modal>
    </div>
  );
}
