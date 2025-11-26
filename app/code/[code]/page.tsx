import { notFound } from 'next/navigation';

async function getLink(code: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${code}`);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
}

export default async function StatsPage({ params }: { params: { code: string } }) {
  let link;
  try {
    link = await getLink(params.code);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Stats for {link.code}</h1>
        <p><strong>Target URL:</strong> <span className="truncate block max-w-xs">{link.url}</span></p>
        <p><strong>Total Clicks:</strong> {link.clicks}</p>
        <p><strong>Last Clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : 'Never'}</p>
        <p><strong>Created At:</strong> {new Date(link.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}