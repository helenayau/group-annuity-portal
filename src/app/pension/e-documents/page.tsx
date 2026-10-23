import { EDocumentsGrid } from '@/features/pension/components/e-documents-grid';

export const metadata = { title: 'E-documents' };

export default function Page() {
  return (
    <>
      <h2 className='sr-only'>E-documents</h2>
      <EDocumentsGrid />
    </>
  );
}
