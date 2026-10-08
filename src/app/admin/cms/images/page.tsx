"use client";

import { useEffect, useState } from "react";
import { ImageIcon, RotateCcw, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteMedia, type SiteMedia } from "@/lib/site-media";
import { imageGuidelines } from "@/lib/image-guidelines";

const slots = [
  {
    key: "heroImage",
    title: "Homepage hero",
    hint: "The main background photograph behind the homepage heading and search bar.",
  },
  {
    key: "logoImage",
    title: "Website logo",
    hint: "Use a tightly cropped PNG with a transparent background. Shown wherever the website logo appears; not the Google favicon.",
  },
  {
    key: "packageFallbackImage",
    title: "Default package picture",
    hint: "Only used when a package and its vendor have no photograph.",
  },
  ...["Colombo", "Kandy", "Galle", "Negombo"].map((name) => ({
    key: `location${name}`,
    title: `${name} location picture`,
    hint: "Shown in Browse by Location on the homepage.",
  })),
] as const;

function validUrl(url: string) {
  if (!url || /^\/images\/[a-zA-Z0-9/_\.\-]+$/.test(url)) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

function ImagePreview({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  if (failed)
    return (
      <p role="status" className="px-4 text-center text-sm text-amber-700">
        Preview could not load. Check the image URL before saving.
      </p>
    );
  return (
    <div className="relative h-full w-full">
      <img
        src={url}
        alt={`${title} preview`}
        className="w-full h-full object-contain"
        onLoad={(event) =>
          setDimensions({
            width: event.currentTarget.naturalWidth,
            height: event.currentTarget.naturalHeight,
          })
        }
        onError={() => setFailed(true)}
      />
      {dimensions && (
        <span className="absolute bottom-2 right-2 rounded-md bg-white/95 border border-slate-200 px-2 py-1 text-[11px] text-slate-700 shadow-sm">
          Actual: {dimensions.width} × {dimensions.height} px
        </span>
      )}
    </div>
  );
}

export default function WebsiteImagesPage() {
  const { updateMedia } = useSiteMedia();
  const [draft, setDraft] = useState<SiteMedia>({});
  const [categories, setCategories] = useState<
    { slug: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/cms/settings/SITE_MEDIA");
      setDraft(data || {});
      setDirty(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    api
      .get("/admin/cms/settings/SITE_MEDIA")
      .then(({ data }) => {
        setDraft(data || {});
        setDirty(false);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
    api
      .get("/business-categories")
      .then(({ data }) =>
        setCategories(
          data.filter(
            (category: { parentId?: string; status?: string }) =>
              !category.parentId &&
              (!category.status || category.status === "ACTIVE"),
          ),
        ),
      )
      .catch(() =>
        toast.error(
          "Category image controls could not load. Refresh to try again.",
        ),
      );
  }, []);

  const setImage = (key: string, value: string, category = false) => {
    setDraft((old) =>
      category
        ? { ...old, categoryImages: { ...old.categoryImages, [key]: value } }
        : { ...old, [key]: value },
    );
    setDirty(true);
  };
  const upload = async (
    key: string,
    file: File | undefined,
    category: boolean,
  ) => {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      toast.error("Choose a PNG, JPEG or WebP image up to 5 MB.");
      return;
    }
    setUploading(key);
    try {
      const body = new FormData();
      body.append("image", file);
      const { data } = await api.post("/admin/cms/images/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(key, data.url, category);
      toast.success("Image uploaded. Click Save Images to publish it.");
    } catch {
      toast.error(
        "Image upload failed. Your current website image has not changed.",
      );
    } finally {
      setUploading(null);
    }
  };
  const save = async () => {
    const values = [
      ...Object.entries(draft)
        .filter(([key]) => key !== "categoryImages")
        .map(([, value]) => value),
      ...Object.values(draft.categoryImages || {}),
    ];
    if (
      values.some(
        (value) => typeof value !== "string" || !validUrl(value.trim()),
      )
    ) {
      toast.error("Image URLs must use HTTPS.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post("/admin/cms/settings/SITE_MEDIA", {
        value: draft,
      });
      setDraft(data);
      updateMedia(data);
      setDirty(false);
      toast.success(
        "Website images published. Visitors see them after refreshing.",
      );
    } catch {
      toast.error(
        "Could not save images. Your changes are still here; please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="p-8 text-slate-500">Loading website images…</p>;
  if (loadError)
    return (
      <div className="p-8 space-y-3">
        <p>Website image settings could not load. Nothing has been changed.</p>
        <Button
          onClick={() => {
            setLoading(true);
            setLoadError(false);
            void load();
          }}
        >
          Retry
        </Button>
      </div>
    );

  const imageCard = (
    key: string,
    title: string,
    hint: string,
    category = false,
  ) => {
    const value = category
      ? draft.categoryImages?.[key] || ""
      : String(draft[key as keyof SiteMedia] || "");
    const guideline = imageGuidelines(key, category);
    return (
      <section
        key={key}
        className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
        aria-label={title}
      >
        <div className="h-40 flex items-center justify-center bg-slate-50 border-b">
          {value && validUrl(value) ? (
            <ImagePreview key={value} url={value} title={title} />
          ) : (
            <div className="text-center text-slate-400 text-sm">
              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
              Original website image
            </div>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <div className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2 space-y-1">
            <p className="text-xs font-semibold text-teal-900">
              Recommended: {guideline.size}{" "}
              <span className="font-normal">({guideline.ratio})</span>
            </p>
            <p className="text-xs leading-5 text-teal-800">{guideline.tip}</p>
          </div>
          <p className="text-xs text-slate-500 min-h-10">{hint}</p>
          <label
            className="block text-xs font-medium text-slate-600"
            htmlFor={`image-url-${key}`}
          >
            Image URL (or upload below)
          </label>
          <Input
            id={`image-url-${key}`}
            value={value}
            placeholder="https://…"
            disabled={saving || !!uploading}
            onChange={(event) => setImage(key, event.target.value, category)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <label
              className={`relative inline-flex items-center gap-2 text-sm font-medium text-teal-700 border border-teal-200 rounded-lg px-3 py-2 ${saving || uploading ? "opacity-50" : "cursor-pointer hover:bg-teal-50"}`}
            >
              <Upload className="h-4 w-4" />
              {uploading === key ? "Uploading…" : "Upload image"}
              <input
                aria-label={`Upload ${title}`}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={saving || !!uploading}
                className="absolute inset-0 opacity-0 w-full cursor-pointer"
                onChange={(event) => {
                  void upload(key, event.target.files?.[0], category);
                  event.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              disabled={!value || saving || !!uploading}
              onClick={() => setImage(key, "", category)}
              className="text-xs text-slate-600 inline-flex items-center gap-1 disabled:opacity-40"
            >
              <RotateCcw className="h-3 w-3" />
              Reset to default
            </button>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website Images</h1>
          <p className="text-sm text-slate-500">
            Manage your branding and homepage photography.
          </p>
        </div>
        <Button onClick={save} disabled={!dirty || saving || !!uploading}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving…" : "Save Images"}
        </Button>
      </div>
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-900">
        Uploads and resets are drafts until you click Save Images. PNG, JPEG and
        WebP only, up to 5 MB. No deployment is needed after saving. Google’s
        search icon and social-sharing artwork are separate from the website
        logo.
      </div>
      <p className="text-sm text-slate-600">
        Pixel sizes are recommendations, not upload requirements. Previews show
        the full image, and your original file is not cropped during upload.
        Hero and card images fill responsive frames on the website, so some
        edges may still be cropped. The website logo is shown in full.
      </p>
      {dirty && (
        <p role="status" className="text-sm font-medium text-amber-700">
          You have unpublished image changes.
        </p>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {slots.map((slot) => imageCard(slot.key, slot.title, slot.hint))}
      </div>
      {categories.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-slate-900">
            Homepage category pictures
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {categories.map((category) =>
              imageCard(
                category.slug,
                category.name,
                "Shown in Explore Categories. Reset restores the category’s original picture.",
                true,
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}
