"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

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

import { BlockRenderer } from "@/components/business/BlockRenderer";

export default function VendorPreviewPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await api.get("/vendor/business");
      const blocksRes = await api.get("/vendor/business/content");
      const packagesRes = await api.get("/vendor/packages");

      const dbData = res.data;
      setBlocks(blocksRes.data || []);

      const settings = dbData.profileSettings || {};
      const list = (value: unknown): string[] =>
        Array.isArray(value)
          ? value.map(String)
          : typeof value === "string"
            ? value
                .split(/,|\n/)
                .map((item) => item.trim())
                .filter(Boolean)
            : [];
      const packages = (packagesRes.data || []).filter(
        (item: { status: string }) => item.status === "ACTIVE",
      );
      const mixedBusiness = {
        id: dbData.id,
        slug: settings.seo?.slug || dbData.id,
        name: dbData.name || "Your business",
        description: dbData.description || "",
        logo: dbData.logo || "",
        coverImage: dbData.coverImage || "",
        categoryName: dbData.category?.name || "Your category",
        categoryId: dbData.category?.id || "",
        status: dbData.status,
        isVerified: !!dbData.isVerified,
        rating: Number(dbData.rating) || 0,
        reviewCount: Number(dbData.reviewCount) || 0,
        startingPrice:
          Number(dbData.startingPrice) ||
          (packages.length
            ? Math.min(
                ...packages.map(
                  (item: { price: string }) => Number(item.price) || 0,
                ),
              )
            : 0),
        yearsOfExperience: Number(settings.yearsOfExperience) || 0,
        responseTime: settings.responseTime || "Not specified",
        memberSince: dbData.createdAt
          ? new Date(dbData.createdAt).getFullYear().toString()
          : "",
        highlights: list(settings.highlights),
        languages: list(settings.languages),
        verification: {
          isBusinessVerified: !!dbData.isVerified,
          isEmailVerified: false,
          isPhoneVerified: false,
          isIdentityVerified: false,
          isRegistrationVerified: !!dbData.isVerified,
        },
        featureGroups: (settings.features || []).map(
          (group: {
            groupName: string;
            features?: string[];
            items?: string[];
          }) => ({
            groupName: group.groupName,
            features: list(group.features || group.items),
          }),
        ),
        gallery: dbData.galleries || [],
        packages: packages.map(
          (item: { price: string; features: string[] }) => ({
            ...item,
            price: Number(item.price),
            features: list(item.features),
          }),
        ),
        reviews: (dbData.reviews || []).map(
          (review: {
            id: string;
            customer?: { firstName: string; lastName: string };
            rating: number;
            createdAt: string;
            comment: string;
            reply: string;
          }) => ({
            id: review.id,
            customerName:
              [review.customer?.firstName, review.customer?.lastName]
                .filter(Boolean)
                .join(" ") || "Customer",
            rating: Number(review.rating),
            date: new Date(review.createdAt).toLocaleDateString(),
            comment: review.comment,
            vendorReply: review.reply,
          }),
        ),
        faq: settings.faqs || settings.faq || [],
        policies: {
          booking: settings.policies?.bookingPolicy || "",
          cancellation: settings.policies?.cancellationPolicy || "",
          payment: settings.policies?.paymentPolicy || "",
          terms: settings.policies?.terms || "",
        },
        bookingMethod: settings.bookingMethod || "DIRECT_BOOKING",
        blockedDates: list(settings.blockedDates),
        businessHours: {
          ...Object.fromEntries(
            [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => [day, "Not provided"]),
          ),
          ...Object.fromEntries(
            (settings.hours || []).map(
              (day: {
                day: string;
                isClosed: boolean;
                openTime: string;
                closeTime: string;
              }) => [
                day.day.toLowerCase(),
                day.isClosed ? "Closed" : `${day.openTime} - ${day.closeTime}`,
              ],
            ),
          ),
        },
        contact: {
          email: dbData.email || "",
          phone: dbData.phone || "",
          website: dbData.website || "",
          facebook: dbData.facebook || "",
          instagram: dbData.instagram || "",
          whatsapp: settings.contact?.whatsapp || settings.whatsapp || "",
        },
        location: {
          address: dbData.address || "",
          city: dbData.city || "",
          district: dbData.district || "",
          mapEmbedUrl:
            dbData.googleMapLocation || settings.location?.mapEmbedUrl || "",
        },
      };

      setBusiness(mixedBusiness);
    } catch (error) {
      toast.error("Failed to load preview");
      router.push("/vendor/business/general");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      if (business.status === "ACTIVE") {
        if (
          !window.confirm(
            "Hide your business page from customers? Existing bookings will remain.",
          )
        )
          return;
        await api.patch("/vendor/business/unpublish");
        setBusiness({ ...business, status: "INACTIVE" });
        toast.success("Your business profile is now hidden from the public.");
      } else {
        await api.patch("/vendor/business/publish");
        setBusiness({ ...business, status: "ACTIVE" });
        toast.success("Your business is now live on the marketplace!");
      }
    } catch (error) {
      toast.error("Failed to change publish status");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Preview...
      </div>
    );
  if (!business) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Top Preview Bar */}
      <div className="sticky top-0 z-20 bg-slate-900 text-white px-4 py-3 flex flex-wrap gap-3 items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/vendor/business/general")}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
          <div className="h-6 w-px bg-slate-700 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Preview Mode
            </span>
            <span className="text-slate-400">
              Preview of your saved business details. Missing sections stay
              empty.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {business.status === "ACTIVE" ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
              <CheckCircle className="h-4 w-4" />
              Published Live
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30">
              <EyeOff className="h-4 w-4" />
              Hidden (Unpublished)
            </div>
          )}
          <Button
            onClick={handlePublishToggle}
            disabled={isPublishing}
            className={
              business.status === "ACTIVE"
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          >
            {isPublishing
              ? "Updating..."
              : business.status === "ACTIVE"
                ? "Hide My Page"
                : "Make My Page Visible"}
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4 border-2 border-dashed border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden relative">
        {/* Top Level Hero */}
        <BusinessHero business={business} />

        {/* Two Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Main Content Column (70%) */}
          <div className="lg:col-span-8 space-y-8">
            <BusinessTrust verification={business.verification} />

            {blocks
              .filter((b) => b.position === "BEFORE_ABOUT")
              .map((b) => (
                <BlockRenderer key={b.id} block={b} />
              ))}

            <BusinessAbout business={business} />

            {blocks
              .filter((b) => b.position === "AFTER_ABOUT")
              .map((b) => (
                <BlockRenderer key={b.id} block={b} />
              ))}

            <BusinessFeatures featureGroups={business.featureGroups} />

            {blocks
              .filter((b) => b.position === "BEFORE_GALLERY")
              .map((b) => (
                <BlockRenderer key={b.id} block={b} />
              ))}

            <BusinessGallery gallery={business.gallery} />
            <BusinessPackages
              packages={business.packages}
              businessName={business.name}
            />

            {blocks
              .filter((b) => b.position === "AFTER_PACKAGES")
              .map((b) => (
                <BlockRenderer key={b.id} block={b} />
              ))}

            <BusinessReviews
              reviews={business.reviews}
              rating={business.rating}
              reviewCount={business.reviewCount}
            />
            <BusinessFAQ faq={business.faq} />
            <BusinessPolicies policies={business.policies} />

            {blocks
              .filter((b) => b.position === "AT_BOTTOM")
              .map((b) => (
                <div key={b.id} className="mt-8">
                  <BlockRenderer block={b} />
                </div>
              ))}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Customer booking actions are disabled in this preview.
              </div>
              <BusinessAvailability blockedDates={business.blockedDates} />
              <BusinessHours hours={business.businessHours} />
              <BusinessContact contact={business.contact} />
              <BusinessLocation location={business.location} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
