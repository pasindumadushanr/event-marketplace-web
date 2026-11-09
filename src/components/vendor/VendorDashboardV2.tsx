/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Images,
  Package,
  Phone,
  MessageCircle,
  CalendarDays,
  Eye,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Camera,
  Check,
  Clock,
  X,
  Loader2,
  Star,
  Globe,
  Save,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";
import { serviceCardCopy, servicePriceLabel } from "@/lib/service-card-copy";
import { whatsappUrl, whatsappEnquiryUrl } from "@/lib/whatsapp";
import {
  publicContactUrl,
  vendorWhatsappValue,
  type SocialField,
} from "@/lib/vendor-contact";
import { CategorySelector } from "@/components/categories/CategorySelector";

interface BusinessProfile {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  logo?: string;
  coverImage?: string;
  categoryId?: string;
  categoryIds?: string[];
  website?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  rating?: number;
  reviewCount?: number;
  category?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  profileSettings?: {
    whatsapp?: string;
    tiktok?: string;
    languages?: string;
    highlights?: string;
    categoryIds?: string[];
    contact?: {
      whatsapp?: string;
    };
    seo?: {
      slug?: string;
    };
  };
}

interface PackageItem {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  duration?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  features?: string[];
}

interface GalleryItem {
  id: string;
  url: string;
  type?: string;
  isCover?: boolean;
  sortOrder?: number;
}

interface BookingItem {
  id: string;
  status: string;
  date?: string;
  eventDate?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  package?: {
    name?: string;
  };
}

interface ConversationItem {
  id: string;
  customerId: string;
  customer?: {
    firstName?: string;
    lastName?: string;
  };
  messages?: {
    senderId: string;
    content?: string;
    isRead?: boolean;
  }[];
}

interface VendorDashboardV2Props {
  business: BusinessProfile;
  updateBusinessLocally: (data: Partial<BusinessProfile>) => void;
}

const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Moneragala",
  "Ratnapura",
  "Kegalle",
];

type ActiveTab = "packages" | "photos" | "profile" | "inquiries";

