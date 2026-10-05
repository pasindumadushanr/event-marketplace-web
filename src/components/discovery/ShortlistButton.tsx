"use client";
import { Heart, Loader2 } from "lucide-react";
import { useShortlist } from "@/lib/shortlist-context";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function ShortlistButton({
  businessId,
  compact = false,
  onChange,
}: {
  businessId: string;
  compact?: boolean;
  onChange?: (saved: boolean) => void;
}) {
  const { user } = useAuth();
  const { favorites, loading, pending, error, refresh, toggle } =
    useShortlist();
  const saved = favorites.some((item) => item.business.id === businessId);
  const busy = pending.includes(businessId);
  return (
    <button
      type="button"
      aria-label={`${saved ? "Remove from" : "Save to"} shortlist`}
      aria-pressed={saved}
      disabled={!!user && (loading || busy)}
      className={
        compact
          ? "absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white z-10 shadow-sm disabled:opacity-50"
          : "flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50"
      }
      onClick={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) {
          toast.error("Please sign in to save your shortlist.");
          return;
        }
        if (error) {
          await refresh();
          toast.info("Shortlist reloaded. Please try saving again.");
          return;
        }
        try {
          await toggle(businessId);
          onChange?.(!saved);
          toast.success(
            saved ? "Removed from your shortlist" : "Saved to your shortlist",
          );
        } catch {
          toast.error("Couldn’t update your shortlist. Please try again.");
        }
      }}
    >
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart
          className={`h-5 w-5 ${saved ? "fill-rose-500 text-rose-500" : "text-slate-600"}`}
        />
      )}
      {!compact && (saved ? "Shortlisted" : "Save to shortlist")}
    </button>
  );
}
