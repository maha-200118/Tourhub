'use client';

import { useEffect } from 'react';

/**
 * Global Firebase Error Handler
 * Suppresses non-critical Firebase errors (like user closing popup)
 * while still allowing other errors to be logged
 */
export default function FirebaseErrorHandler() {
  useEffect(() => {
    // Suppress Firebase console errors for expected user actions
    const originalError = console.error;
    
    console.error = function(...args: any[]) {
      const errorMessage = args[0]?.toString() || '';
      
      // Suppress these non-critical Firebase errors
      const suppressedErrors = [
        'auth/popup-closed-by-user',
        'FirebaseError: Firebase: Error (auth/popup-closed-by-user)',
      ];
      
      const shouldSuppress = suppressedErrors.some(err => 
        errorMessage.includes(err)
      );
      
      if (!shouldSuppress) {
        // Call original console.error for all other errors
        originalError.apply(console, args);
      }
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
