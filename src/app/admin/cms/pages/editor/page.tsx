"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Globe, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { isAxiosError } from "axios";
import { policyDefaults, pagePublicPath, isPolicySlug } from "@/data/policies";
import { PolicyBody } from "@/components/policies/PolicyBody";
import { validFaqs } from "@/lib/public-faqs";

export default function PageEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");

  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(!!slugParam);
  const [loadError, setLoadError] = useState(false);
  const [preview, setPreview] = useState(false);
  const [savedStatus, setSavedStatus] = useState("DRAFT");
  const isPolicy = isPolicySlug(slugParam || slug);

  const fetchPage = useCallback(async (pageSlug: string) => {
    setInitialLoad(true);
    setLoadError(false);
    try {
      const res = await api.get(`/admin/cms/pages/${pageSlug}`);
      const data = res.data;
      setId(data.id);
      setTitle(data.title);
      setSlug(data.slug);
      setContent(data.content || "");
      setMetaTitle(data.metaTitle || "");
      setMetaDescription(data.metaDescription || "");
      setSavedStatus(data.status);
    } catch (error) {
      const defaults = isPolicySlug(pageSlug)
        ? policyDefaults[pageSlug]
        : undefined;
      if (isAxiosError(error) && error.response?.status === 404 && defaults) {
        setId(null);
        setTitle(defaults.title);
        setSlug(defaults.slug);
        setContent(defaults.content);
        setSavedStatus("DRAFT");
      } else {
        setLoadError(true);
        toast.error("Could not load this page. Retry before editing.");
      }
    } finally {
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (slugParam) void Promise.resolve().then(() => fetchPage(slugParam));
  }, [slugParam, fetchPage]);

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title || !slug) {
      toast.error("Title and slug are required");
      return;
    }
    if (loadError) return;
    if (
      status === "PUBLISHED" &&
      !confirm(
        "Publish this version? It will replace the page visitors currently see. Please review the wording first.",
      )
    )
      return;

    setLoading(true);
    try {
      // This route ships with the snapshot-aware backend. Never send draft
      // writes to the old live-record editor during a staggered deployment.
      try {
        const ready = await api.get("/admin/cms/public/faqs");
        if (!validFaqs(ready.data))
          throw new Error("Content service not ready");
      } catch {
        toast.error(
          "The content service is unavailable or not updated yet. Check the latest Render deployment before saving. Your draft is still here.",
        );
        return;
      }
      const payload = {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        status,
      };

      const res = id
        ? await api.patch(`/admin/cms/pages/${id}`, payload)
        : await api.post("/admin/cms/pages", payload);
      setId(res.data.id);
      setSavedStatus(res.data.status);

      toast.success(
        status === "DRAFT"
          ? "Draft saved. The live page has not changed."
          : "Page published. Visitors will see this version.",
      );
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.message || "Failed to save page"
          : "Failed to save page",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!id && !isPolicy) {
      // Auto-generate slug for new pages
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      );
    }
  };

  if (initialLoad) {
    return (
      <div className="p-8 text-center text-zinc-500">Loading editor...</div>
    );
  }
  if (loadError)
    return (
      <div role="alert" className="p-8 space-y-4">
        <p>Could not load the page. No changes have been made.</p>
        <Button onClick={() => slugParam && fetchPage(slugParam)}>Retry</Button>
      </div>
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            aria-label="Back to pages"
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/cms/pages")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {id ? "Edit Page" : "Create Page"}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setPreview(!preview)}
            disabled={loading}
          >
            <Eye className="mr-2 h-4 w-4" />
            {preview ? "Close Preview" : "Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave("DRAFT")}
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button
            onClick={() => handleSave("PUBLISHED")}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Globe className="mr-2 h-4 w-4" /> Publish Now
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-amber-50 p-4 text-sm text-zinc-700">
        <p>
          Editor status: <strong>{savedStatus}</strong>. Save Draft keeps the
          last published version live. Preview is private; only Publish Now
          replaces the public page.
        </p>
        {isPolicy && (
          <p className="mt-2">
            Review policy wording before publishing. This editor does not
            provide legal approval. Public URL:{" "}
            <a
              href={pagePublicPath(slugParam || slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {pagePublicPath(slugParam || slug)}
            </a>
          </p>
        )}
      </div>
      {preview && (
        <section
          aria-label="Private page preview"
          className="space-y-4 rounded-2xl border bg-slate-50 p-4 sm:p-6"
        >
          <p className="text-sm font-medium text-amber-800">
            Private preview — not published
          </p>
          <h2 className="text-3xl font-bold">{title}</h2>
          <PolicyBody content={content} />
        </section>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <div>
              <label
                htmlFor="page-title"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Page Title
              </label>
              <Input
                id="page-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. About Us"
                className="text-lg font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Page Content
              </label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="font-semibold border-b pb-2">Page Settings</h3>

            <div>
              <label
                htmlFor="page-slug"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="bg-zinc-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-zinc-500">
                  /
                </span>
                <Input
                  id="page-slug"
                  disabled={isPolicy}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="rounded-l-none"
                  placeholder="about-us"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h3 className="font-semibold border-b pb-2">SEO Metadata</h3>

            <div>
              <label
                htmlFor="meta-title"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Meta Title
              </label>
              <Input
                id="meta-title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Title for search engines"
              />
            </div>

            <div>
              <label
                htmlFor="meta-description"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Meta Description
              </label>
              <textarea
                id="meta-description"
                className="w-full min-h-[100px] rounded-md border border-zinc-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief description for search results..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
