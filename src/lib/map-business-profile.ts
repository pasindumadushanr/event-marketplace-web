// Helper to map backend data to frontend component expected props
export function mapBusinessData(data: any) {
  if (!data) return null;

  // Safe parse for fields that might be arrays, comma-separated strings, or JSON strings
  const parseArrayOrDelimited = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val))
      return val
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed))
          return parsed
            .map(String)
            .map((s) => s.trim())
            .filter(Boolean);
      } catch {}
      return val
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const highlights = parseArrayOrDelimited(data.profileSettings?.highlights);
  const languages = (() => {
    const parsed = parseArrayOrDelimited(data.profileSettings?.languages);
    return parsed.length > 0 ? parsed : ["English"];
  })();

  const rawStartingPrice = Number(data.startingPrice);
  const startingPrice =
    !isNaN(rawStartingPrice) && rawStartingPrice > 0
      ? rawStartingPrice
      : Array.isArray(data.packages) && data.packages.length > 0
        ? Math.min(
            ...data.packages
              .map((p: any) => Number(p.price) || 0)
              .filter((p: number) => p > 0),
          ) || 0
        : 0;

  return {
    id: data.id,
    slug: data.profileSettings?.seo?.slug || data.id,
    name: data.name || "Vendor",
    logo: data.logo || "",
    coverImage:
      data.coverImage ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
    categoryId: data.categoryId || "",
    categoryName: data.category?.name || "Vendor",
    isVerified: !!data.isVerified,
    rating: Number(data.rating) || 0,
    reviewCount: Number(data.reviewCount) || 0,
    startingPrice: startingPrice === Infinity ? 0 : startingPrice,
    yearsOfExperience: Number(data.profileSettings?.yearsOfExperience) || 1,
    responseTime: data.profileSettings?.responseTime || "Within 24 hours",
    memberSince: data.createdAt
      ? new Date(data.createdAt).getFullYear().toString()
      : "2026",

    description: data.description || "",
    highlights,
    languages,

    verification: {
      isBusinessVerified: !!data.isVerified,
      isEmailVerified: true,
      isPhoneVerified: !!data.phone,
      isIdentityVerified: false,
      isRegistrationVerified: !!data.isVerified,
    },

    featureGroups: Array.isArray(data.profileSettings?.features)
      ? data.profileSettings.features
          .filter(
            (g: any) =>
              g &&
              (g.features?.length || (g as any).items?.length || g.groupName),
          )
          .map((g: any) => ({
            groupName: g.groupName || "Amenities",
            features: Array.isArray(g.features)
              ? g.features
              : parseArrayOrDelimited(g.items || g.features),
          }))
      : [],

    gallery: Array.isArray(data.galleries)
      ? data.galleries.map((g: any) => ({
          id: g.id,
          url: g.url,
          type: g.type || "IMAGE",
        }))
      : [],

    packages: Array.isArray(data.packages)
      ? data.packages.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          description: p.description || "",
          image: p.image || "",
          features: Array.isArray(p.features)
            ? p.features
            : parseArrayOrDelimited(p.features),
          duration: p.duration || "",
        }))
      : [],

    bookingMethod: data.profileSettings?.bookingMethod || "DIRECT_BOOKING",
    blockedDates: parseArrayOrDelimited(data.unavailableDates ?? data.profileSettings?.blockedDates),

    businessHours: (() => {
      const defaultHours: Record<string, string> = {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      };

      if (Array.isArray(data.profileSettings?.hours)) {
        const obj: Record<string, string> = { ...defaultHours };
        data.profileSettings.hours.forEach((item: any) => {
          const key = item.day?.toLowerCase();
          if (key) {
            obj[key] = item.isClosed
              ? "Closed"
              : `${item.openTime || "9:00 AM"} - ${item.closeTime || "6:00 PM"}`;
          }
        });
        return obj;
      }
      return data.profileSettings?.businessHours || defaultHours;
    })(),

    location: {
      address: data.address || "",
      city: data.city || "",
      district: data.district || "",
      mapEmbedUrl:
        data.googleMapLocation ||
        data.profileSettings?.location?.mapEmbedUrl ||
        "",
    },

    contact: {
      phone: data.phone || "",
      email: data.email || "",
      website: data.website || "",
      facebook: data.facebook || "",
      instagram: data.instagram || "",
      youtube: data.youtube || "",
      tiktok: data.profileSettings?.tiktok || "",
      whatsapp:
        data.profileSettings?.whatsapp ||
        data.profileSettings?.contact?.whatsapp ||
        data.phone ||
        "",
    },

    faq: Array.isArray(data.profileSettings?.faqs)
      ? data.profileSettings.faqs
      : Array.isArray(data.profileSettings?.faq)
        ? data.profileSettings.faq
        : [],

    policies: {
      booking:
        data.profileSettings?.policies?.bookingPolicy ??
        data.profileSettings?.policies?.booking ??
        "Contact vendor for booking policies.",
      cancellation:
        data.profileSettings?.policies?.cancellationPolicy ??
        data.profileSettings?.policies?.cancellation ??
        "Contact vendor for cancellation policies.",
      payment:
        data.profileSettings?.policies?.paymentPolicy ??
        data.profileSettings?.policies?.payment ??
        "Contact vendor for payment terms.",
      terms:
        data.profileSettings?.policies?.terms || "Standard vendor terms apply.",
    },

    reviews: Array.isArray(data.reviews)
      ? data.reviews.map((r: any) => ({
          id: r.id,
          customerName: r.customer
            ? `${r.customer.firstName || ""} ${r.customer.lastName || ""}`.trim() ||
              "Customer"
            : "Customer",
          rating: Number(r.rating) || 5,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
          comment: r.comment || "",
          vendorReply: r.reply || null,
        }))
      : [],
  };
}
