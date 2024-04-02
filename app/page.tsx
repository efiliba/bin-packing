import dynamic from 'next/dynamic';

const BinPacking = dynamic(() => import('../components/BinPacking'), { ssr: false })

export default function Home() {
  return (
    <main className="py-2">
      <BinPacking />
    </main>
  );
}
