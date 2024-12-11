export const metadata = {
  title: ' Perfil | AguaMarina',
  description: 'Modifica tu perfil',
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
