"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  CalendarCheck,
  CalendarX,
  Wallet,
  MessageCircle,
  Eye,
  Check,
  Info,
} from "lucide-react";
import { useBusinessProfile } from "@/contexts/BusinessProfileContext";
import { toast } from "sonner";
import api from "@/lib/api";

type Policies = {
  bookingPolicy: string;
  cancellationPolicy: string;
  paymentPolicy: string;
};
type Faq = { question: string; answer: string };
const policyFields = [
  {
    key: "bookingPolicy" as const,
    title: "How can customers book?",
    label: "Booking policy",
    hint: "Explain how a date is reserved and when a booking is confirmed.",
    prompt: "What should a customer do first? Is an advance payment required?",
    icon: CalendarCheck,
  },
  {
    key: "cancellationPolicy" as const,
    title: "What if plans change?",
    label: "Cancellation policy",
    hint: "Explain cancellations, date changes and any refund conditions.",
    prompt:
      "How much notice do you need? Can customers change their event date?",
    icon: CalendarX,
  },
  {
    key: "paymentPolicy" as const,
    title: "How does payment work?",
    label: "Payment policy",
    hint: "Explain when payments are due and which payment methods you accept.",
    prompt: "When is the balance due? Are there any additional charges?",
    icon: Wallet,
  },
];

export default function PoliciesSettingsPage() {
  const {
    business,
    isLoading: profileLoading,
    updateBusinessLocally,
  } = useBusinessProfile();
  if (profileLoading)
    return <p className="p-6 text-slate-500">Loading your details…</p>;
  if (!business)
    return (
      <p role="alert">
        Your business details couldn’t be loaded. Please refresh the page.
      </p>
    );
  return (
    <PoliciesEditor
      key={business.id}
      business={business}
      updateBusinessLocally={updateBusinessLocally}
    />
  );
}

