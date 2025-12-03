import ClientHome from '@/components/ClientHome';

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ClientHome searchParams={searchParams} />;
}
