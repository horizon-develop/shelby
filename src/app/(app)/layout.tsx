import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-stone-900 font-sans">
        <Navbar />
        <main className="py-10">{children}</main>
      </div>
    </Providers>
  );
}
