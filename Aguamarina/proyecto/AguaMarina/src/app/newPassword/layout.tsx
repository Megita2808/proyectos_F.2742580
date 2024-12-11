export const metadata = {
  title: ' Recuperar contraseña | AguaMarina',
  description: 'Recupera tu contraseña',
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
