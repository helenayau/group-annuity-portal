import PageContainer from '@/components/layout/page-container';
import { DocumentsView } from '@/features/annuity/components/documents-view';

export const metadata = { title: 'Documents' };

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <PageContainer pageTitle='Documents' pageDescription='Statements, tax forms, and your contract'>
      <DocumentsView key={category} defaultCategory={category} />
    </PageContainer>
  );
}
