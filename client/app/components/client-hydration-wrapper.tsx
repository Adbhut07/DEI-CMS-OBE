'use client';

import { useState, useEffect } from "react";

export default function ClientHydrationWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [isHydrated, setIsHydrated] = useState(false);

  // This effect runs once after initial render, confirming client hydration is complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Return a simplified initial UI during server rendering and first render on client
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  // Once hydrated, render full UI
  return <>{children}</>;
}