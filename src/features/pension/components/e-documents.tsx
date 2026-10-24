'use client';

import { Download } from '@carbon/icons-react';
import {
  Button,
  Column,
  Grid,
  Modal,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
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
      <Grid withRowGap>
        {categories.map((category) => {
          const item = pensionDocumentCategories[category];
          return (
            <Column key={category} sm={4} md={4} lg={4}>
              <Tile className={styles.tile}>
                <h2 className={styles.tileTitle}>{item.label}</h2>
                <p className={styles.tileBody}>{item.description}</p>
                <div className={styles.tileActions}>
                  <Button kind='tertiary' size='sm' onClick={() => setOpen(category)}>
                    {item.actionLabel}
                  </Button>
                </div>
              </Tile>
            </Column>
          );
        })}
      </Grid>

      <Modal
        open={details !== null}
        passiveModal
        size='md'
        modalHeading={details?.label ?? ''}
        onRequestClose={() => setOpen(null)}
      >
        <p className={styles.tileBody}>{details?.description}</p>
        <StructuredListWrapper aria-label={details?.label ?? 'Documents'}>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Document</StructuredListCell>
              <StructuredListCell head>Action</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
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
