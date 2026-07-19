export function getFirebaseErrorMessage(err: any): string {
  const code = err?.code || "";
  const map: Record<string, string> = {
    "auth/invalid-credential": "ইমেইল অথবা পাসওয়ার্ড ভুল",
    "auth/user-not-found": "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট নেই",
    "auth/too-many-requests": "অনেকবার চেষ্টা করেছেন, একটু পরে চেষ্টা করুন",
  };
  return map[code] || err?.message || "লগইন failed হয়েছে";
}