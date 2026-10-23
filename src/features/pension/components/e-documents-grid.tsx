'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  pensionDocumentCategories,
  type PensionDocumentCategory
} from '@/constants/mock-api-pension';
import { downloadPensionDocument } from '../documents';
import { usePension } from '../pension-context';

const categories = Object.keys(pensionDocumentCategories) as PensionDocumentCategory[];

function DocumentsDialog({
  category,
  onOpenChange
}: {
  category: PensionDocumentCategory | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { participant } = usePension();
  const details = category ? pensionDocumentCategories[category] : null;

  return (
    <Dialog open={category !== null} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{details?.label}</DialogTitle>
          <DialogDescription>{details?.description}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          {details?.documents.map((doc) => (
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
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

export function EDocumentsGrid() {
  const [open, setOpen] = useState<PensionDocumentCategory | null>(null);

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {categories.map((category) => {
        const details = pensionDocumentCategories[category];
        return (
          <Card key={category} className='h-full'>
            <CardHeader>
              <CardTitle>{details.label}</CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground flex-1 text-sm'>
              {details.description}
            </CardContent>
            <CardFooter>
              <Button variant='outline' size='sm' onClick={() => setOpen(category)}>
                {details.actionLabel}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
      <DocumentsDialog category={open} onOpenChange={(isOpen) => !isOpen && setOpen(null)} />
    </div>
  );
}
