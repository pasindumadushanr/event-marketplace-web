"use client";

import { Plus, Trash2 } from "lucide-react";
import { ProfileData, Section, Service, lines } from "./visual-profile-model";

type Props = {
  section: Section;
  data: ProfileData;
  setData: (data: ProfileData) => void;
  onFile: (file: File, field: string) => void;
  serviceId: string;
  selectService: (id: string) => void;
  removePhoto: (id: string) => void;
  galleryPending: boolean;
};

export function VisualProfileFields({
  section,
  data,
  setData,
  onFile,
  serviceId,
  selectService,
  removePhoto,
  galleryPending,
}: Props) {
  const setting = (key: string, value: unknown) =>
    setData({
      ...data,
      profileSettings: { ...data.profileSettings, [key]: value },
    });
  const field = (
    key: string,
    label: string,
    multiline = false,
    type = "text",
  ) => (
    <label key={key} className="visual-field">
      {label}
      {multiline ? (
        <textarea
          rows={4}
          value={String(data[key] || "")}
          onChange={(e) => setData({ ...data, [key]: e.target.value })}
        />
      ) : (
        <input
          type={type}
          value={String(data[key] || "")}
          onChange={(e) => setData({ ...data, [key]: e.target.value })}
        />
      )}
    </label>
  );
  const upload = (key: string, label: string, video = false) => (
    <label key={key} className="visual-field">
      {label}
      <input
        type="file"
        accept={
          video
            ? "image/jpeg,image/png,image/webp,video/mp4"
            : "image/jpeg,image/png,image/webp"
        }
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(e.target.files[0], key);
          e.target.value = "";
        }}
      />
      <span className="text-xs font-normal text-slate-500">
        {video ? "JPG, PNG, WebP or MP4" : "JPG, PNG or WebP"} · up to 5 MB.
        Uploaded when you save.
      </span>
    </label>
  );
  if (section === "hero")
    return (
      <>
        {field("name", "Business name")}
        {upload("coverImage", "Replace cover photo")}
        {upload("logo", "Replace logo")}
      </>
    );
  if (section === "about")
    return (
      <>
        {field("description", "Tell customers about your business", true)}
        {(["highlights", "languages"] as const).map((key) => (
          <label key={key} className="visual-field">
            {key === "highlights"
              ? "Highlights — one per line"
              : "Languages — one per line"}
            <textarea
              rows={3}
              value={lines(data.profileSettings[key])}
              onChange={(e) => setting(key, e.target.value)}
            />
          </label>
        ))}
      </>
    );
  if (section === "contact")
    return (
      <>
        {field("phone", "Phone number", false, "tel")}
        {field("email", "Email address", false, "email")}
        {["website", "facebook", "instagram", "youtube"].map((key) =>
          field(
            key,
            `${key.charAt(0).toUpperCase() + key.slice(1)} URL`,
            false,
            "url",
          ),
        )}
        <label className="visual-field">
          WhatsApp number
          <input
            type="tel"
            value={data.profileSettings.whatsapp || ""}
            onChange={(e) => setting("whatsapp", e.target.value)}
          />
        </label>
      </>
    );
  if (section === "location")
    return (
      <>
        {field("address", "Street address", true)}
        {field("city", "City")}
        {field("district", "District")}
        {field("province", "Province")}
        {field("zipCode", "Postal code")}
        {field("googleMapLocation", "Google Maps embed URL", false, "url")}
        <p className="text-xs text-slate-500">
          Paste the HTTPS URL from the map embed, not the iframe code.
        </p>
      </>
    );
  if (section === "policies")
    return (
      <>
        {[
          ["bookingPolicy", "Booking policy"],
          ["cancellationPolicy", "Cancellation policy"],
          ["paymentPolicy", "Payment policy"],
        ].map(([key, label]) => (
          <label key={key} className="visual-field">
            {label}
            <textarea
              rows={4}
              value={data.profileSettings.policies?.[key] || ""}
              onChange={(e) =>
                setting("policies", {
                  ...data.profileSettings.policies,
                  [key]: e.target.value,
                })
              }
            />
          </label>
        ))}
        <p className="text-xs text-slate-500">
          Use your own terms. Saving updates these policies on your page.
        </p>
      </>
    );
  if (section === "faq") {
    const faqs = data.profileSettings.faqs || [];
    return (
      <>
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border p-3 space-y-3">
            <label className="visual-field">
              Question {i + 1}
              <input
                value={faq.question}
                onChange={(e) =>
                  setting(
                    "faqs",
                    faqs.map((v, j) =>
                      j === i ? { ...v, question: e.target.value } : v,
                    ),
                  )
                }
              />
            </label>
            <label className="visual-field">
              Answer
              <textarea
                rows={3}
                value={faq.answer}
                onChange={(e) =>
                  setting(
                    "faqs",
                    faqs.map((v, j) =>
                      j === i ? { ...v, answer: e.target.value } : v,
                    ),
                  )
                }
              />
            </label>
            <button
              type="button"
              className="visual-remove"
              onClick={() =>
                setting(
                  "faqs",
                  faqs.filter((_, j) => j !== i),
                )
              }
            >
              <Trash2 size={14} />
              Remove question {i + 1}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="business-subtle-button"
          onClick={() =>
            setting("faqs", [...faqs, { question: "", answer: "" }])
          }
        >
          <Plus size={14} />
          Add question
        </button>
      </>
    );
  }
  if (section === "features") {
    const groups = data.profileSettings.features || [];
    return (
      <>
        {groups.map((group, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-3">
            <label className="visual-field">
              Group name
              <input
                value={group.groupName}
                onChange={(e) =>
                  setting(
                    "features",
                    groups.map((v, j) =>
                      j === i ? { ...v, groupName: e.target.value } : v,
                    ),
                  )
                }
              />
            </label>
            <label className="visual-field">
              Features — one per line
              <textarea
                rows={4}
                value={group.features.join("\n")}
                onChange={(e) =>
                  setting(
                    "features",
                    groups.map((v, j) =>
                      j === i
                        ? { ...v, features: e.target.value.split("\n") }
                        : v,
                    ),
                  )
                }
              />
            </label>
            <button
              type="button"
              className="visual-remove"
              onClick={() =>
                setting(
                  "features",
                  groups.filter((_, j) => j !== i),
                )
              }
            >
              <Trash2 size={14} />
              Remove group
            </button>
          </div>
        ))}
        <button
          type="button"
          className="business-subtle-button"
          onClick={() =>
            setting("features", [...groups, { groupName: "", features: [] }])
          }
        >
          <Plus size={14} />
          Add feature group
        </button>
      </>
    );
  }
  if (section === "hours")
    return (
      <>
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => {
          const row = data.profileSettings.hours?.find(
            (item) => item.day === day,
          ) || { day, isClosed: false, openTime: "", closeTime: "" };
          const update = (value: Partial<typeof row>) =>
            setting("hours", [
              ...(data.profileSettings.hours || []).filter(
                (item) => item.day !== day,
              ),
              { ...row, ...value },
            ]);
          return (
            <div key={day} className="space-y-2 rounded-xl border p-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{day}</span>
                <label className="flex gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={row.isClosed}
                    onChange={(e) => update({ isClosed: e.target.checked })}
                  />
                  Closed
                </label>
              </div>
              {!row.isClosed && (
                <div className="grid grid-cols-2 gap-2">
                  <label className="visual-field">
                    Opens
                    <input
                      type="time"
                      value={row.openTime}
                      onChange={(e) => update({ openTime: e.target.value })}
                    />
                  </label>
                  <label className="visual-field">
                    Closes
                    <input
                      type="time"
                      value={row.closeTime}
                      onChange={(e) => update({ closeTime: e.target.value })}
                    />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  if (section === "gallery")
    return (
      <>
        <p className="text-xs text-slate-500">
          Add or remove one photo/video at a time, then save. No public changes
          happen before saving.
        </p>
        {!galleryPending && upload("gallery", "Add a photo or video", true)}
        {data.galleries.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border p-2"
          >
            {item.type === "VIDEO" ? (
              <video
                src={item.url}
                className="h-16 w-20 rounded-lg object-cover"
              />
            ) : (
              <img
                src={item.url}
                alt="Gallery item"
                className="h-16 w-20 rounded-lg object-cover"
              />
            )}
            <span className="flex-1 text-xs">
              {item.id === "__new__"
                ? "Unsaved upload"
                : item.type === "VIDEO"
                  ? "Video"
                  : "Photo"}
            </span>
            {!galleryPending && (
              <button
                type="button"
                className="visual-remove"
                onClick={() => removePhoto(item.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </>
    );
  if (section === "packages") {
    const service = data.packages.find((item) => item.id === serviceId);
    const update = (patch: Partial<Service>) =>
      setData({
        ...data,
        packages: data.packages.map((item) =>
          item.id === serviceId ? { ...item, ...patch } : item,
        ),
      });
    return (
      <>
        <label className="visual-field">
          Choose a service
          <select
            value={serviceId}
            onChange={(e) => selectService(e.target.value)}
          >
            <option value="">Choose…</option>
            {data.packages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name || "New service"}
                {item.status !== "ACTIVE" ? " (hidden)" : ""}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="business-subtle-button"
          onClick={() => selectService("__new__")}
        >
          <Plus size={14} />
          Add a service
        </button>
        {service && (
          <>
            {(["name", "description", "duration"] as const).map((key) => (
              <label key={key} className="visual-field">
                {key === "name"
                  ? "Service name"
                  : key === "description"
                    ? "Description"
                    : "Duration"}
                <textarea
                  rows={key === "description" ? 3 : 1}
                  value={service[key]}
                  onChange={(e) => update({ [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="visual-field">
              Price (LKR)
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={service.price}
                onChange={(e) => update({ price: e.target.value })}
              />
            </label>
            {upload("serviceImage", "Service photo")}
            <label className="visual-field">
              What’s included — one per line
              <textarea
                rows={4}
                value={service.features.join("\n")}
                onChange={(e) =>
                  update({ features: e.target.value.split("\n") })
                }
              />
            </label>
            <label className="visual-field">
              Visibility
              <select
                value={service.status}
                onChange={(e) => update({ status: e.target.value })}
              >
                <option value="ACTIVE">Show on my page</option>
                <option value="INACTIVE">Hide from my page</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>
          </>
        )}
      </>
    );
  }
  return null;
}
