
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen max-h-screen overflow-hidden">
      <>{children}</>
    </main>
  );
}