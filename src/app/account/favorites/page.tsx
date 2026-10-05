"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Columns3, MapPin, Star, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VendorCard } from "@/components/discovery/VendorCard";
import { useShortlist, ShortlistedVendor } from "@/lib/shortlist-context";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

function price(vendor: ShortlistedVendor) {
  return vendor.startingPrice > 0
    ? `From LKR ${Number(vendor.startingPrice).toLocaleString("en-LK")}`
    : "Price on request";
}

export default function CustomerFavoritesPage() {
  const { user, isLoading } = useAuth();
  const { favorites, loading, error, refresh, toggle, pending } =
    useShortlist();
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [recent, setRecent] = useState<ShortlistedVendor[]>([]);
  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("recentlyViewedBusinesses") || "[]",
      );
      if (Array.isArray(data))
        setRecent(data.filter((item) => item?.id && item?.name).slice(0, 4));
    } catch {
      /* Damaged browser history must not prevent opening the shortlist. */
    }
  }, []);
  const vendors = favorites.map((item) => item.business);
  const compared = selected
    .map((id) => vendors.find((vendor) => vendor.id === id))
    .filter(
      (vendor): vendor is ShortlistedVendor =>
        !!vendor && vendor.available !== false,
    );
  useEffect(() => {
    setSelected((ids) =>
      ids.filter((id) =>
        favorites.some(
          (item) =>
            item.business.id === id && item.business.available !== false,
        ),
      ),
    );
  }, [favorites]);
  function select(id: string) {
    setSelected((ids) =>
      ids.includes(id)
        ? ids.filter((value) => value !== id)
        : ids.length < 3
          ? [...ids, id]
          : ids,
    );
  }

  if (!isLoading && !user)
    return (
      <section className="rounded-2xl bg-white border p-8">
        <h2 className="text-2xl font-bold">Your wedding team, in one place</h2>
        <p className="my-4 text-slate-600">
          Sign in to save vendors and compare your shortlist across devices.
        </p>
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      </section>
    );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
          <Heart className="h-4 w-4" /> YOUR WEDDING TEAM
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mt-3">My shortlist</h2>
        <p className="mt-2 text-slate-600">
          Save the vendors you love. Select two or three to compare the details
          that matter.
        </p>
        <Link
          href="/search"
          className="inline-block mt-4 text-sm font-semibold underline text-slate-900"
        >
          Find more vendors
        </Link>
      </section>

      {error ? (
        <div role="alert" className="rounded-2xl border bg-white p-6">
          <p>{error}</p>
          <Button className="mt-3" onClick={refresh}>
            Try again
          </Button>
        </div>
      ) : loading ? (
        <p role="status">Loading your shortlist…</p>
      ) : !vendors.length ? (
        <div className="rounded-2xl border-2 border-dashed p-8 text-center">
          <Heart className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <h3 className="font-bold text-xl">Start your shortlist</h3>
          <p className="mt-2 text-slate-600">
            Use the heart on a vendor card or “Save to shortlist” on their
            profile.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap justify-between items-center gap-3">
            <div>
              <p className="font-semibold text-slate-900">
                {compared.length} of 3 selected
              </p>
              <p className="text-xs text-slate-500">
                Choose at least two vendors to compare.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={!selected.length}
                onClick={() => {
                  setSelected([]);
                  setComparing(false);
                }}
              >
                Clear
              </Button>
              <Button
                disabled={compared.length < 2}
                onClick={() => setComparing(true)}
              >
                <Columns3 className="h-4 w-4 mr-2" /> Compare vendors
              </Button>
            </div>
          </div>
          {comparing && compared.length >= 2 && (
            <section
              aria-label="Vendor comparison"
              className="rounded-2xl border bg-white overflow-hidden"
            >
              <div className="p-5 border-b">
                <h3 className="text-xl font-bold">Compare your vendors</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Starting prices are not final quotes. Inclusions and
                  availability can differ. On small screens, swipe the table
                  sideways.
                </p>
                <button
                  onClick={() => setComparing(false)}
                  className="text-sm underline mt-2"
                >
                  Close comparison
                </button>
              </div>
              <div
                className="overflow-x-auto"
                tabIndex={0}
                aria-label="Scrollable comparison table"
              >
                <table className="w-full text-sm border-collapse min-w-[680px]">
                  <caption className="sr-only">
                    Compare location, services, starting prices, and customer
                    reviews
                  </caption>
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="sticky left-0 z-10 text-left p-5 bg-slate-50 min-w-32 w-36"
                      >
                        Details
                      </th>
                      {compared.map((vendor) => (
                        <th
                          key={vendor.id}
                          scope="col"
                          className="text-left p-5 align-top min-w-56 border-l"
                        >
                          <Link
                            className="font-bold text-base text-slate-900 underline"
                            href={`/business/${vendor.id}`}
                          >
                            {vendor.name}
                          </Link>
                          <p className="font-normal text-slate-500 mt-1">
                            {vendor.category?.name || "Vendor"}
                          </p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 text-left p-5 bg-slate-50"
                      >
                        <MapPin className="inline h-4 w-4 mr-1" /> Location
                      </th>
                      {compared.map((v) => (
                        <td key={v.id} className="p-5 border-l align-top">
                          {[v.city, v.district].filter(Boolean).join(", ") ||
                            "Not provided"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 text-left p-5 bg-slate-50"
                      >
                        Services
                      </th>
                      {compared.map((v) => (
                        <td key={v.id} className="p-5 border-l align-top">
                          {v.services?.length ? (
                            <ul className="space-y-2 list-disc pl-4">
                              {v.services.map((name, index) => (
                                <li key={index}>{name}</li>
                              ))}
                            </ul>
                          ) : (
                            "No services listed yet"
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 text-left p-5 bg-slate-50"
                      >
                        Starting price
                      </th>
                      {compared.map((v) => (
                        <td
                          key={v.id}
                          className="p-5 border-l align-top font-semibold"
                        >
                          {price(v)}
                          {v.hasQuoteOnlyServices && (
                            <p className="mt-2 font-normal text-xs text-slate-500">
                              Some services need a personalised quote.
                            </p>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 text-left p-5 bg-slate-50"
                      >
                        <Star className="inline h-4 w-4 mr-1" /> Reviews
                      </th>
                      {compared.map((v) => (
                        <td key={v.id} className="p-5 border-l align-top">
                          {v.reviewCount > 0 ? (
                            <>
                              <span className="font-bold">
                                {v.rating.toFixed(1)} / 5
                              </span>
                              <p className="text-slate-500">
                                {v.reviewCount}{" "}
                                {v.reviewCount === 1 ? "review" : "reviews"}
                              </p>
                              <Link
                                className="block underline mt-2"
                                href={`/business/${v.id}#reviews`}
                              >
                                Read reviews
                              </Link>
                            </>
                          ) : (
                            "No reviews yet"
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <th
                        scope="row"
                        className="sticky left-0 z-10 text-left p-5 bg-slate-50"
                      >
                        Next step
                      </th>
                      {compared.map((v) => (
                        <td key={v.id} className="p-5 border-l">
                          <Link
                            href={`/business/${v.id}`}
                            className="font-semibold text-amber-800 underline"
                          >
                            View profile & enquire
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {vendors.map((vendor) => (
              <article
                key={vendor.id}
                aria-label={`Shortlisted ${vendor.name}`}
                className="min-w-0"
              >
                <label className="flex items-center gap-2 bg-white rounded-t-xl border border-b-0 p-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={selected.includes(vendor.id)}
                    disabled={
                      vendor.available === false ||
                      (!selected.includes(vendor.id) && selected.length >= 3)
                    }
                    onChange={() => select(vendor.id)}
                    className="h-4 w-4 accent-amber-600"
                  />{" "}
                  Compare {vendor.name}
                </label>
                {vendor.available === false ? (
                  <div className="border rounded-b-xl p-5 bg-white">
                    <Building2 className="text-slate-400 h-8 w-8 mb-3" />
                    <h3 className="font-bold">{vendor.name}</h3>
                    <p className="text-sm text-slate-500 my-3">
                      This vendor is no longer publicly available.
                    </p>
                    <Button
                      variant="outline"
                      disabled={pending.includes(vendor.id)}
                      onClick={async () => {
                        try {
                          await toggle(vendor.id);
                        } catch {
                          toast.error(
                            "Couldn’t remove this vendor. Please try again.",
                          );
                        }
                      }}
                    >
                      Remove from shortlist
                    </Button>
                  </div>
                ) : (
                  <VendorCard business={vendor} />
                )}
              </article>
            ))}
          </div>
        </>
      )}
      {recent.length > 0 && (
        <section className="pt-6 border-t">
          <h3 className="text-xl font-bold mb-4">Recently viewed</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {recent.map((vendor) => (
              <VendorCard key={vendor.id} business={vendor} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
