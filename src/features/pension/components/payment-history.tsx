'use client';

import {
  Button,
  DataTable,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  DefinitionTooltip,
  Tag
} from '@carbon/react';
import { Fragment, useRef, useState } from 'react';
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

// Status column header as Carbon's DefinitionTooltip: the word itself is
// the trigger (dotted underline), which Carbon recommends for data tables
// where an extra info icon would add clutter. Opens on hover or focus.
// Plain text only: Carbon tooltips hold non-interactive, brief content.
function StatusHeader() {
  return (
    <DefinitionTooltip
      openOnHover
      align='bottom-start'
      className={styles.statusDefinition}
      definition={
        <span className={styles.definitionList}>
          {(Object.keys(statusLabels) as PensionPaymentStatus[]).map((status) => (
            <span key={status} className={styles.definitionItem}>
              <strong>{statusLabels[status]}:</strong> {statusDescriptions[status]}
            </span>
          ))}
        </span>
      }
    >
      Status
    </DefinitionTooltip>
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
  // The button that opened a modal, so Carbon can return focus to it on close.
  const launcher = useRef<HTMLButtonElement | null>(null);
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
          onClick={(e) => {
            launcher.current = e.currentTarget;
            setSelected(payment);
          }}
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
            description={`As of ${pensionPlan.asOfDate}`}
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
                          ) : header.key === 'status' ? (
                            <StatusHeader />
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
        launcherButtonRef={launcher}
      >
        {selected && (
          <Stack gap={5} data-modal-primary-focus tabIndex={-1} className={styles.modalBody}>
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
    </>
  );
}
