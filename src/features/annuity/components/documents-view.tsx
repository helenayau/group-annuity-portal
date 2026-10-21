'use client';

import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  documentCategories,
  documents,
  type AnnuityDocument,
  type DocumentCategory
} from '@/constants/mock-api-annuity';
import {
  downloadAccountSummary,
  downloadAnnuityDocument,
  downloadIncomeVerificationLetter
} from '../documents';
import { ContractStrip } from './contract-strip';

const categories = Object.keys(documentCategories) as DocumentCategory[];

function DocumentRow({
  title,
  meta,
  description,
  actionLabel,
  onDownload
}: {
  title: string;
  meta: string;
  description: string;
  actionLabel: string;
  onDownload: () => void;
}) {
  return (
    <div className='flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-3'>
        <Icons.fileTypePdf className='text-muted-foreground mt-0.5 h-5 w-5 shrink-0' />
        <div>
          <div className='font-medium'>{title}</div>
          <div className='text-muted-foreground text-xs'>{meta}</div>
          <p className='text-muted-foreground mt-1 text-sm'>{description}</p>
        </div>
      </div>
      <Button
        variant='outline'
        size='sm'
        className='self-start sm:self-center'
        onClick={onDownload}
      >
        {actionLabel}
      </Button>
    </div>
  );
}

function DocumentList({ items }: { items: AnnuityDocument[] }) {
  return (
    <div className='flex flex-col gap-3'>
      {items.map((doc) => (
        <DocumentRow
          key={doc.id}
          title={doc.title}
          meta={`${documentCategories[doc.category].label} - ${doc.date}`}
          description={doc.description}
          actionLabel='Download'
          onDownload={() => {
            downloadAnnuityDocument(doc);
            toast.success(`${doc.title} downloaded`);
          }}
        />
      ))}
    </div>
  );
}

export function DocumentsView({ defaultCategory }: { defaultCategory?: string }) {
  const initialTab = categories.includes(defaultCategory as DocumentCategory)
    ? (defaultCategory as DocumentCategory)
    : 'all';

  return (
    <div className='flex min-w-0 flex-1 flex-col gap-4'>
      <ContractStrip />

      <Card>
        <CardHeader>
          <CardTitle>Create a Document</CardTitle>
          <CardDescription>Generated on demand with your latest values</CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
          <DocumentRow
            title='Income verification letter'
            meta='Updated daily'
            description='Confirms your guaranteed lifetime income for lenders or benefit applications'
            actionLabel='Create letter'
            onDownload={() => {
              downloadIncomeVerificationLetter();
              toast.success('Income verification letter downloaded');
            }}
          />
          <DocumentRow
            title='Account summary'
            meta='Updated daily'
            description='Account value, surrender value, income base, and strategy allocation'
            actionLabel='Create summary'
            onDownload={() => {
              downloadAccountSummary();
              toast.success('Account summary downloaded');
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>
            Statements, tax forms, and contract documents delivered electronically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={initialTab}>
            <TabsList className='flex-wrap'>
              <TabsTrigger value='all'>All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {documentCategories[category].label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value='all' className='mt-4'>
              <DocumentList items={documents} />
            </TabsContent>
            {categories.map((category) => (
              <TabsContent key={category} value={category} className='mt-4'>
                <p className='text-muted-foreground mb-3 text-sm'>
                  {documentCategories[category].description}
                </p>
                <DocumentList items={documents.filter((doc) => doc.category === category)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
