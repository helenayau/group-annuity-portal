'use client';

import { DocumentPdf } from '@carbon/icons-react';
import { Button, Tile } from '@carbon/react';
import { useState } from 'react';
import { grossMonthlyPayment, pensionPlan } from '@/constants/mock-api-pension';
import { formatCurrencyCents } from '@/features/annuity/utils';
import { downloadPensionIncomeLetter, downloadWithholdingForm } from '../documents';
import { usePension } from '../pension-context';
import styles from '../portal.module.scss';
import { PaymentHistory } from './payment-history';
import { PaymentSettingsModal } from './payment-settings-modal';
import { useNotify } from './toasts';

export function AccountDetails() {
  const { participant, accounts, setAccounts } = usePension();
  const notify = useNotify();
  const [editingPayments, setEditingPayments] = useState(false);

  return (
    <>
      <div className={styles.grid3}>
        <Tile className={styles.tile}>
          <h2 className={styles.tileTitle}>Gross monthly payments</h2>
          <p className={styles.amount}>{formatCurrencyCents(grossMonthlyPayment)}</p>
          <p className={styles.tileBody}>Paid to {accounts.length} account(s)</p>
          <div className={styles.tileActions}>
            <Button kind='tertiary' size='sm' onClick={() => setEditingPayments(true)}>
              Edit payment settings
            </Button>
          </div>
        </Tile>

        <Tile className={styles.tile}>
          <h2 className={styles.tileTitle}>Tax withholding forms</h2>
          <p className={styles.tileBody}>View your federal and state tax withholding forms.</p>
          <div className={styles.tileActions}>
            <Button
              kind='tertiary'
              size='sm'
              onClick={() => {
                downloadWithholdingForm('federal', participant);
                notify('Federal withholding form downloaded');
              }}
            >
              View federal taxes
            </Button>
            <Button
              kind='tertiary'
              size='sm'
              onClick={() => {
                downloadWithholdingForm('state', participant);
                notify('State withholding form downloaded');
              }}
            >
              View state taxes
            </Button>
          </div>
        </Tile>

        <Tile className={styles.tile}>
          <h2 className={styles.tileTitle}>Income verification letter</h2>
          <p className={styles.eyebrow}>
            For {participant.firstName} {participant.lastName}
          </p>
          <p className={styles.tileBody}>
            Your income verification letter documents your income as a participant of{' '}
            {pensionPlan.planName}.
          </p>
          <div className={styles.tileActions}>
            <Button
              kind='tertiary'
              size='sm'
              renderIcon={DocumentPdf}
              onClick={() => {
                downloadPensionIncomeLetter(participant, accounts, grossMonthlyPayment);
                notify('Income verification letter downloaded');
              }}
            >
              Download letter
            </Button>
          </div>
        </Tile>
      </div>

      <PaymentHistory />

      {editingPayments && (
        <PaymentSettingsModal
          accounts={accounts}
          onClose={() => setEditingPayments(false)}
          onSave={(updated) => {
            setAccounts(updated);
            setEditingPayments(false);
          }}
        />
      )}
    </>
  );
}
