import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function OtherDetailsCard() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Need to update other details?</CardTitle>
      </CardHeader>
      <CardContent className='text-muted-foreground flex-1 text-sm'>
        You can update your email address, password, and other preferences on your profile.
      </CardContent>
      <CardFooter>
        <Link
          href='/pension/profile'
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          Go to profile
        </Link>
      </CardFooter>
    </Card>
  );
}
