export const SRI_LANKA_PROVINCES_DISTRICTS = [
  {
    province: "Western Province",
    districts: ["Colombo", "Gampaha", "Kalutara"],
  },
  {
    province: "Central Province",
    districts: ["Kandy", "Matale", "Nuwara Eliya"],
  },
  {
    province: "Southern Province",
    districts: ["Galle", "Matara", "Hambantota"],
  },
  {
    province: "Northern Province",
    districts: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
  },
  {
    province: "Eastern Province",
    districts: ["Batticaloa", "Ampara", "Trincomalee"],
  },
  {
    province: "North Western Province",
    districts: ["Kurunegala", "Puttalam"],
  },
  {
    province: "North Central Province",
    districts: ["Anuradhapura", "Polonnaruwa"],
  },
  {
    province: "Uva Province",
    districts: ["Badulla", "Monaragala"],
  },
  {
    province: "Sabaragamuwa Province",
    districts: ["Ratnapura", "Kegalle"],
  },
];

export const SRI_LANKA_DISTRICTS = SRI_LANKA_PROVINCES_DISTRICTS.flatMap(
  (group) => group.districts,
).sort();
