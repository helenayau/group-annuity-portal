'use client';

import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import type { PensionDocument } from '@/constants/mock-api-pension';
import { downloadPensionDocument } from '../documents';
import { usePension } from '../pension-context';

export function DocumentList({ documents }: { documents: PensionDocument[] }) {
  const { participant } = usePension();

  return (
    <div className='flex flex-col gap-3'>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className='flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between'
        >
          <div className='flex items-start gap-3'>
            <Icons.fileTypePdf className='text-muted-foreground mt-0.5 size-5 shrink-0' />
            <div>
              <div className='text-sm font-medium'>{doc.title}</div>
              <div className='text-muted-foreground text-xs'>{doc.date}</div>
              <p className='text-muted-foreground mt-1 text-sm'>{doc.description}</p>
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            className='self-start sm:self-center'
            onClick={() => {
              downloadPensionDocument(doc, participant);
              toast.success(`${doc.title} downloaded`);
            }}
          >
            Download
          </Button>
        </div>
      ))}
    </div>
  );
}
