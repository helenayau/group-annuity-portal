'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  pensionDocumentCategories,
  type PensionDocumentCategory
} from '@/constants/mock-api-pension';
import { cn } from '@/lib/utils';
import { copy } from '../../copy';
import { useLayoutOption } from '../../layout-option';
import { usePensionActions } from '../../pension-context';
import { DocumentList } from '../document-list';
import { ActionGroup, ActionRow } from '../typography';

const categories = Object.keys(pensionDocumentCategories) as PensionDocumentCategory[];

const categoryIcons: Record<PensionDocumentCategory, (typeof Icons)[keyof typeof Icons]> = {
  'tax-forms': Icons.fileTypePdf,
  'welcome-kits': Icons.post,
  'annuity-certificates': Icons.badgeCheck,
  'smr-output': Icons.fileTypeXls
};

// Cards: four equal tiles in one row, each with an icon for quick recognition.
function CardsFormat() {
  const actions = usePensionActions();

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {categories.map((category) => {
        const details = pensionDocumentCategories[category];
        const Icon = categoryIcons[category];
        return (
          <Card key={category}>
            <CardHeader>
              <span className='bg-muted mb-2 flex size-10 items-center justify-center rounded-lg'>
                <Icon className='size-5' />
              </span>
              <CardTitle>{details.label}</CardTitle>
              <CardDescription>{details.description}</CardDescription>
            </CardHeader>
            <CardFooter className='mt-auto'>
              <Button variant='outline' size='sm' onClick={() => actions.viewDocuments(category)}>
                {details.actionLabel}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

// List: pick a type on the left and its documents show right away,
// no popup needed.
function ListFormat() {
  const [selected, setSelected] = useState<PensionDocumentCategory>('tax-forms');
  const details = pensionDocumentCategories[selected];

  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-start'>
      <nav
        aria-label={copy.sections.documents}
        className='bg-card flex gap-1 overflow-x-auto rounded-xl border p-2 md:w-60 md:shrink-0 md:flex-col'
      >
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const isActive = category === selected;
          return (
            <Button
              key={category}
              variant='ghost'
              aria-current={isActive ? 'true' : undefined}
              className={cn('shrink-0 justify-start md:w-full', isActive && 'bg-muted')}
              onClick={() => setSelected(category)}
            >
              <Icon />
              {pensionDocumentCategories[category].label}
            </Button>
          );
        })}
      </nav>
      <Card className='min-w-0 flex-1'>
        <CardHeader>
          <CardTitle>{details.label}</CardTitle>
          <CardDescription>{details.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentList documents={details.documents} />
        </CardContent>
      </Card>
    </div>
  );
}

function TasksFormat() {
  const actions = usePensionActions();

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-8'>
      <ActionGroup title={copy.sections.documents}>
        {categories.map((category) => {
          const details = pensionDocumentCategories[category];
          return (
            <ActionRow
              key={category}
              icon={categoryIcons[category]}
              label={details.actionLabel}
              hint={details.description}
              onClick={() => actions.viewDocuments(category)}
            />
          );
        })}
      </ActionGroup>
    </div>
  );
}

export function EDocumentsTab() {
  const [layout] = useLayoutOption();
  if (layout === 'list') return <ListFormat />;
  if (layout === 'tasks') return <TasksFormat />;
  return <CardsFormat />;
}