function PoliciesEditor({
  business,
  updateBusinessLocally,
}: Pick<
  ReturnType<typeof useBusinessProfile>,
  "business" | "updateBusinessLocally"
>) {
  const initialPolicies = {
    bookingPolicy: business.profileSettings?.policies?.bookingPolicy || "",
    cancellationPolicy:
      business.profileSettings?.policies?.cancellationPolicy || "",
    paymentPolicy: business.profileSettings?.policies?.paymentPolicy || "",
  };
  const initialFaqs: Faq[] = Array.isArray(business.profileSettings?.faqs)
    ? business.profileSettings.faqs.map((faq: Faq) => ({
        question: faq.question,
        answer: faq.answer,
      }))
    : [];
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"policies" | "questions">(
    "policies",
  );
  const [policies, setPolicies] = useState<Policies>(initialPolicies);
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [baseline, setBaseline] = useState(
    JSON.stringify({ policies: initialPolicies, faqs: initialFaqs }),
  );
  const [saveError, setSaveError] = useState("");
  const [faqError, setFaqError] = useState("");
  const [preview, setPreview] = useState(false);

  const dirty = !!baseline && baseline !== JSON.stringify({ policies, faqs });

  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const confirmNavigation = (event: Event) => {
      if (!window.confirm("You have unsaved changes. Leave without saving?"))
        event.preventDefault();
    };
    const linkClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a");
      if (
        link &&
        link.getAttribute("href") &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        link.target !== "_blank"
      ) {
        if (
          !window.confirm("You have unsaved changes. Leave without saving?")
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("vendor:before-navigate", confirmNavigation);
    document.addEventListener("click", linkClick, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("vendor:before-navigate", confirmNavigation);
      document.removeEventListener("click", linkClick, true);
    };
  }, [dirty]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (faqs.some((faq) => !!faq.question.trim() !== !!faq.answer.trim())) {
      setFaqError(
        "Add both a question and an answer, or remove the unfinished question.",
      );
      setActiveTab("questions");
      return;
    }
    setFaqError("");
    setSaveError("");
    setSaving(true);
    const cleanedFaqs = faqs
      .filter((faq) => faq.question.trim() && faq.answer.trim())
      .map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      }));
    const cleanPolicies = {
      bookingPolicy: policies.bookingPolicy.trim(),
      cancellationPolicy: policies.cancellationPolicy.trim(),
      paymentPolicy: policies.paymentPolicy.trim(),
    };
    const profileSettings = {
      ...business.profileSettings,
      policies: { ...business.profileSettings?.policies, ...cleanPolicies },
      faqs: cleanedFaqs,
    };
    try {
      await api.patch("/vendor/business", {
        profileSettings: {
          policies: profileSettings.policies,
          faqs: cleanedFaqs,
        },
      });
      updateBusinessLocally({ profileSettings });
      setPolicies(cleanPolicies);
      setFaqs(cleanedFaqs);
      setBaseline(
        JSON.stringify({ policies: cleanPolicies, faqs: cleanedFaqs }),
      );
      setSaved(true);
      toast.success("Your policies and questions are saved.");
    } catch {
      setSaveError(
        "Your changes weren’t saved. Please try again. Your edits are still here.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={save} className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#98722e]">
            Build confidence before the first conversation
          </p>
          <h1 className="text-2xl font-semibold text-[#183e38]">
            Policies & common questions
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            Help customers understand how you work. Keep it friendly, clear and
            true to your business.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={preview}
          onClick={() => setPreview(!preview)}
          className="business-subtle-button"
        >
          <Eye className="h-4 w-4" />
          {preview ? "Hide preview" : "Customer preview"}
        </button>
      </header>
      <div
        className="flex flex-wrap gap-2 border-b border-[#e7ece4] pb-3"
        aria-label="Policy editor views"
      >
        {[
          {
            key: "policies" as const,
            label: "Booking & payment",
            icon: Wallet,
          },
          {
            key: "questions" as const,
            label: `Common questions (${faqs.length})`,
            icon: MessageCircle,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            aria-pressed={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`business-editor-tab ${activeTab === tab.key ? "business-editor-tab-active" : ""}`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className={`grid items-start gap-6 ${preview ? "xl:grid-cols-[minmax(0,1fr)_280px]" : ""}`}
      >
        <fieldset disabled={saving} className="min-w-0 space-y-4">
          <legend className="sr-only">
            {activeTab === "policies"
              ? "Business policies"
              : "Common customer questions"}
          </legend>
          {activeTab === "policies" ? (
            <>
              <div className="flex gap-3 rounded-xl bg-[#f7f4eb] p-4 text-xs leading-relaxed text-[#79683d]">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Use your own terms. We won’t fill in deposit amounts, refund
                  promises or payment deadlines for you.
                </p>
              </div>
              {policyFields.map((field, index) => (
                <section key={field.key} className="business-policy-card">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="business-section-icon">
                      <field.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <label
                        htmlFor={field.key}
                        className="block text-sm font-semibold text-[#183e38]"
                      >
                        {index + 1}. {field.title}
                      </label>
                      <p
                        id={`${field.key}-help`}
                        className="mt-1 text-xs leading-relaxed text-slate-500"
                      >
                        {field.hint}
                      </p>
                    </div>
                    <span className="ml-auto hidden text-[10px] text-slate-400 sm:block">
                      {policies[field.key].trim() ? "Added" : "Not added"}
                    </span>
                  </div>
                  <textarea
                    id={field.key}
                    aria-label={field.label}
                    aria-describedby={`${field.key}-help`}
                    rows={3}
                    value={policies[field.key]}
                    onChange={(event) =>
                      setPolicies((previous) => ({
                        ...previous,
                        [field.key]: event.target.value,
                      }))
                    }
                    placeholder={field.prompt}
                    className="business-policy-input"
                  />
                </section>
              ))}
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-[#183e38]">
                    Answer once. Help every customer.
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Add questions you hear often. This section is optional.
                  </p>
                </div>
                <button
                  type="button"
                  className="business-subtle-button"
                  onClick={() =>
                    setFaqs((previous) => [
                      ...previous,
                      { question: "", answer: "" },
                    ])
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add question
                </button>
              </div>
              {faqError && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {faqError}
                </p>
              )}
              {!faqs.length && (
                <div className="rounded-2xl border border-dashed border-[#d8e2d2] bg-[#f8faf5] p-8 text-center">
                  <MessageCircle className="mx-auto mb-3 h-7 w-7 text-[#7f9872]" />
                  <h3 className="text-sm font-semibold text-[#36564c]">
                    What do customers usually ask you?
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                    For example: areas you serve, what is included, or how far
                    ahead to book.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFaqs([{ question: "", answer: "" }])}
                    className="mt-4 text-sm font-semibold text-[#36564c] underline underline-offset-4"
                  >
                    Add your first question
                  </button>
                </div>
              )}
              {faqs.map((faq, index) => (
                <section key={index} className="business-policy-card">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#36564c]">
                      Question {index + 1}
                    </h3>
                    <button
                      type="button"
                      aria-label={`Remove question ${index + 1}`}
                      onClick={() => {
                        if (
                          (!faq.question && !faq.answer) ||
                          window.confirm(
                            "Remove this question? Save changes to update your page.",
                          )
                        )
                          setFaqs((previous) =>
                            previous.filter((_, i) => i !== index),
                          );
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                  <label
                    htmlFor={`question-${index}`}
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Customer question
                  </label>
                  <input
                    id={`question-${index}`}
                    value={faq.question}
                    onChange={(event) =>
                      setFaqs((previous) =>
                        previous.map((item, i) =>
                          i === index
                            ? { ...item, question: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="e.g. Which areas do you serve?"
                    className="business-policy-input"
                  />
                  <label
                    htmlFor={`answer-${index}`}
                    className="mb-2 mt-4 block text-xs font-medium text-slate-600"
                  >
                    Your answer
                  </label>
                  <textarea
                    id={`answer-${index}`}
                    rows={3}
                    value={faq.answer}
                    onChange={(event) =>
                      setFaqs((previous) =>
                        previous.map((item, i) =>
                          i === index
                            ? { ...item, answer: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="Write a helpful answer in your own words."
                    className="business-policy-input"
                  />
                </section>
              ))}
            </>
          )}
        </fieldset>
        {preview && (
          <aside className="rounded-2xl border border-[#e1e7dc] bg-[#f8faf5] p-5">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#36564c]">
              <Eye className="h-4 w-4" />
              Customer preview
            </p>
            <p className="mb-5 text-[11px] text-slate-500">
              A text preview of your current edits. Save to update your business
              page.
            </p>
            {policyFields
              .filter((field) => policies[field.key].trim())
              .map((field) => (
                <div key={field.key} className="mb-5">
                  <h3 className="text-xs font-semibold text-[#183e38]">
                    {field.label}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-600">
                    {policies[field.key]}
                  </p>
                </div>
              ))}
            {faqs
              .filter((faq) => faq.question.trim() && faq.answer.trim())
              .map((faq, i) => (
                <div key={i} className="mb-5">
                  <h3 className="break-words text-xs font-semibold text-[#183e38]">
                    {faq.question}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            {!Object.values(policies).some((value) => value.trim()) &&
              !faqs.some((faq) => faq.question.trim() && faq.answer.trim()) && (
                <p className="text-xs text-slate-500">
                  Your text will appear here as you write.
                </p>
              )}
          </aside>
        )}
      </div>
      <div className="business-save-bar">
        <div role="status" aria-live="polite">
          <p className="flex items-center gap-2 text-xs font-semibold text-[#36564c]">
            {!dirty && <Check className="h-4 w-4" />}
            {saving
              ? "Saving your changes…"
              : dirty
                ? "You have unsaved changes"
                : saved
                  ? "All changes saved"
                  : "Your saved details"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {business.status === "ACTIVE"
              ? "Saved changes will appear on your public page."
              : "Save now. Your page stays hidden until you publish."}
          </p>
          {saveError && (
            <p role="alert" className="mt-2 text-xs text-red-700">
              {saveError}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={saving || !dirty}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#183e38] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
