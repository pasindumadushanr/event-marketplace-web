"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { PublicFaq } from "@/lib/public-faqs";

interface AdminFaq extends PublicFaq {
  isActive: boolean;
}

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "GENERAL",
    isActive: true,
    sortOrder: "0",
  });

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const res = await api.get("/admin/cms/faqs");
      setFaqs(res.data);
    } catch {
      setLoadError(true);
      toast.error("Failed to fetch FAQs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchFaqs);
  }, [fetchFaqs]);

  const openModal = (faq: AdminFaq | null = null) => {
    if (faq) {
      setEditingId(faq.id);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        isActive: faq.isActive,
        sortOrder: String(faq.sortOrder),
      });
    } else {
      setEditingId(null);
      setFormData({
        question: "",
        answer: "",
        category: "GENERAL",
        isActive: true,
        sortOrder: "0",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sortOrder = Number(formData.sortOrder || 0);
    if (!Number.isInteger(sortOrder) || Math.abs(sortOrder) > 100000) {
      toast.error(
        "Sort order must be a whole number between -100000 and 100000",
      );
      return;
    }
    const payload = { ...formData, sortOrder };
    setIsSubmitting(true);

    try {
      if (editingId) {
        await api.patch(`/admin/cms/faqs/${editingId}`, payload);
        toast.success("FAQ updated successfully");
      } else {
        await api.post("/admin/cms/faqs", payload);
        toast.success("FAQ created successfully");
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch {
      toast.error("Failed to save FAQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await api.delete(`/admin/cms/faqs/${id}`);
      toast.success("FAQ deleted");
      fetchFaqs();
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/cms/faqs/${id}`, { isActive: !currentStatus });
      fetchFaqs();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Manage FAQs</h2>
        <Button
          disabled={isLoading || loadError}
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Add New FAQ
        </Button>
      </div>
      <p className="text-sm text-slate-600">
        Active questions appear on the public FAQ page. Lower sort orders appear
        first. Hide a question to remove it from the public page.
      </p>
      {loadError && (
        <div role="alert" className="rounded-lg border p-4">
          <p>Questions could not be loaded. No changes have been made.</p>
          <Button variant="outline" onClick={fetchFaqs} className="mt-2">
            Retry
          </Button>
        </div>
      )}

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No FAQs found.
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="max-w-md">
                    <p className="font-medium text-slate-900 truncate">
                      {faq.question}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {faq.answer}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {faq.category}
                    </span>
                  </TableCell>
                  <TableCell>{faq.sortOrder}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        aria-label={`Show ${faq.question}`}
                        checked={faq.isActive}
                        onCheckedChange={() =>
                          toggleStatus(faq.id, faq.isActive)
                        }
                      />
                      <span className="text-sm">
                        {faq.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      aria-label={`Edit ${faq.question}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(faq)}
                    >
                      <Edit className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button
                      aria-label={`Delete ${faq.question}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="faq-question" className="text-sm font-medium">
                Question
              </label>
              <Input
                id="faq-question"
                required
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="faq-answer" className="text-sm font-medium">
                Answer
              </label>
              <Textarea
                id="faq-answer"
                required
                rows={4}
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
              />
            </div>
            <div className="flex justify-between gap-4">
              <div className="space-y-2 flex-1">
                <label htmlFor="faq-category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="faq-category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div className="space-y-2 flex-1">
                <label htmlFor="faq-sort" className="text-sm font-medium">
                  Sort Order
                </label>
                <Input
                  id="faq-sort"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <span className="text-sm font-medium">
                Active (Visible to users)
              </span>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
