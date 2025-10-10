"use client";

import { useEffect, useState } from "react";
import { checkAuthorization } from "@/lib/api";
import { useRouter } from "next/navigation";

/**
 * Hook to protect routes with authentication check
 * Redirects to unauthorized page if user is not authorized
 * Silent check - no UI shown to user during verification
 */
export function useAuthProtection() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const result = await checkAuthorization();
        
        if (!result.authorized) {
          console.warn('⚠️ Unauthorized access attempt. Redirecting to unauthorized page...');
          console.warn('Message:', result.message);
          
          // Clear any session data
          localStorage.removeItem("pepper-session");
          
          // Redirect to unauthorized page
          router.replace("/unauthorized");
        } else {
          console.log('✅ Authorization verified');
          setIsAuthorized(true);
          setIsChecking(false);
        }
      } catch (error) {
        console.error('❌ Authorization check failed:', error);
        // On error, redirect to unauthorized page for security
        localStorage.removeItem("pepper-session");
        router.replace("/unauthorized");
      }
    };

    verifyAuth();
  }, [router]);

  return { isAuthorized, isChecking };
}
