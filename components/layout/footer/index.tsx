'use client';

import { useState, useEffect } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear || '2024'} Joshtri Lenggu
        </p>
      </div>
    </footer>
  );
}