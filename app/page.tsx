'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1 className='text-3xl font-bold underline'> Hi!!!</h1>
      <Button
        onClick={() => {
          router.push('/dashboard');
        }}
      >
        Dashboard
      </Button>
    </div>
  );
}
