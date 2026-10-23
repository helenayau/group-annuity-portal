'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { copy } from '../../copy';
import { useLayoutOption } from '../../layout-option';
import { usePension, usePensionActions } from '../../pension-context';
import { ActionGroup, ActionRow, AddressLines, Description, SettingRow } from '../typography';

function useAddressLines() {
  const { participant } = usePension();
  return [
    `${participant.firstName} ${participant.lastName}`,
    participant.addressLine1,
    `${participant.city}, ${participant.state} ${participant.zip}`
  ];
}

// Cards: the details on file get the wide card with an inline Edit; the
// pointer to the profile sits beside it.
function CardsFormat() {
  const actions = usePensionActions();
  const lines = useAddressLines();

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
      <Card className='md:col-span-3'>
        <CardHeader>
          <CardTitle>{copy.personalDetails.title}</CardTitle>
          <CardAction>
            <Button variant='outline' size='sm' onClick={actions.editPersonalDetails}>
              <Icons.edit />
              {copy.personalDetails.action}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='flex items-start gap-4 rounded-lg border p-4'>
            <span className='bg-muted flex size-10 shrink-0 items-center justify-center rounded-full'>
              <Icons.user className='size-5' />
            </span>
            <AddressLines lines={lines} />
          </div>
        </CardContent>
      </Card>
      <Card className='bg-muted/50 md:col-span-2'>
        <CardHeader>
          <CardTitle>{copy.otherDetails.title}</CardTitle>
        </CardHeader>
        <CardContent className='flex-1'>
          <Description>{copy.otherDetails.body}</Description>
        </CardContent>
        <CardFooter>
          <Button variant='outline' size='sm' onClick={actions.goToProfile}>
            {copy.otherDetails.action}
            <Icons.arrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function ListFormat() {
  const actions = usePensionActions();
  const lines = useAddressLines();

  return (
    <Card className='gap-0 py-0'>
      <div className='divide-y'>
        <SettingRow title={copy.personalDetails.title} description={<AddressLines lines={lines} />}>
          <Button variant='outline' size='sm' onClick={actions.editPersonalDetails}>
            {copy.personalDetails.action}
          </Button>
        </SettingRow>
        <SettingRow
          title={copy.otherDetails.title}
          description={<Description>{copy.otherDetails.body}</Description>}
        >
          <Button variant='outline' size='sm' onClick={actions.goToProfile}>
            {copy.otherDetails.action}
          </Button>
        </SettingRow>
      </div>
    </Card>
  );
}

function TasksFormat() {
  const actions = usePensionActions();
  const lines = useAddressLines();

  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col gap-8'>
      <ActionGroup title={copy.personalDetails.title} description={<AddressLines lines={lines} />}>
        <ActionRow
          icon={Icons.userPen}
          label={copy.personalDetails.action}
          onClick={actions.editPersonalDetails}
        />
      </ActionGroup>
      <ActionGroup
        title={copy.otherDetails.title}
        description={<Description>{copy.otherDetails.body}</Description>}
      >
        <ActionRow
          icon={Icons.settings}
          label={copy.otherDetails.action}
          onClick={actions.goToProfile}
        />
      </ActionGroup>
    </div>
  );
}

export function PersonalDetailsTab() {
  const [layout] = useLayoutOption();
  if (layout === 'list') return <ListFormat />;
  if (layout === 'tasks') return <TasksFormat />;
  return <CardsFormat />;
}
