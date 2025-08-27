import type { SafeAreaInsets } from '@/types'

interface SafeAreaContainerProps {
  children: React.ReactNode
  insets?: SafeAreaInsets
  className?: string
}

export const SafeAreaContainer = ({
  children,
  insets,
  className = "",
}: SafeAreaContainerProps) => (
  <main
    className={`flex min-h-screen flex-col items-center justify-center gap-y-3 ${className}`}
    style={{
      marginTop: insets?.top ?? 0,
      marginBottom: insets?.bottom ?? 0,
      marginLeft: insets?.left ?? 0,
      marginRight: insets?.right ?? 0,
    }}
  >
    {children}
  </main>
)
