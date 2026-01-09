import '@/app/ui/global.css';
import { inter, urbanist } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased flex flex-col h-full`}>
        {/* Site header */}
        <header className={`p-4 border-b ${urbanist.className}`}>
          <h1 className="text-2xl font-semibold">HSIYA</h1>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
