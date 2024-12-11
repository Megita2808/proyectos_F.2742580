export const metadata = {
  title: ' Registro | AguaMarina',
  description: 'Registrarse',
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
