import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/feed.jpg`,
  button: {
    title: 'Siyana',
    action: {
      type: 'launch_frame',
      name: 'Siyana',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/siyana.png`,
      splashBackgroundColor: '#000000',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Siyana',
    openGraph: {
      title: 'Siyana',
      description: 'A template for building mini-apps on Farcaster and Monad',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <App />
}
