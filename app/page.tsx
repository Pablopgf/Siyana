import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/background.png`,
  button: {
    title: 'Siyana Studio Mini App',
    action: {
      type: 'launch_frame',
      name: 'Siyana Studio Mini App',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Siyana Studio Mini App',
    openGraph: {
      title: 'Siyana Studio Mini App',
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
