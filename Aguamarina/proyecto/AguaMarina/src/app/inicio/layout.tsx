export const metadata = {
  title: ' Ingreso | AguaMarina',
  description: 'Ingresar',
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
