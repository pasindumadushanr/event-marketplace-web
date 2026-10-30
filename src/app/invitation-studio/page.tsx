"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { invitationTemplates } from "@/lib/invitation-templates";
import { InvitationExperience } from "@/components/invitations/InvitationExperience";
import {
  emptyInvitation,
  InvitationContent,
  InvitationRecord,
  studioRequest,
} from "@/lib/invitations";

const fields: {
  key: keyof InvitationContent;
  label: string;
  large?: boolean;
}[] = [
  { key: "partnerOne", label: "First partner’s name" },
  { key: "partnerTwo", label: "Second partner’s name" },
  { key: "welcome", label: "Welcome message", large: true },
  { key: "venue", label: "Venue name" },
  { key: "address", label: "Venue address" },
  { key: "mapUrl", label: "Google Maps link" },
  { key: "rsvpPhone", label: "Couple’s RSVP WhatsApp number" },
  { key: "story", label: "Their story (optional)", large: true },
];
const inputClass =
  "mt-2 block min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold disabled:opacity-40";
export default function InvitationStudio() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [records, setRecords] = useState<InvitationRecord[]>([]);
  const [selected, setSelected] = useState<InvitationRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [choosingTemplate, setChoosingTemplate] = useState(false);
  const [templateId, setTemplateId] = useState<string>("W01");
  const template = invitationTemplates.find((item) => item.id === templateId);
  const [draft, setDraft] = useState<InvitationContent>({ ...emptyInvitation });
  const [slug, setSlug] = useState("");
  const [dirty, setDirty] = useState(false);
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(false);
  const [reviewLink, setReviewLink] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  useEffect(() => {
    if (!sessionStorage.getItem("invitationStudioToken")) {
      router.replace("/invitation-studio/login");
      return;
    }
    const expired = () => router.replace("/invitation-studio/login");
    window.addEventListener("invitation-session-expired", expired);
    Promise.all([
      studioRequest("/invitation-studio/session"),
      studioRequest("/invitation-studio/invitations"),
      studioRequest("/invitation-studio/settings"),
    ])
      .then(([, rows, settings]) => {
        setRecords(rows);
        setOrderPhone(settings.orderPhone);
        setReady(true);
      })
      .catch((e) => setError(e.message));
    return () =>
      window.removeEventListener("invitation-session-expired", expired);
  }, [router]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function update(
    key: keyof InvitationContent,
    value: string | string[] | boolean,
  ) {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
    setApproved(false);
    setReviewLink("");
  }
  async function choose(id?: string, newTemplateId?: string) {
    if (!id && !invitationTemplates.some((item) => item.id === newTemplateId))
      return;
    if (dirty && !window.confirm("Discard unsaved invitation changes?")) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const row = id
        ? await studioRequest(`/invitation-studio/invitations/${id}`)
        : null;
      setSelected(row);
      setTemplateId(row?.templateId || newTemplateId!);
      setDraft(row?.draft || { ...emptyInvitation });
      setSlug(row?.slug || "");
      setEditing(true);
      setChoosingTemplate(false);
      setDirty(false);
      setApproved(false);
      setReviewLink("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function refresh() {
    setRecords(await studioRequest("/invitation-studio/invitations"));
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const row = await studioRequest(
        `/invitation-studio/invitations${selected ? `/${selected.id}` : ""}`,
        {
          method: selected ? "PATCH" : "POST",
          body: JSON.stringify({
            ...(selected
              ? { revision: selected.revision }
              : { slug, templateId }),
            draft,
          }),
        },
      );
      setSelected(row);
      setDraft(row.draft);
      setDirty(false);
      setReviewLink("");
      setNotice("Draft saved. The public invitation has not changed.");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function action(action: string) {
    if (!selected || dirty) return;
    if (
      ["archive", "unpublish"].includes(action) &&
      !window.confirm(
        "This will turn off the public invitation link. Continue?",
      )
    )
      return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const row = await studioRequest(
        `/invitation-studio/invitations/${selected.id}/actions`,
        {
          method: "POST",
          body: JSON.stringify({
            action,
            revision: selected.revision,
            approved,
          }),
        },
      );
      setSelected(row);
      setReviewLink(
        row.reviewToken
          ? `${location.origin}/invitation-review/${row.id}#${row.reviewToken}`
          : "",
      );
      setApproved(false);
      setNotice(
        action === "publish"
          ? "Published. The saved design is now live."
          : action === "review"
            ? "Private review link created. Expires in 7 days; saving changes revokes it."
            : "Public link switched off.",
      );
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function upload(files: FileList | null, gallery: boolean) {
    if (!files?.length) return;
    if (gallery && draft.gallery.length + files.length > 8) {
      setError("Choose up to 8 gallery images.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (
          file.size > 5 * 1024 * 1024 ||
          !["image/jpeg", "image/png", "image/webp"].includes(file.type)
        )
          throw new Error("Use JPG, PNG or WebP images up to 5 MB each.");
        const body = new FormData();
        body.append("image", file);
        urls.push(
          (
            await studioRequest("/invitation-studio/images", {
              method: "POST",
              body,
            })
          ).url,
        );
        if (gallery) update("gallery", [...draft.gallery, ...urls]);
        else update("couplePhoto", urls[0]);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (preview)
    return (
      <div>
        <div className="sticky top-0 z-50 bg-white p-3 flex items-center justify-between gap-3 text-sm">
          <span>{dirty ? "Unsaved draft preview" : "Saved draft preview"}</span>
          <button className={buttonClass} onClick={() => setPreview(false)}>
            Back to editor
          </button>
        </div>
        <InvitationExperience content={draft} preview />
      </div>
    );
  return (
    <div className="min-h-screen bg-[#f6f4ed] text-[#303c31]">
      <header className="border-b border-stone-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-800">
              Nakathata.lk
            </p>
            <h1 className="text-2xl font-serif">Invitation Studio</h1>
          </div>
          <div className="flex gap-3">
            <Link
              className={buttonClass}
              href="/invitation-templates"
              target="_blank"
            >
              Template catalogue ↗
            </Link>
            <button
              className={buttonClass}
              onClick={() => {
                sessionStorage.removeItem("invitationStudioToken");
                router.replace("/invitation-studio/login");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-7">
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            {notice}
          </p>
        )}
        {!ready ? (
          <div className="rounded-2xl bg-white p-8">
            <p>
              {error
                ? "The studio could not open. Check access and the backend deployment."
                : "Opening your studio…"}
            </p>
            <button
              className={`${buttonClass} mt-4`}
              onClick={() => location.reload()}
            >
              Reload studio
            </button>
          </div>
        ) : choosingTemplate ? (
          <section aria-labelledby="template-selection-title">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-800">
                  New invitation · Step 1
                </p>
                <h2
                  id="template-selection-title"
                  className="mt-2 text-3xl font-serif"
                >
                  Choose a template
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                  Preview a design, then select it to enter the couple’s
                  details.
                </p>
              </div>
              <button
                className={buttonClass}
                disabled={busy}
                onClick={() => setChoosingTemplate(false)}
              >
                Back to invitations
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {invitationTemplates.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
                >
                  <div className="relative h-64 bg-[#414334]">
                    <img
                      src={item.image}
                      alt={`${item.id} ${item.name} floral invitation design`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-5 text-center text-[#fff5da]">
                      <span className="text-xs uppercase tracking-widest">
                        {item.id}
                      </span>
                      <span className="mt-4 text-4xl font-serif italic">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-xl font-serif">
                        {item.id} · {item.name}
                      </h3>
                      <span className="text-sm font-semibold">
                        LKR {item.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-stone-600">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={item.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass}
                      >
                        View demo ↗
                      </Link>
                      <button
                        disabled={busy}
                        className={`${buttonClass} bg-[#344b39] text-white`}
                        onClick={() => void choose(undefined, item.id)}
                      >
                        Use {item.id}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm text-stone-500">
              W01 is currently available. New designs will appear here as they
              are added.
            </p>
          </section>
        ) : editing ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-3xl font-serif">
                  {selected
                    ? `${draft.partnerOne || "Untitled"} & ${draft.partnerTwo || "invitation"}`
                    : "Create an invitation"}
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  {template?.id || templateId} ·{" "}
                  {template?.name || "Invitation"} · LKR{" "}
                  {template?.price.toLocaleString() || "—"} ·{" "}
                  {selected?.status || "New draft"}
                </p>
              </div>
              <button
                className={buttonClass}
                onClick={() => {
                  if (!dirty || window.confirm("Discard unsaved changes?")) {
                    setEditing(false);
                    setDirty(false);
                  }
                }}
              >
                Back to invitations
              </button>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <form
                onSubmit={save}
                className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"
              >
                <h3 className="text-xl font-serif">The couple & their day</h3>
                <label className="block text-sm font-medium">
                  Invitation link name
                  <input
                    className={inputClass}
                    value={slug}
                    readOnly={!!selected}
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    minLength={3}
                    maxLength={90}
                    placeholder="amaya-sanjuka"
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setDirty(true);
                    }}
                  />
                  <span className="mt-1 block text-xs text-stone-500">
                    /wedding/{slug || "your-link"} · Permanent after first save.
                  </span>
                </label>
                {fields.map(({ key, label, large }) => (
                  <label key={key} className="block text-sm font-medium">
                    {label}
                    {large ? (
                      <textarea
                        rows={key === "story" ? 5 : 3}
                        className={inputClass}
                        maxLength={key === "story" ? 3000 : 1000}
                        value={String(draft[key])}
                        onChange={(e) => update(key, e.target.value)}
                      />
                    ) : (
                      <input
                        className={inputClass}
                        value={String(draft[key])}
                        maxLength={
                          key === "mapUrl"
                            ? 2048
                            : key === "address"
                              ? 300
                              : key === "venue"
                                ? 160
                                : 80
                        }
                        onChange={(e) => update(key, e.target.value)}
                      />
                    )}
                  </label>
                ))}
                <label className="block text-sm font-medium">
                  Wedding date & time — Sri Lanka (UTC+05:30)
                  <input
                    type="datetime-local"
                    className={inputClass}
                    value={draft.weddingAt.slice(0, 16)}
                    onChange={(e) =>
                      update(
                        "weddingAt",
                        e.target.value ? `${e.target.value}:00+05:30` : "",
                      )
                    }
                  />
                </label>
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Couple photo · recommended 1200 × 1600 px
                    <input
                      className={inputClass}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={busy}
                      onChange={(e) => void upload(e.target.files, false)}
                    />
                  </label>
                  {draft.couplePhoto && (
                    <img
                      src={draft.couplePhoto}
                      alt="Couple photo preview"
                      className="h-48 w-36 rounded-t-full object-cover"
                    />
                  )}
                  <p className="text-xs text-stone-500">
                    JPG, PNG or WebP · max 5 MB. Portrait display crops to fit;
                    check Preview. Uploaded photos use public image hosting.
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Optional gallery · up to 8 images · recommended 1200 × 1200
                    px
                    <input
                      className={inputClass}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      disabled={busy}
                      onChange={(e) => void upload(e.target.files, true)}
                    />
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {draft.gallery.map((src, i) => (
                      <div key={`${src}-${i}`}>
                        <img
                          src={src}
                          alt={`Gallery ${i + 1}`}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          className="min-h-11 text-xs underline"
                          onClick={() =>
                            update(
                              "gallery",
                              draft.gallery.filter((_, j) => i !== j),
                            )
                          }
                        >
                          Remove photo {i + 1}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <label className="flex min-h-11 items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.music}
                    onChange={(e) => update("music", e.target.checked)}
                  />
                  Offer gentle background music (guest taps to play)
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    disabled={busy}
                    className={`${buttonClass} bg-[#344b39] text-white`}
                  >
                    {busy ? "Working…" : "Save draft"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    className={buttonClass}
                    onClick={() => setPreview(true)}
                  >
                    Preview invitation
                  </button>
                </div>
              </form>
              <aside className="space-y-4 rounded-2xl border bg-white p-5 lg:sticky lg:top-5">
                <h3 className="text-xl font-serif">Review & publish</h3>
                <p className="text-sm text-stone-600">
                  Save your changes first. Publishing replaces the live design
                  with this saved draft.
                </p>
                <button
                  className={`${buttonClass} w-full`}
                  disabled={busy || dirty || !selected}
                  onClick={() => void action("review")}
                >
                  Create customer review link
                </button>
                {reviewLink && (
                  <div className="text-xs space-y-2">
                    <label>
                      Private review link
                      <input
                        readOnly
                        className={inputClass}
                        value={reviewLink}
                        onFocus={(e) => e.target.select()}
                      />
                    </label>
                    <button
                      className={buttonClass}
                      onClick={() =>
                        void navigator.clipboard
                          .writeText(reviewLink)
                          .then(() => setNotice("Review link copied."))
                          .catch(() =>
                            setNotice(
                              "Select and copy the review link manually.",
                            ),
                          )
                      }
                    >
                      Copy review link
                    </button>
                    <p>
                      Anyone with this link can view the draft for 7 days.
                      Saving changes revokes it.
                    </p>
                  </div>
                )}
                <label className="flex items-start gap-3 text-sm leading-6">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={approved}
                    onChange={(e) => setApproved(e.target.checked)}
                  />
                  The customer approved these saved details and photos.
                </label>
                <button
                  className={`${buttonClass} w-full bg-[#344b39] text-white`}
                  disabled={busy || dirty || !selected || !approved}
                  onClick={() => void action("publish")}
                >
                  Publish invitation
                </button>
                {selected?.status === "PUBLISHED" && (
                  <>
                    <Link
                      href={`/wedding/${selected.slug}`}
                      target="_blank"
                      className={`${buttonClass} w-full`}
                    >
                      Open live invitation ↗
                    </Link>
                    <button
                      className={`${buttonClass} w-full`}
                      disabled={busy || dirty}
                      onClick={() => void action("unpublish")}
                    >
                      Unpublish
                    </button>
                  </>
                )}
                <button
                  className={`${buttonClass} w-full text-red-800`}
                  disabled={busy || dirty || !selected}
                  onClick={() => void action("archive")}
                >
                  Archive invitation
                </button>
                <p className="text-xs text-stone-500">
                  Guests need no account. Published links can be forwarded; they
                  are not password-protected.
                </p>
              </aside>
            </div>
          </>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif">Beautiful beginnings</h2>
                <p className="mt-2 text-sm text-stone-600">
                  Create, review and publish your couples’ invitations.
                </p>
              </div>
              <button
                className={`${buttonClass} bg-[#344b39] text-white`}
                disabled={busy}
                onClick={() => {
                  setError("");
                  setNotice("");
                  setChoosingTemplate(true);
                }}
              >
                + Create invitation
              </button>
            </div>
            <section className="mb-7 rounded-2xl border bg-white p-5">
              <h3 className="font-semibold">WhatsApp for template orders</h3>
              <p className="mt-1 text-xs text-stone-500">
                Your team’s sales number, not the couple’s RSVP number.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <input
                  aria-label="Template ordering WhatsApp"
                  className="min-h-11 min-w-0 flex-1 rounded-xl border p-3 text-sm"
                  placeholder="0771234567 or +94771234567"
                  value={orderPhone}
                  onChange={(e) => setOrderPhone(e.target.value)}
                />
                <button
                  className={buttonClass}
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError("");
                    try {
                      const s = await studioRequest(
                        "/invitation-studio/settings",
                        {
                          method: "POST",
                          body: JSON.stringify({ orderPhone }),
                        },
                      );
                      setOrderPhone(s.orderPhone);
                      setNotice("Template ordering number saved.");
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Save ordering number
                </button>
              </div>
            </section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {records.map((row) => (
                <button
                  key={row.id}
                  disabled={busy}
                  onClick={() => void choose(row.id)}
                  className="rounded-2xl border bg-white p-6 text-left shadow-sm hover:border-amber-500"
                >
                  <span className="text-xs uppercase tracking-widest text-amber-900">
                    {row.status}
                  </span>
                  <h3 className="my-3 text-2xl font-serif">
                    {row.draft.partnerOne || "Untitled"} &{" "}
                    {row.draft.partnerTwo || "invitation"}
                  </h3>
                  <p className="break-all text-xs text-stone-500">
                    /wedding/{row.slug}
                  </p>
                  <p className="mt-5 text-sm font-semibold">
                    Open invitation →
                  </p>
                </button>
              ))}
            </div>
            {!records.length && (
              <p className="rounded-2xl border bg-white p-8 text-center text-stone-500">
                No invitations yet. Create your first one with Template W01.
              </p>
            )}
            <p className="mt-6 text-xs text-stone-500">
              Showing the latest 200 invitations. Payments are managed manually
              outside this studio.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
