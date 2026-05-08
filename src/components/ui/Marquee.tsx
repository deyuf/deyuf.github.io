import type { ReactNode } from "react";

export function Marquee({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden border-y border-border py-6">
      <div className="flex w-max gap-12 marquee-track will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
}
