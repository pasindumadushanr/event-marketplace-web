// Match category names/slugs, not business names ("Cards" must not match "car").
export function serviceCardCopy(business: any) {
  const category =
    typeof business === "string"
      ? business
      : `${business?.category?.name || ""} ${business?.category?.slug || ""} ${business?.categoryName || ""}`;
  const text = category.toLowerCase().replace(/[-_]/g, " ");
  const kind =
    /\b(cars?|vehicles?|transport|limousines?|sedans?|coaches|vans?)\b/.test(
      text,
    )
      ? "vehicle"
      : /\bcakes?\b/.test(text)
        ? "cake"
        : /photo|cinematograph|videograph|video/.test(text)
          ? "package"
          : "service";
  const examples = {
    vehicle: {
      plural: "Vehicles",
      example: "Wedding car with driver",
      description:
        "Describe the vehicle, seating capacity and what the rental includes.",
      specs: [
        "Uniformed Chauffeur Included",
        "Full Air Conditioned",
        "100km / 8 Hours Included",
        "Fuel & Driver Allowance Covered",
      ],
      durations: ["8 Hours / 100km", "Full Day Rental", "Per Day", "Per Event"],
    },
    cake: {
      plural: "Cakes",
      example: "Three-tier floral wedding cake",
      description:
        "Describe the flavours, size, servings and decoration options.",
      specs: [
        "Custom design",
        "Flavour consultation",
        "Delivery available",
        "Cake stand included",
      ],
      durations: ["Per Cake", "Per Serving", "Per Event"],
    },
    package: {
      plural: "Packages",
      example: "Full-day wedding photography",
      description: "Describe the coverage, deliverables and what is included.",
      specs: [
        "Full-day coverage",
        "Edited digital photos",
        "Online gallery",
        "Wedding album",
      ],
      durations: ["Full Day", "Half Day", "Per Event", "Per Hour"],
    },
    service: {
      plural: "Services",
      example: "Standard wedding service",
      description: "Describe what you offer and what customers can expect.",
      specs: ["Setup included", "Event-day support", "Customisation available"],
      durations: ["Per Event", "Full Day", "Half Day", "Per Hour"],
    },
  };
  const details = { ...examples[kind] };
  if (kind === "service" && /cater|food/.test(text)) {
    details.example = "Wedding buffet for 100 guests";
    details.specs = [
      "Buffet service",
      "Serving staff",
      "Vegetarian options",
      "Tableware included",
    ];
  } else if (kind === "service" && /venue|hotel|hall/.test(text)) {
    details.example = "Wedding hall for 200 guests";
    details.specs = [
      "Guest parking",
      "Air conditioning",
      "Tables and chairs",
      "Bridal dressing room",
    ];
  }
  return { kind, singular: kind, add: `Add a ${kind}`, ...details };
}

// Zero is the existing storage representation for listings without a set price.
// These listings are enquiries, never free bookings.
export function servicePriceLabel(price: unknown) {
  const value = Number(price);
  return Number.isFinite(value) && value > 0
    ? `LKR ${value.toLocaleString()}`
    : "Price on request";
}