export function VendorDashboardV2({
  business,
  updateBusinessLocally,
}: VendorDashboardV2Props) {
  const copy = serviceCardCopy(business);

  const [activeTab, setActiveTab] = useState<ActiveTab>("packages");
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

  // Header Cover & Logo Upload Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingBrandImage, setIsUploadingBrandImage] = useState<
    "coverImage" | "logo" | null
  >(null);

  // Package Builder State
  const [isPackageFormOpen, setIsPackageFormOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [pkgName, setPkgName] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgDuration, setPkgDuration] = useState("");
  const [pkgDescription, setPkgDescription] = useState("");
  const [pkgImage, setPkgImage] = useState("");
  const [pkgStatus, setPkgStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [pkgFeatures, setPkgFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [isSavingPackage, setIsSavingPackage] = useState(false);
  const [isUploadingPkgImage, setIsUploadingPkgImage] = useState(false);
  const pkgFileInputRef = useRef<HTMLInputElement>(null);

  // Gallery Upload State
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Profile & Contact Form State
  const [profileForm, setProfileForm] = useState({
    name: business?.name || "",
    categoryId: business?.categoryId || business?.category?.id || "",
    description: business?.description || "",
    highlights: business?.profileSettings?.highlights || "",
    languages: business?.profileSettings?.languages || "English, Sinhala",
    whatsapp: vendorWhatsappValue(business?.profileSettings),
    phone: business?.phone || "",
    email: business?.email || "",
    address: business?.address || "",
    city: business?.city || "",
    district: business?.district || "",
    website: business?.website || "",
    facebook: business?.facebook || "",
    instagram: business?.instagram || "",
    tiktok: business?.profileSettings?.tiktok || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get("/vendor/packages"),
      api.get("/vendor/gallery"),
      api.get("/bookings/vendor"),
      api.get("/chat/conversations?mode=vendor"),
    ]).then(([pkgRes, galRes, bookRes, chatRes]) => {
      if (!active) return;
      if (pkgRes.status === "fulfilled") {
        const list = pkgRes.value.data || [];
        setPackages(list);
        if (list.length === 0) {
          setIsPackageFormOpen(true);
        }
      }
      if (galRes.status === "fulfilled") setGalleries(galRes.value.data || []);
      if (bookRes.status === "fulfilled") setBookings(bookRes.value.data || []);
      if (chatRes.status === "fulfilled")
        setConversations(chatRes.value.data || []);
      setIsLoadingData(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const isLive = business?.status === "ACTIVE";
  const publicSlug = business?.profileSettings?.seo?.slug || business?.id;
  const publicUrl = `/business/${publicSlug}`;

  const pendingBookingsCount = bookings.filter(
    (b) => b.status === "PENDING",
  ).length;
  const unreadMessagesCount = conversations.filter(
    (c) =>
      c.messages?.[0]?.senderId === c.customerId && !c.messages?.[0]?.isRead,
  ).length;
  const totalInquiriesBadge = pendingBookingsCount + unreadMessagesCount;

  const lowestPackagePrice = (() => {
    const validPrices = packages
      .filter((p) => p.status !== "INACTIVE")
      .map((p) => Number(p.price) || 0)
      .filter((p) => p > 0);
    return validPrices.length > 0 ? Math.min(...validPrices) : 0;
  })();

  // --- BRAND IMAGE (COVER / LOGO) UPLOAD ---
  const handleBrandImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "coverImage" | "logo",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image smaller than 5MB");
      return;
    }

    setIsUploadingBrandImage(field);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await api.post("/vendor/business/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = uploadRes.data?.url;
      if (!url) throw new Error("Upload URL missing");

      await api.patch("/vendor/business", { [field]: url });
      updateBusinessLocally({ [field]: url });
      toast.success(
        field === "coverImage"
          ? "Cover photo updated on your website profile!"
          : "Business logo updated on your website profile!",
      );
    } catch {
      toast.error("Could not upload image. Please try again.");
    } finally {
      setIsUploadingBrandImage(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // --- PUBLISH / UNPUBLISH TOGGLE ---
  const handleTogglePublish = async () => {
    setIsTogglingPublish(true);
    try {
      if (isLive) {
        if (
          !window.confirm(
            "Pause your business page? It will temporarily be hidden from public search, but existing bookings will remain.",
          )
        ) {
          setIsTogglingPublish(false);
          return;
        }
        await api.patch("/vendor/business/unpublish");
        updateBusinessLocally({ status: "INACTIVE" });
        toast.success("Your page is now paused and hidden from search.");
      } else {
        await api.patch("/vendor/business/publish");
        updateBusinessLocally({ status: "ACTIVE" });
        toast.success("Congratulations! Your business page is now Live!");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(
        msg ||
          "Could not update status. Please make sure your basic details are filled.",
      );
    } finally {
      setIsTogglingPublish(false);
    }
  };

  // --- PACKAGE BUILDER HANDLERS ---
  const openNewPackageForm = () => {
    setEditingPackageId(null);
    setPkgName("");
    setPkgPrice("");
    setPkgDuration("");
    setPkgDescription("");
    setPkgImage("");
    setPkgStatus("ACTIVE");
    setPkgFeatures([]);
    setNewFeatureInput("");
    setIsPackageFormOpen(true);
  };

  const openEditPackageForm = (pkg: PackageItem) => {
    setEditingPackageId(pkg.id);
    setPkgName(pkg.name || "");
    setPkgPrice(Number(pkg.price) > 0 ? String(Number(pkg.price)) : "");
    setPkgDuration(pkg.duration || "");
    setPkgDescription(pkg.description || "");
    setPkgImage(pkg.image || "");
    setPkgStatus(pkg.status === "INACTIVE" ? "INACTIVE" : "ACTIVE");
    setPkgFeatures(Array.isArray(pkg.features) ? pkg.features : []);
    setNewFeatureInput("");
    setIsPackageFormOpen(true);
  };

  const handlePkgPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      toast.error("Choose a JPG, PNG, or WebP photo under 5MB");
      return;
    }

    setIsUploadingPkgImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      let uploadedUrl = "";
      try {
        const res = await api.post("/vendor/packages/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedUrl = res.data?.url;
      } catch {
        const fallbackRes = await api.post(
          "/vendor/business/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        uploadedUrl = fallbackRes.data?.url;
      }
      if (uploadedUrl) {
        setPkgImage(uploadedUrl);
        toast.success("Package photo uploaded!");
      }
    } catch {
      toast.error("Failed to upload package photo");
    } finally {
      setIsUploadingPkgImage(false);
      if (pkgFileInputRef.current) pkgFileInputRef.current.value = "";
    }
  };

  const addFeatureTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!pkgFeatures.includes(trimmed)) {
      setPkgFeatures((prev) => [...prev, trimmed]);
    }
    setNewFeatureInput("");
  };

  const removeFeatureTag = (index: number) => {
    setPkgFeatures((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim() || pkgName.trim().length < 2) {
      toast.error("Please enter a package title (at least 2 characters)");
      return;
    }

    // Include any pending text in the feature input box
    const finalFeatures = [...pkgFeatures];
    if (newFeatureInput.trim() && !finalFeatures.includes(newFeatureInput.trim())) {
      finalFeatures.push(newFeatureInput.trim());
    }

    setIsSavingPackage(true);
    try {
      const payload = {
        name: pkgName.trim(),
        price: Number(pkgPrice) > 0 ? Number(pkgPrice) : 0,
        duration: pkgDuration.trim(),
        description: pkgDescription.trim(),
        image: pkgImage.trim(),
        status: pkgStatus,
        features: finalFeatures,
      };

      if (editingPackageId) {
        await api.patch(`/vendor/packages/${editingPackageId}`, payload);
        toast.success("Package updated on your website profile!");
      } else {
        await api.post("/vendor/packages", payload);
        toast.success("New package added to your website profile!");
      }

      const refreshed = await api.get("/vendor/packages");
      setPackages(refreshed.data || []);
      setIsPackageFormOpen(false);
      setEditingPackageId(null);
      setNewFeatureInput("");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(msg || "Could not save package");
    } finally {
      setIsSavingPackage(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm("Remove this package from your website profile?"))
      return;
    try {
      await api.delete(`/vendor/packages/${id}`);
      setPackages((prev) => prev.filter((item) => item.id !== id));
      toast.success("Package removed");
    } catch {
      toast.error("Could not delete package");
    }
  };

  const handleTogglePackageStatus = async (pkg: PackageItem) => {
    const nextStatus = pkg.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await api.patch(`/vendor/packages/${pkg.id}`, { status: nextStatus });
      setPackages((prev) =>
        prev.map((item) =>
          item.id === pkg.id ? { ...item, status: nextStatus } : item,
        ),
      );
      toast.success(
        nextStatus === "ACTIVE"
          ? "Package is now visible on your website"
          : "Package hidden from your website",
      );
    } catch {
      toast.error("Could not update package visibility");
    }
  };

  // --- GALLERY UPLOAD & ACTIONS ---
  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setIsUploadingGallery(true);
    let uploadedCount = 0;

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 5MB`);
          continue;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
          await api.post("/vendor/gallery/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          uploadedCount++;
        } catch {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
      if (uploadedCount > 0) {
        const res = await api.get("/vendor/gallery");
        setGalleries(res.data || []);
        toast.success(
          `${uploadedCount} photo${uploadedCount > 1 ? "s" : ""} added to your portfolio!`,
        );
      }
    } finally {
      setIsUploadingGallery(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
    }
  };

  const handleSetGalleryCover = async (id: string, url: string) => {
    try {
      await api.patch(`/vendor/gallery/${id}/cover`);
      updateBusinessLocally({ coverImage: url });
      const res = await api.get("/vendor/gallery");
      setGalleries(res.data || []);
      toast.success("Cover image updated!");
    } catch {
      toast.error("Failed to set cover image");
    }
  };

  const handleDeleteGalleryPhoto = async (id: string) => {
    if (!window.confirm("Delete this photo from your portfolio?")) return;
    try {
      await api.delete(`/vendor/gallery/${id}`);
      setGalleries((prev) => prev.filter((item) => item.id !== id));
      toast.success("Photo deleted");
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  // --- SAVE PROFILE, CONTACT & WHATSAPP ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error("Business Name is required");
      return;
    }

    const whatsappLink = whatsappUrl(profileForm.whatsapp);
    if (profileForm.whatsapp.trim() && !whatsappLink) {
      toast.error("Enter a valid WhatsApp number (e.g. 0771234567)");
      return;
    }
    const normalizedWhatsapp = whatsappLink
      ? new URL(whatsappLink).pathname.slice(1)
      : "";

    const socialFields: { field: SocialField; label: string }[] = [
      { field: "website", label: "Website" },
      { field: "facebook", label: "Facebook" },
      { field: "instagram", label: "Instagram" },
      { field: "tiktok", label: "TikTok" },
    ];
    const normalizedSocial: Record<string, string> = {};
    for (const { field, label } of socialFields) {
      const val = profileForm[field as keyof typeof profileForm] || "";
      const validHref = publicContactUrl(val, field);
      if (val.trim() && !validHref) {
        toast.error(`Enter a valid ${label} web address (https://...)`);
        return;
      }
      normalizedSocial[field] = validHref || "";
    }

    setIsSavingProfile(true);
    try {
      const payload: Record<string, unknown> = {
        name: profileForm.name.trim(),
        description: profileForm.description.trim(),
        phone: profileForm.phone.trim(),
        email: profileForm.email.trim(),
        address: profileForm.address.trim(),
        city: profileForm.city.trim(),
        district: profileForm.district.trim(),
        website: normalizedSocial.website,
        facebook: normalizedSocial.facebook,
        instagram: normalizedSocial.instagram,
        ...(profileForm.categoryId
          ? { categoryId: profileForm.categoryId }
          : {}),
        profileSettings: {
          ...business?.profileSettings,
          whatsapp: normalizedWhatsapp,
          tiktok: normalizedSocial.tiktok,
          highlights: profileForm.highlights.trim(),
          languages: profileForm.languages.trim(),
          categoryIds: [
            ...new Set(
              [
                profileForm.categoryId,
                ...(business?.categoryIds ||
                  business?.profileSettings?.categoryIds ||
                  []),
              ].filter(Boolean),
            ),
          ],
        },
      };

      await api.patch("/vendor/business", payload);
      updateBusinessLocally(payload as Partial<BusinessProfile>);
      toast.success("Website profile & contact details saved!");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(msg || "Could not save profile changes");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const whatsappTestLink = whatsappEnquiryUrl(profileForm.whatsapp);

  return (
    <div className="space-y-6" data-testid="vendor-dashboard-v2">
      {/* =====================================================================
          1. PRO WEBSITE PROFILE HERO (MIRRORS PUBLIC WEBSITE /business/[slug])
      ===================================================================== */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Cover Image Banner */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-br from-[#13322b] via-[#1c473d] to-[#0f241f]">
          {business?.coverImage && (
            <img
              src={business.coverImage}
              alt={`${business?.name || "Business"} Cover`}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/20" />

          {/* Top Bar Over Cover: Category Badge + Status + Actions */}
          <div className="absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-2 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 backdrop-blur-sm">
                {business?.category?.name || "Vendor Profile"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md border ${
                  isLive
                    ? "bg-emerald-950/75 border-emerald-400/40 text-emerald-300"
                    : "bg-amber-950/75 border-amber-400/40 text-amber-300"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                {isLive ? "Live on Website" : "Hidden (Draft)"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isUploadingBrandImage === "coverImage"}
                onClick={() => coverInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-black/55 hover:bg-black/75 border border-white/20 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition cursor-pointer"
              >
                {isUploadingBrandImage === "coverImage" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Camera className="size-3.5" />
                )}
                <span>Change Cover</span>
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleBrandImageUpload(e, "coverImage")}
                className="hidden"
              />

              <Button
                size="sm"
                onClick={handleTogglePublish}
                disabled={isTogglingPublish}
                className={`h-9 rounded-xl text-xs font-bold cursor-pointer ${
                  isLive
                    ? "bg-white/15 hover:bg-red-950/70 text-white border border-white/25"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                }`}
              >
                {isTogglingPublish
                  ? "Updating..."
                  : isLive
                    ? "Pause Page"
                    : "🚀 Publish Live"}
              </Button>

              <Link
                href={isLive ? publicUrl : "/vendor/preview"}
                target={isLive ? "_blank" : undefined}
                rel={isLive ? "noopener noreferrer" : undefined}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-9 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>{isLive ? "View Website Page" : "Preview Page"}</span>
                  {isLive && <ExternalLink className="size-3 opacity-60" />}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Identity Row (Overlapping Logo + Business Name + Starting Price) */}
        <div className="relative px-5 pb-6 pt-4 sm:px-8">
          {/* Overlapping Logo with 1-Click Upload */}
          <div className="relative -mt-14 sm:-mt-16 mb-3 inline-block">
            <div className="relative size-24 sm:size-28 rounded-2xl border-4 border-white bg-slate-100 shadow-md overflow-hidden flex items-center justify-center">
              {business?.logo ? (
                <img
                  src={business.logo}
                  alt={business?.name || "Logo"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="size-10 text-slate-400" />
              )}
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={isUploadingBrandImage === "logo"}
                title="Change Business Logo"
                className="absolute inset-x-0 bottom-0 bg-black/65 py-1 text-[10px] font-bold text-white flex items-center justify-center gap-1 hover:bg-black/80 transition cursor-pointer"
              >
                {isUploadingBrandImage === "logo" ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Camera className="size-3" />
                )}
                <span>Logo</span>
              </button>
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleBrandImageUpload(e, "logo")}
              className="hidden"
            />
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {business?.name || "Your Business Name"}
                </h1>
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                >
                  <Edit2 className="size-3" /> Edit Info
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="size-4 text-slate-400" />
                  {business?.city
                    ? [business.city, business.district]
                        .filter(Boolean)
                        .join(", ")
                    : "Location not set"}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="size-4 text-slate-400" />
                  {business?.phone || "No phone set"}
                </span>
                {vendorWhatsappValue(business?.profileSettings) && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <MessageCircle className="size-4" /> WhatsApp Ready
                  </span>
                )}
              </div>
            </div>

            {/* Website Starting Price Box */}
            <div className="flex items-center justify-between md:justify-end gap-4 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200/80">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {lowestPackagePrice > 0 ? "Starting From" : "Website Pricing"}
                </p>
                <p className="text-lg sm:text-xl font-black text-slate-900">
                  {lowestPackagePrice > 0
                    ? `LKR ${lowestPackagePrice.toLocaleString()}`
                    : "Custom Quote"}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setActiveTab("packages");
                  openNewPackageForm();
                }}
                className="rounded-xl bg-[#183e38] hover:bg-[#12302b] text-white text-xs font-bold gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5" /> Add {copy.singular}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. SIMPLE 4-TAB WORKSPACE NAVIGATION (ALL INLINE — NO PAGE JUMPS!)
      ===================================================================== */}
      <div
        role="tablist"
        aria-label="Simple Vendor Workspace Tabs"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-slate-100/90 p-1.5 border border-slate-200"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "packages"}
          onClick={() => setActiveTab("packages")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "packages"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/70"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Package className="size-4 text-amber-600 shrink-0" />
          <span className="truncate">Packages & Prices</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold text-amber-900">
            {packages.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "photos"}
          onClick={() => setActiveTab("photos")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "photos"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/70"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Images className="size-4 text-sky-600 shrink-0" />
          <span className="truncate">Portfolio Photos</span>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-extrabold text-sky-900">
            {galleries.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/70"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Building2 className="size-4 text-emerald-700 shrink-0" />
          <span className="truncate">Profile & WhatsApp</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "inquiries"}
          onClick={() => setActiveTab("inquiries")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "inquiries"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/70"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <MessageCircle className="size-4 text-violet-600 shrink-0" />
          <span className="truncate">Inquiries</span>
          {totalInquiriesBadge > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-extrabold text-white">
              {totalInquiriesBadge}
            </span>
          )}
        </button>
      </div>

      {/* =====================================================================
          TAB 1: PACKAGES & PRICING (FAST INLINE BUILDER + LIVE CARDS)
      ===================================================================== */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          {/* Header & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Website {copy.plural} & Pricing
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Add the packages or services customers can book on your website
                page.
              </p>
            </div>
            {!isPackageFormOpen && (
              <Button
                onClick={openNewPackageForm}
                className="bg-[#183e38] hover:bg-[#12302b] text-white font-bold rounded-xl gap-2 cursor-pointer"
              >
                <Plus className="size-4" /> Add New {copy.singular}
              </Button>
            )}
          </div>

          {/* INLINE SIMPLE PACKAGE BUILDER */}
          {isPackageFormOpen && (
            <form
              onSubmit={handleSavePackage}
              className="rounded-3xl border-2 border-[#183e38]/20 bg-white p-5 sm:p-7 shadow-md space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-[#183e38] text-white">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {editingPackageId
                        ? `Edit ${copy.singular}`
                        : `Add a New ${copy.singular} to Your Website`}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fill in the title, price (optional), and what is included.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPackageFormOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Photo Upload (4 cols) */}
                <div className="lg:col-span-4 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    1. Package Photo
                  </label>
                  {pkgImage ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 group">
                      <img
                        src={pkgImage}
                        alt="Package preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => pkgFileInputRef.current?.click()}
                          className="rounded-xl text-xs font-bold"
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => setPkgImage("")}
                          className="rounded-xl text-xs font-bold"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isUploadingPkgImage}
                      onClick={() => pkgFileInputRef.current?.click()}
                      className="flex h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-4 text-center hover:border-[#183e38] hover:bg-slate-50 transition cursor-pointer"
                    >
                      {isUploadingPkgImage ? (
                        <>
                          <Loader2 className="size-8 text-[#183e38] animate-spin mb-2" />
                          <span className="text-xs font-bold text-slate-700">
                            Uploading photo...
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="size-7 text-slate-400 mb-2" />
                          <span className="text-xs font-bold text-slate-800">
                            Click to Upload Photo
                          </span>
                          <span className="text-[11px] text-slate-400 mt-1">
                            JPG, PNG, WebP (up to 5MB)
                          </span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={pkgFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePkgPhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Right Column: Title, Price, Duration, Features (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                        2. Package Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={pkgName}
                        onChange={(e) => setPkgName(e.target.value)}
                        placeholder={`e.g. ${copy.example}`}
                        className="h-11 rounded-xl border-slate-200 font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                        3. Price in LKR (Optional)
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-extrabold text-slate-400">
                          LKR
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="any"
                          value={pkgPrice}
                          onChange={(e) => setPkgPrice(e.target.value)}
                          placeholder="Leave blank for Price on Request"
                          className="h-11 pl-12 rounded-xl border-slate-200 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Duration & Quick Chips */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                      Duration / Package Type
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        value={pkgDuration}
                        onChange={(e) => setPkgDuration(e.target.value)}
                        placeholder="e.g. Full Day, Per Event, 8 Hours"
                        className="h-10 sm:w-64 rounded-xl border-slate-200 text-xs font-medium"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {copy.durations.map((dur) => (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setPkgDuration(dur)}
                            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                              pkgDuration === dur
                                ? "border-[#183e38] bg-[#183e38] text-white"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {dur}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                      Short Description
                    </label>
                    <Textarea
                      value={pkgDescription}
                      onChange={(e) => setPkgDescription(e.target.value)}
                      placeholder={copy.description}
                      rows={2}
                      className="rounded-xl border-slate-200 text-sm resize-none"
                    />
                  </div>

                  {/* Included Features / Checklist */}
                  <div className="space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-200/70">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                      4. What&apos;s Included (Bullet Points on Website)
                    </label>

                    {/* Quick 1-Click Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {copy.specs.map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => addFeatureTag(spec)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 transition cursor-pointer"
                        >
                          + {spec}
                        </button>
                      ))}
                    </div>

                    {/* Add Custom Feature Input */}
                    <div className="flex gap-2 pt-1">
                      <Input
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeatureTag(newFeatureInput);
                          }
                        }}
                        placeholder="Type an included item (e.g. Free Album) and click Add..."
                        className="h-10 bg-white rounded-xl border-slate-200 text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addFeatureTag(newFeatureInput)}
                        className="h-10 rounded-xl font-bold text-xs shrink-0"
                      >
                        + Add
                      </Button>
                    </div>

                    {/* Added Feature Pills */}
                    {pkgFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {pkgFeatures.map((feat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-900"
                          >
                            <Check className="size-3 text-emerald-600" />
                            {feat}
                            <button
                              type="button"
                              onClick={() => removeFeatureTag(idx)}
                              className="ml-0.5 text-emerald-700 hover:text-red-600 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsPackageFormOpen(false)}
                  className="rounded-xl font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSavingPackage || isUploadingPkgImage}
                  className="bg-[#183e38] hover:bg-[#12302b] text-white font-bold rounded-xl px-6 h-11 shadow-sm cursor-pointer"
                >
                  {isSavingPackage ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : editingPackageId ? (
                    "Save Package Changes"
                  ) : (
                    `Save & Publish ${copy.singular}`
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* LIVE PACKAGES LIST (MATCHES PUBLIC WEBSITE APPEARANCE) */}
          {isLoadingData ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Loading your packages...
            </div>
          ) : packages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-3">
              <Package className="size-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No packages added yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Customers love seeing clear packages and prices on your profile.
                Use the simple form above to add your first package!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex flex-col md:flex-row gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300"
                >
                  {/* Package Image */}
                  {pkg.image ? (
                    <div className="h-44 w-full md:w-56 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 w-full md:w-48 shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
                      <Package className="size-8 mb-1 text-slate-300" />
                      <span className="text-[11px] font-semibold">
                        No photo
                      </span>
                    </div>
                  )}

                  {/* Package Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {pkg.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={
                                pkg.status === "INACTIVE"
                                  ? "bg-slate-100 text-slate-600 border-slate-200 text-[10px]"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]"
                              }
                            >
                              {pkg.status === "INACTIVE"
                                ? "Hidden"
                                : "Visible on Website"}
                            </Badge>
                          </div>
                          {pkg.description && (
                            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {pkg.description}
                            </p>
                          )}
                        </div>

                        <div className="sm:text-right shrink-0">
                          <p className="text-xl font-black text-slate-900">
                            {servicePriceLabel(pkg.price)}
                          </p>
                          {pkg.duration && (
                            <p className="text-xs text-slate-500 font-semibold flex items-center sm:justify-end gap-1 mt-0.5">
                              <Clock className="size-3.5 text-emerald-700" />
                              {pkg.duration}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                          {pkg.features.map((feat, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200/60"
                            >
                              <Check className="size-3.5 text-emerald-600" />
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Package Actions */}
                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePackageStatus(pkg)}
                        className="h-9 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
                      >
                        {pkg.status === "INACTIVE" ? (
                          <>
                            <Eye className="size-3.5" /> Show on Website
                          </>
                        ) : (
                          <>
                            <EyeOff className="size-3.5" /> Hide
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openEditPackageForm(pkg)}
                        className="h-9 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="size-3.5" /> Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="h-9 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 gap-1 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: PORTFOLIO PHOTOS (1-CLICK UPLOAD + PHOTO GRID)
      ===================================================================== */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Website Portfolio Photos ({galleries.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Upload photos of your past events and work. Click &quot;Set
                Cover&quot; on any photo to make it your main banner.
              </p>
            </div>
            <div>
              <Button
                onClick={() => galleryFileInputRef.current?.click()}
                disabled={isUploadingGallery}
                className="bg-[#183e38] hover:bg-[#12302b] text-white font-bold rounded-xl h-11 px-5 gap-2 cursor-pointer"
              >
                {isUploadingGallery ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="size-4" /> Upload Photos
                  </>
                )}
              </Button>
              <input
                ref={galleryFileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </div>
          </div>

          {galleries.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
              <Images className="size-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                Your photo gallery is empty
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload 4 to 8 clear photos of your work so customers can see
                your quality before booking.
              </p>
              <Button
                variant="outline"
                onClick={() => galleryFileInputRef.current?.click()}
                className="rounded-xl font-bold text-xs"
              >
                Select Photos from Device
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleries.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs"
                >
                  <img
                    src={item.url}
                    alt="Portfolio item"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {item.isCover && (
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow">
                      <Star className="size-3 fill-white" /> Cover
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3">
                    <button
                      type="button"
                      onClick={() => handleSetGalleryCover(item.id, item.url)}
                      className="rounded-lg bg-white/90 hover:bg-white px-2.5 py-1 text-[11px] font-bold text-slate-900 transition cursor-pointer"
                    >
                      Set as Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryPhoto(item.id)}
                      className="rounded-lg bg-red-600/90 hover:bg-red-600 p-1.5 text-white transition cursor-pointer"
                      title="Delete photo"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: PROFILE, CONTACT & WHATSAPP (SINGLE CLEAN FORM)
      ===================================================================== */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Website Profile, WhatsApp & Contact Info
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Update the information displayed on your public Nakathata.lk
                profile page.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isSavingProfile}
              className="bg-[#183e38] hover:bg-[#12302b] text-white font-bold rounded-xl gap-2 cursor-pointer"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save Profile to Website
                </>
              )}
            </Button>
          </div>

          {/* 1. WHATSAPP DIRECT CONTACT (HIGHLIGHTED FOR SRI LANKA VENDORS) */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <MessageCircle className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    WhatsApp Number for Customer Inquiries
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Powers the green &quot;Chat on WhatsApp&quot; button on your
                    public website profile.
                  </p>
                </div>
              </div>
              {whatsappTestLink && (
                <a
                  href={whatsappTestLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
                >
                  <span>Test WhatsApp Button</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-emerald-950 block mb-1">
                  WhatsApp Number
                </label>
                <Input
                  value={profileForm.whatsapp}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, whatsapp: e.target.value }))
                  }
                  placeholder="e.g. 0771234567"
                  className="h-11 bg-white rounded-xl border-emerald-200 font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Call Number
                </label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="e.g. 0771234567"
                  className="h-11 bg-white rounded-xl border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Public Email Address
                </label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  className="h-11 bg-white rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* 2. BUSINESS IDENTITY & BIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Business Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, name: e.target.value }))
                }
                className="h-11 rounded-xl border-slate-200 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <CategorySelector
                value={profileForm.categoryId}
                onChange={(id) =>
                  setProfileForm((p) => ({ ...p, categoryId: id }))
                }
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                About Your Business (Shown on Website)
              </label>
              <Textarea
                value={profileForm.description}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={4}
                placeholder="Tell customers about your experience, style, and why they should book you for their wedding or event..."
                className="rounded-xl border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Key Highlights (Comma Separated)
              </label>
              <Input
                value={profileForm.highlights}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, highlights: e.target.value }))
                }
                placeholder="e.g. Islandwide Travel, 10+ Years Experience, Drone Video"
                className="h-11 rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Languages Spoken
              </label>
              <Input
                value={profileForm.languages}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, languages: e.target.value }))
                }
                placeholder="English, Sinhala, Tamil"
                className="h-11 rounded-xl border-slate-200"
              />
            </div>
          </div>

          {/* 3. LOCATION */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="size-4 text-emerald-700" /> Location on Website
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  City / Town
                </label>
                <Input
                  value={profileForm.city}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, city: e.target.value }))
                  }
                  placeholder="e.g. Nugegoda, Kandy"
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  District
                </label>
                <select
                  value={profileForm.district}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, district: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="">Select District...</option>
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Street Address
                </label>
                <Input
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="No. 123, High Level Road..."
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* 4. SOCIAL LINKS */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="size-4 text-emerald-700" /> Social Media &
              Website Links (Optional)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Facebook Page Link
                </label>
                <Input
                  value={profileForm.facebook}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, facebook: e.target.value }))
                  }
                  placeholder="https://facebook.com/yourpage"
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Instagram Link
                </label>
                <Input
                  value={profileForm.instagram}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, instagram: e.target.value }))
                  }
                  placeholder="https://instagram.com/yourpage"
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  TikTok Link
                </label>
                <Input
                  value={profileForm.tiktok}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, tiktok: e.target.value }))
                  }
                  placeholder="https://tiktok.com/@yourpage"
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Website URL
                </label>
                <Input
                  value={profileForm.website}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, website: e.target.value }))
                  }
                  placeholder="https://yourbusiness.lk"
                  className="h-11 rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <Button
              type="submit"
              disabled={isSavingProfile}
              className="bg-[#183e38] hover:bg-[#12302b] text-white font-bold rounded-xl px-8 h-12 shadow-sm gap-2 cursor-pointer"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" /> Save All Profile Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* =====================================================================
          TAB 4: CUSTOMER INQUIRIES & BOOKINGS
      ===================================================================== */}
      {activeTab === "inquiries" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookings Column */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-violet-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Booking Requests ({bookings.length})
                </h3>
              </div>
              <Link
                href="/vendor/bookings"
                className="text-xs font-bold text-[#183e38] underline"
              >
                Open Full Bookings →
              </Link>
            </div>

            {bookings.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No booking requests yet.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 6).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {b.customer
                          ? `${b.customer.firstName || ""} ${b.customer.lastName || ""}`.trim() ||
                            "Customer"
                          : b.package?.name || "Booking Request"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {b.package?.name || "Custom Inquiry"}
                        {b.date || b.eventDate
                          ? ` · ${new Date(b.date || b.eventDate || "").toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        b.status === "PENDING"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }
                    >
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages Column */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Customer Messages ({conversations.length})
                </h3>
              </div>
              <Link
                href="/vendor/messages"
                className="text-xs font-bold text-[#183e38] underline"
              >
                Open Inbox →
              </Link>
            </div>

            {conversations.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No customer messages yet.
              </p>
            ) : (
              <div className="space-y-3">
                {conversations.slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    href="/vendor/messages"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 hover:bg-slate-100 transition"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {c.customer
                          ? `${c.customer.firstName || ""} ${c.customer.lastName || ""}`.trim()
                          : "Customer"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {c.messages?.[0]?.content || "Open conversation"}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#183e38] shrink-0">
                      Reply →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          3. VENDOR SUPPORT FOOTER
      ===================================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-[#f0f5ee] border border-[#d6e3d2] p-5">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-xs">
            <HelpCircle className="size-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#183e38]">
              Need help setting up your packages or profile?
            </h3>
            <p className="text-xs text-slate-600">
              Message our Sri Lanka vendor support team on WhatsApp anytime.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/94760762353"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1b4332] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#143326]"
        >
          <Phone className="size-3.5" />
          <span>WhatsApp Support: 076 076 2353</span>
        </a>
      </div>
    </div>
  );
}
