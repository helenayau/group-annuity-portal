'use client';

import { Download } from '@carbon/icons-react';
import {
  Button,
  Modal,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
  Tile
} from '@carbon/react';
import { useState } from 'react';
import {
  pensionDocumentCategories,
  type PensionDocumentCategory
} from '@/constants/mock-api-pension';
import { downloadPensionDocument } from '../documents';
import { usePension } from '../pension-context';
import styles from '../portal.module.scss';
import { useNotify } from './toasts';

const categories = Object.keys(pensionDocumentCategories) as PensionDocumentCategory[];

export function EDocuments() {
  const { participant } = usePension();
  const notify = useNotify();
  const [open, setOpen] = useState<PensionDocumentCategory | null>(null);
  const details = open ? pensionDocumentCategories[open] : null;

  return (
    <>
      <div className={styles.grid3}>
        {categories.map((category) => {
          const item = pensionDocumentCategories[category];
          return (
            <Tile key={category} className={styles.tile}>
              <h2 className={styles.tileTitle}>{item.label}</h2>
              <p className={styles.tileBody}>{item.description}</p>
              <div className={styles.tileActions}>
                <Button kind='tertiary' size='sm' onClick={() => setOpen(category)}>
                  {item.actionLabel}
                </Button>
              </div>
            </Tile>
          );
        })}
      </div>

      <Modal
        open={details !== null}
        passiveModal
        size='md'
        modalHeading={details?.label ?? ''}
        onRequestClose={() => setOpen(null)}
      >
        <p className={styles.tileBody}>{details?.description}</p>
        <StructuredListWrapper aria-label={details?.label ?? 'Documents'}>
          <StructuredListBody>
            {details?.documents.map((doc) => (
              <StructuredListRow key={doc.id}>
                <StructuredListCell>
                  <p className={styles.value}>{doc.title}</p>
                  <p className={styles.label}>{doc.date}</p>
                  <p className={styles.tileBody}>{doc.description}</p>
                </StructuredListCell>
                <StructuredListCell>
                  <Button
                    kind='ghost'
                    size='sm'
                    renderIcon={Download}
                    onClick={() => {
                      downloadPensionDocument(doc, participant);
                      notify(`${doc.title} downloaded`);
                    }}
                  >
                    Download
                  </Button>
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Modal>
    </>
  );
}
