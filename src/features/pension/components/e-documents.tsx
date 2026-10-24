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
import { useRef, useState } from 'react';
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
  // The button that opened the modal, so Carbon can return focus to it on close.
  const launcher = useRef<HTMLButtonElement | null>(null);

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
                  <Button
                    kind='ghost'
                    size='sm'
                    onClick={(e) => {
                      launcher.current = e.currentTarget;
                      setOpen(category);
                    }}
                  >
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
        launcherButtonRef={launcher}
      >
        <div data-modal-primary-focus tabIndex={-1} className={styles.modalBody}>
          <p className={styles.tileBody}>{details?.description}</p>
        </div>
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
