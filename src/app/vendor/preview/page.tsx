"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { previewSignature } from "@/components/vendor/setup-progress";
import { Pencil, Eye, X, Save, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { mapBusinessData } from "@/lib/map-business-profile";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import { VisualProfileFields } from "@/components/vendor/VisualProfileFields";
import {
  ProfileData,
  Section,
  sectionNames,
  sectionPayload,
} from "@/components/vendor/visual-profile-model";
import { FullBusinessProfile } from "@/types/business-profile";
import { BusinessHero } from "@/components/business/BusinessHero";
import { BusinessTrust } from "@/components/business/BusinessTrust";
import { BusinessAbout } from "@/components/business/BusinessAbout";
import { BusinessFeatures } from "@/components/business/BusinessFeatures";
import { BusinessGallery } from "@/components/business/BusinessGallery";
import { BusinessPackages } from "@/components/business/BusinessPackages";
import { BusinessReviews } from "@/components/business/BusinessReviews";
import { BusinessFAQ } from "@/components/business/BusinessFAQ";
import { BusinessPolicies } from "@/components/business/BusinessPolicies";
import { BusinessAvailability } from "@/components/business/BusinessAvailability";
import { BusinessHours } from "@/components/business/BusinessHours";
import { BusinessContact } from "@/components/business/BusinessContact";
import { BusinessLocation } from "@/components/business/BusinessLocation";

function EditableSection({
  name,
  editing,
  selected,
  onEdit,
  children,
}: {
  name: Section;
  editing: boolean;
  selected: boolean;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section
      data-profile-section={name}
      className={`visual-section ${editing ? "visual-section-editable" : ""} ${selected ? "visual-section-selected" : ""}`}
    >
      {editing && (
        <div className="visual-section-bar">
          <span>{sectionNames[name]}</span>
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${sectionNames[name]}`}
          >
            <Pencil size={13} />
            Edit
          </button>
        </div>
      )}
      {children}
    </section>
  );
}

export default function VendorPreviewPage() {
  const { updateBusinessLocally } = useBusinessProfile();
  const [saved, setSaved] = useState<ProfileData | null>(null);
  const [draft, setDraft] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState<Section | null>(null);
  const [customerView, setCustomerView] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [removedPhoto, setRemovedPhoto] = useState("");
  const files = useRef<
    Record<string, { file: File; url: string; uploadedUrl?: string }>
  >({});
  const trigger = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement>(null);
  const dirty =
    !!saved && !!draft && JSON.stringify(saved) !== JSON.stringify(draft);
  const releaseFiles = useCallback(() => {
    Object.values(files.current).forEach((item) =>
      URL.revokeObjectURL(item.url),
    );
    files.current = {};
  }, []);
  const load = useCallback(() => {
    return Promise.all([
      api.get("/vendor/business"),
      api.get("/vendor/packages"),
      api.get("/vendor/gallery"),
    ])
      .then(([profile, packages, gallery]) => {
        const value: ProfileData = {
          ...profile.data,
          profileSettings: {
            ...profile.data.profileSettings,
            features: mapBusinessData(profile.data)?.featureGroups || [],
            policies: {
              ...profile.data.profileSettings?.policies,
              bookingPolicy:
                profile.data.profileSettings?.policies?.bookingPolicy ??
                profile.data.profileSettings?.policies?.booking ??
                "",
              cancellationPolicy:
                profile.data.profileSettings?.policies?.cancellationPolicy ??
                profile.data.profileSettings?.policies?.cancellation ??
                "",
              paymentPolicy:
                profile.data.profileSettings?.policies?.paymentPolicy ??
                profile.data.profileSettings?.policies?.payment ??
                "",
            },
            faqs:
              profile.data.profileSettings?.faqs ||
              profile.data.profileSettings?.faq ||
              [],
          },
          packages: packages.data,
          galleries: gallery.data,
        };
        setSaved(value);
        setDraft(value);
        setError("");
      })
      .catch(() => {
        setError("We couldn’t load your business page. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    void load();
    return releaseFiles;
  }, [load, releaseFiles]);
  useEffect(() => {
    if (!dirty && !saving) return;
    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const click = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a");
      if (
        link &&
        link.target !== "_blank" &&
        !event.ctrlKey &&
        !event.metaKey &&
        (saving ||
          !window.confirm("Discard your unsaved profile changes and leave?"))
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", click, true);
    };
  }, [dirty, saving]);

  function close() {
    if (saving || (dirty && !window.confirm("Discard your unsaved changes?")))
      return;
    setDraft(saved);
    setActive(null);
    setRemovedPhoto("");
    setError("");
    releaseFiles();
    trigger.current?.focus();
  }
  function edit(section: Section) {
    if (
      saving ||
      (dirty &&
        !window.confirm(
          "Discard your unsaved changes before editing another section?",
        ))
    )
      return;
    releaseFiles();
    setDraft(saved);
    setError("");
    setNotice("");
    setRemovedPhoto("");
    setServiceId("");
    setActive(section);
    trigger.current = document.activeElement as HTMLElement;
    requestAnimationFrame(() => {
      panel.current?.focus({ preventScroll: true });
    });
  }
  function selectService(id: string) {
    if (
      !saved ||
      (dirty && !window.confirm("Discard changes to this service?"))
    )
      return;
    releaseFiles();
    setError("");
    setServiceId(id);
    setDraft(
      id === "__new__"
        ? {
            ...saved,
            packages: [
              ...saved.packages,
              {
                id,
                name: "",
                description: "",
                price: "",
                duration: "",
                image: "",
                features: [],
                status: "ACTIVE",
              },
            ],
          }
        : saved,
    );
  }
  function onFile(file: File, field: string) {
    if (!draft) return;
    const allowed =
      field === "gallery"
        ? ["image/jpeg", "image/png", "image/webp", "video/mp4"]
        : ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError(
        "Choose a supported image (or MP4 for gallery), no larger than 5 MB.",
      );
      return;
    }
    if (files.current[field]) URL.revokeObjectURL(files.current[field].url);
    const url = URL.createObjectURL(file);
    files.current[field] = { file, url };
    setError("");
    if (field === "gallery")
      setDraft({
        ...draft,
        galleries: [
          ...draft.galleries,
          {
            id: "__new__",
            url,
            type: file.type === "video/mp4" ? "VIDEO" : "IMAGE",
          },
        ],
      });
    else if (field === "serviceImage")
      setDraft({
        ...draft,
        packages: draft.packages.map((item) =>
          item.id === serviceId ? { ...item, image: url } : item,
        ),
      });
    else setDraft({ ...draft, [field]: url });
  }
  async function upload(field: string) {
    const item = files.current[field];
    if (!item) return "";
    if (item.uploadedUrl) return item.uploadedUrl;
    const body = new FormData();
    body.append("file", item.file);
    const response = await api.post("/vendor/business/upload", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    item.uploadedUrl = response.data.url;
    return item.uploadedUrl!;
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!draft || !saved || !active || saving) return;
    setError("");
    if (active === "hero" && !draft.name?.trim()) {
      setError("Enter your business name.");
      return;
    }
    if (
      active === "location" &&
      (!draft.address?.trim() || !draft.city?.trim())
    ) {
      setError("Enter your address and city.");
      return;
    }
    if (
      active === "faq" &&
      draft.profileSettings.faqs?.some(
        (item) => !!item.question.trim() !== !!item.answer.trim(),
      )
    ) {
      setError(
        "Complete both the question and answer, or remove the unfinished question.",
      );
      return;
    }
    if (
      active === "hours" &&
      draft.profileSettings.hours?.some(
        (item) => !item.isClosed && (!item.openTime || !item.closeTime),
      )
    ) {
      setError(
        "Enter an opening and closing time for each edited day, or mark it closed.",
      );
      return;
    }
    for (const key of active === "contact"
      ? ["website", "facebook", "instagram", "youtube"]
      : active === "location"
        ? ["googleMapLocation"]
        : []) {
      if (draft[key]) {
        try {
          const url = new URL(String(draft[key]));
          if (!["https:", "http:"].includes(url.protocol)) throw Error();
        } catch {
          setError("Use full http:// or https:// web addresses.");
          return;
        }
      }
    }
    const service = draft.packages.find((item) => item.id === serviceId);
    if (
      active === "packages" &&
      (!service ||
        !service.name.trim() ||
        service.price === "" ||
        !Number.isFinite(Number(service.price)) ||
        Number(service.price) < 0)
    ) {
      setError("Enter a service name and a valid price of zero or more.");
      return;
    }
    setSaving(true);
    try {
      let next = { ...draft };
      if (active === "gallery") {
        if (removedPhoto) {
          await api.delete(`/vendor/gallery/${removedPhoto}`);
        } else if (files.current.gallery) {
          const body = new FormData();
          body.append("file", files.current.gallery.file);
          const response = await api.post("/vendor/gallery/upload", body, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          next = {
            ...next,
            galleries: next.galleries.map((item) =>
              item.id === "__new__" ? response.data : item,
            ),
          };
        }
      } else if (active === "packages" && service) {
        const { id, ...values } = service;
        const payload = {
          ...values,
          price: Number(values.price),
          features: values.features.map((item) => item.trim()).filter(Boolean),
          image: files.current.serviceImage
            ? await upload("serviceImage")
            : values.image,
        };
        const response =
          id === "__new__"
            ? await api.post("/vendor/packages", payload)
            : await api.patch(`/vendor/packages/${id}`, payload);
        next = {
          ...next,
          packages: next.packages.map((item) =>
            item.id === id
              ? { ...service, ...payload, ...response.data }
              : item,
          ),
        };
      } else {
        if (active === "hero") {
          for (const field of ["logo", "coverImage"])
            if (files.current[field])
              next = { ...next, [field]: await upload(field) };
        }
        await api.patch("/vendor/business", sectionPayload(active, next));
      }
      setSaved(next);
      setDraft(next);
      updateBusinessLocally(next);
      setActive(null);
      setRemovedPhoto("");
      releaseFiles();
      setNotice("Changes saved. Your public page uses these saved details.");
      trigger.current?.focus();
    } catch {
      setError(
        "Could not save these changes. Your edits are still here. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  async function confirmReview() {
    if (!saved || dirty || saving) return;
    setSaving(true);
    setError("");
    try {
      const setupReview = {
        signature: previewSignature(saved, saved.packages, saved.galleries),
        reviewedAt: new Date().toISOString(),
      };
      await api.patch("/vendor/business", { profileSettings: { setupReview } });
      const next = {
        ...saved,
        profileSettings: { ...saved.profileSettings, setupReview },
      };
      setSaved(next);
      setDraft(next);
      updateBusinessLocally({ profileSettings: { setupReview } });
      setNotice("Preview checked. Return to your setup checklist to publish.");
    } catch {
      setError("Could not save your review. Please try again.");
    } finally {
      setSaving(false);
    }
  }
  async function togglePublish() {
    if (!saved || dirty || saving) return;
    if (
      saved.status === "ACTIVE" &&
      !window.confirm("Hide your business page? Existing bookings will remain.")
    )
      return;
    setSaving(true);
    setError("");
    try {
      const status = saved.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await api.patch(
        `/vendor/business/${status === "ACTIVE" ? "publish" : "unpublish"}`,
      );
      const next = { ...saved, status };
      setSaved(next);
      setDraft(next);
      updateBusinessLocally({ status });
      setNotice(
        status === "ACTIVE"
          ? "Your page is now visible to customers."
          : "Your page is now hidden from customers.",
      );
    } catch {
      setError("Could not update visibility. Please try again.");
    } finally {
      setSaving(false);
    }
  }
  if (loading) return <p className="p-8">Loading your business page…</p>;
  if (!draft || !saved)
    return (
      <div role="alert" className="vendor-panel p-6">
        {error}
        <button onClick={load} className="ml-3 underline">
          Try again
        </button>
      </div>
    );
  const business = mapBusinessData({
    ...draft,
    packages: draft.packages.filter((item) => item.status === "ACTIVE"),
  }) as FullBusinessProfile & { blockedDates: string[] };
  const wrap = (name: Section, child: ReactNode) => (
    <EditableSection
      name={name}
      editing={!customerView}
      selected={active === name}
      onEdit={() => edit(name)}
    >
      {child}
    </EditableSection>
  );
  const empty = (text: string) => (
    <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
  return (
    <div
      className={`visual-editor ${active && !customerView ? "visual-editor-open" : ""}`}
    >
      <div className="visual-editor-topbar">
        <Link
          href="/vendor/business"
          className="inline-flex items-center gap-2 text-xs"
        >
          <ArrowLeft size={14} />
          All business sections
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="business-subtle-button"
            aria-pressed={customerView}
            onClick={() => setCustomerView(!customerView)}
          >
            <Eye size={14} />
            {customerView ? "Back to editing" : "View as customer"}
          </button>
          {customerView && (
            <button
              type="button"
              disabled={dirty || saving}
              onClick={confirmReview}
              className="business-subtle-button disabled:opacity-40"
            >
              {saving ? "Saving…" : "I’ve checked my page"}
            </button>
          )}
          {saved.status !== "ACTIVE" ? (
            <Link
              href="/vendor/business#business-setup"
              className="business-subtle-button"
            >
              Continue to publish
            </Link>
          ) : (
            <button
              type="button"
              disabled={dirty || saving}
              onClick={togglePublish}
              className="business-subtle-button disabled:opacity-40"
            >
              {saved.status === "ACTIVE"
                ? "Hide My Page"
                : "Make My Page Visible"}
            </button>
          )}
        </div>
      </div>
      <div className="mb-5 mt-4">
        <h1 className="text-xl font-semibold text-[#183e38]">
          {customerView ? "Customer view" : "Edit My Business Page"}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {customerView
            ? "Editing controls are hidden. Customer booking actions are disabled in this preview."
            : "Choose Edit beside a section. See your changes here, then save when you’re happy."}
        </p>
        <p className="mt-2 text-xs font-medium text-[#986c22]">
          {dirty
            ? "Unsaved preview — customers still see your saved page."
            : saved.status === "ACTIVE"
              ? "Your page is live. Saved edits appear publicly."
              : "Your page is hidden. Saving edits does not publish it."}
        </p>
        {notice && (
          <p role="status" className="mt-2 text-sm text-emerald-700">
            {notice}
          </p>
        )}
        {customerView && (
          <Link
            href="/vendor/business#business-setup"
            className="mt-3 inline-block text-sm font-semibold text-[#36564c] underline"
          >
            Back to setup checklist
          </Link>
        )}
        {error && !active && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
      <div className="visual-canvas">
        {wrap("hero", <BusinessHero business={business} />)}
        <div className="visual-profile-columns grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-5">
            <BusinessTrust verification={business.verification} />
            {wrap("about", <BusinessAbout business={business} />)}
            {wrap(
              "features",
              business.featureGroups.length ? (
                <BusinessFeatures featureGroups={business.featureGroups} />
              ) : !customerView ? (
                empty(
                  "Add amenities, equipment or the special features you offer.",
                )
              ) : null,
            )}
            {wrap(
              "gallery",
              business.gallery.length ? (
                <BusinessGallery gallery={business.gallery} />
              ) : !customerView ? (
                empty("Add photos or videos to show your best work.")
              ) : null,
            )}
            {wrap(
              "packages",
              <BusinessPackages
                packages={business.packages}
                businessName={business.name}
                blockedDates={business.blockedDates}
                previewOnly
              />,
            )}
            <BusinessReviews
              reviews={business.reviews}
              rating={business.rating}
              reviewCount={business.reviewCount}
            />
            {wrap(
              "faq",
              business.faq.length ? (
                <BusinessFAQ faq={business.faq} />
              ) : !customerView ? (
                empty("Answer common questions before customers ask.")
              ) : null,
            )}
            {wrap(
              "policies",
              <BusinessPolicies policies={business.policies} />,
            )}
          </div>
          <div className="min-w-0 space-y-5">
            <p className="rounded-xl bg-slate-100 p-4 text-xs text-slate-500">
              Customer booking actions are disabled in this preview.
            </p>
            <BusinessAvailability blockedDates={business.blockedDates} />
            {wrap("hours", <BusinessHours hours={business.businessHours} />)}
            {wrap("contact", <BusinessContact contact={business.contact} />)}
            {wrap(
              "location",
              <BusinessLocation location={business.location} />,
            )}
          </div>
        </div>
      </div>
      {active && !customerView && (
        <aside
          ref={panel}
          tabIndex={-1}
          aria-label={`Editing ${sectionNames[active]}`}
          className="visual-edit-panel"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-start justify-between gap-3 border-b p-5">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">
                  Edit this section
                </p>
                <h2 className="text-base font-semibold text-[#183e38]">
                  {sectionNames[active]}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close editor"
                onClick={close}
                disabled={saving}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </header>
            <fieldset
              disabled={saving}
              className="visual-fields min-h-0 flex-1 space-y-5 overflow-y-auto p-5"
            >
              <legend className="sr-only">{sectionNames[active]}</legend>
              <VisualProfileFields
                section={active}
                data={draft}
                setData={setDraft}
                serviceId={serviceId}
                selectService={selectService}
                onFile={onFile}
                galleryPending={
                  !!removedPhoto ||
                  draft.galleries.some((item) => item.id === "__new__")
                }
                removePhoto={(id) => {
                  setRemovedPhoto(id);
                  setDraft({
                    ...draft,
                    galleries: draft.galleries.filter((item) => item.id !== id),
                  });
                }}
              />
              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}
            </fieldset>
            <footer className="border-t bg-[#f6f8f2] p-4">
              <p role="status" className="mb-3 text-xs text-slate-600">
                {saving
                  ? "Saving…"
                  : dirty
                    ? "Unsaved changes — preview only"
                    : "No unsaved changes"}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={close}
                  className="business-subtle-button flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!dirty || saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#183e38] px-3 py-3 text-xs font-semibold text-white disabled:opacity-40"
                >
                  <Save size={14} />
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </footer>
          </form>
        </aside>
      )}
    </div>
  );
}
