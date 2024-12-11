export const metadata = {
  title: ' Mis Reservas | AguaMarina',
  description: 'Mira tus reservas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
