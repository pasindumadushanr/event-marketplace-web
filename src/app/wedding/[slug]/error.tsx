"use client";
export default function InvitationError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-serif">Please try again in a moment</h1>
      <p className="my-4">The invitation could not load right now.</p>
      <button
        className="rounded-xl bg-emerald-900 px-6 py-3 text-white"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
