export function imageGuidelines(key: string, category = false) {
  if (key === "heroImage")
    return {
      size: "1920 × 1080 px",
      ratio: "16:9",
      tip: "Use a wide landscape image. Keep important details near the center; phones crop the sides.",
    };
  if (key === "logoImage")
    return {
      size: "800 × 500 px",
      ratio: "8:5",
      tip: "A transparent PNG with little empty space works best. The full logo is displayed without cropping.",
    };
  if (key === "packageFallbackImage")
    return {
      size: "1200 × 900 px",
      ratio: "4:3",
      tip: "Use a landscape photograph. Keep the subject centered so it stays visible in package cards.",
    };
  if (category || key.startsWith("location"))
    return {
      size: "800 × 1000 px",
      ratio: "4:5",
      tip: "Use a portrait photograph with the main subject centered. Card edges may crop as the screen width changes.",
    };
  return {
    size: "1200 × 900 px",
    ratio: "4:3",
    tip: "Keep important details near the center.",
  };
}
