import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PromptsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white selection:bg-violet-500 selection:text-white">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
