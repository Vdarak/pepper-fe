"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthProtection } from "@/hooks/useAuthProtection";

export default function DashboardPage() {
  const { isAuthorized, isChecking } = useAuthProtection();
  const router = useRouter();

  useEffect(() => {
    // Redirect to jobs page once authorized
    if (isAuthorized && !isChecking) {
      router.push("/jobs");
    }
  }, [isAuthorized, isChecking, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
