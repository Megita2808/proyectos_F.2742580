export const metadata = {
  title: ' Nueva contraseña | AguaMarina',
  description: 'Ingresa tu nueva contraseña',
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
