'use client';

import {
  Button,
  DataTable,
  Link,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag
} from '@carbon/react';
import { Fragment, useState } from 'react';
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

const headers = [
  { key: 'netAmount', header: 'Net amount' },
  { key: 'method', header: 'Method' },
  { key: 'account', header: 'Account number' },
  { key: 'date', header: 'Payment date' },
  { key: 'status', header: 'Status' },
  { key: 'details', header: 'Details' }
];

export function PaymentHistory() {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<PensionPayment | null>(null);
  const [statusHelpOpen, setStatusHelpOpen] = useState(false);
  const payments = showAll ? pensionPayments : pensionPayments.slice(0, INITIAL_ROWS);
  const rows = payments.map((payment) => ({
    id: payment.id,
    netAmount: formatCurrencyCents(payment.netAmount),
    method: payment.method,
    account: `*****${payment.accountLast4}`,
    date: payment.date,
    status: payment.status,
    details: payment.id
  }));

  function renderCell(key: string, value: unknown, payment: PensionPayment) {
    if (key === 'status') return <StatusTag status={value as PensionPaymentStatus} />;
    if (key === 'details') {
      return (
        <Button
          kind='ghost'
          size='sm'
          aria-label={`View payment to account ending ${payment.accountLast4} on ${payment.date}`}
          onClick={() => setSelected(payment)}
        >
          View
        </Button>
      );
    }
    return value as string;
  }

  return (
    <>
      <DataTable rows={rows} headers={headers}>
        {({
          rows,
          headers,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getTableContainerProps
        }) => (
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
            {...getTableContainerProps()}
          >
            <div className={styles.tableScroll}>
              <Table {...getTableProps()} aria-label='Payment history'>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => {
                      const { key, ...headerProps } = getHeaderProps({ header });
                      return (
                        <TableHeader key={key} {...headerProps}>
                          {header.key === 'details' ? (
                            <span className='cds--visually-hidden'>{header.header}</span>
                          ) : (
                            header.header
                          )}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const payment = pensionPayments.find((p) => p.id === row.id)!;
                    const { key, ...rowProps } = getRowProps({ row });
                    return (
                      <TableRow key={key} {...rowProps}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {renderCell(cell.info.header, cell.value, payment)}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className={styles.tableActions}>
              <Button kind='ghost' size='sm' onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show fewer' : 'View all'}
              </Button>
            </div>
          </TableContainer>
        )}
      </DataTable>

      <Modal
        open={selected !== null}
        passiveModal
        size='sm'
        modalHeading='Payment details'
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <Stack gap={5}>
            <p className={styles.tileBody}>{statusDescriptions[selected.status]}</p>
            <dl className={styles.details}>
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
                <Fragment key={label}>
                  <dt className={styles.label}>{label}</dt>
                  <dd className={styles.value}>{value}</dd>
                </Fragment>
              ))}
            </dl>
          </Stack>
        )}
      </Modal>

      <Modal
        open={statusHelpOpen}
        passiveModal
        size='sm'
        modalHeading='What does status mean?'
        onRequestClose={() => setStatusHelpOpen(false)}
      >
        <dl className={styles.details}>
          {(Object.keys(statusLabels) as PensionPaymentStatus[]).map((status) => (
            <Fragment key={status}>
              <dt>
                <StatusTag status={status} />
              </dt>
              <dd className={styles.value}>{statusDescriptions[status]}</dd>
            </Fragment>
          ))}
        </dl>
      </Modal>
    </>
  );
}
