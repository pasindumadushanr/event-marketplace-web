'use client';

import { useState } from 'react';
import { Review } from '@/types/business-profile';
import { Star, MessageCircleReply, PenLine, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';

interface BusinessReviewsProps {
  businessId?: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function BusinessReviews({ businessId, reviews: initialReviews, rating: initialRating, reviewCount: initialCount }: BusinessReviewsProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [rating, setRating] = useState(initialRating || 0);
  const [reviewCount, setReviewCount] = useState(initialCount || 0);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to write a review');
      router.push('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) {
      toast.error('Unable to submit review: missing business ID');
      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      toast.error('Please select a star rating between 1 and 5');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        businessId,
        rating: selectedRating,
        comment: comment.trim(),
      });

      const newReview: Review = {
        id: res.data.id,
        customerName: `${user?.firstName || 'Anonymous'} ${user?.lastName || ''}`.trim(),
        customerImage: user?.profileImage || undefined,
        rating: selectedRating,
        comment: comment.trim(),
        date: 'Just now',
      };

      const updated = [newReview, ...reviews];
      setReviews(updated);
      const newCount = reviewCount + 1;
      setReviewCount(newCount);
      const totalScore = (rating * reviewCount) + selectedRating;
      setRating(Number((totalScore / newCount).toFixed(1)));

      toast.success('Thank you! Your review has been published.');
      setIsModalOpen(false);
      setComment('');
      setSelectedRating(5);
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = ['Select rating', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary fill-primary" /> 
          Reviews & Ratings
        </h3>
        {businessId && (
          <Button
            onClick={handleOpenModal}
            className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-sm self-start sm:self-auto flex items-center gap-2"
          >
            <PenLine className="h-4 w-4" /> Write a Review
          </Button>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl p-6">
          <Star className="h-12 w-12 text-slate-200 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-900 mb-1">No Reviews Yet</h4>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">
            Be the first to review this business and share your experience with other event planners!
          </p>
          {businessId && (
            <Button
              onClick={handleOpenModal}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 font-bold rounded-xl"
            >
              Write the First Review
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Overall Score */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="text-center sm:text-left shrink-0">
              <p className="text-5xl font-extrabold text-slate-900">{rating.toFixed(1)}</p>
              <div className="flex gap-1 justify-center sm:justify-start my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-primary fill-primary' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">Based on {reviewCount} verified reviews</p>
            </div>
            
            <div className="flex-1 flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((score) => {
                const countForScore = reviews.filter(r => Math.round(r.rating) === score).length;
                const pct = reviewCount > 0 ? (countForScore / reviewCount) * 100 : 0;
                return (
                  <div key={score} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                    <span className="w-3">{score}</span>
                    <Star className="h-3 w-3 text-slate-400" />
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-400">{countForScore}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      {review.customerImage ? (
                        <img src={review.customerImage} alt={review.customerName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold bg-slate-100">
                          {review.customerName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm sm:text-base">{review.customerName}</p>
                      <p className="text-xs text-slate-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= review.rating ? 'text-primary fill-primary' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-slate-700 leading-relaxed text-sm">{review.comment}</p>
                
                {review.vendorReply && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 ml-4 md:ml-12 relative">
                    <div className="absolute -left-3 top-4 text-slate-300">
                      <MessageCircleReply className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Vendor Reply</p>
                    <p className="text-sm text-slate-700">{review.vendorReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => !isSubmitting && setIsModalOpen(false)} 
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Write a Review</h4>
                <p className="text-xs text-slate-500 mt-0.5">Share your feedback about this vendor</p>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200/60 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
              {/* Star Picker */}
              <div className="text-center py-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Your Overall Rating
                </label>
                <div className="flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || selectedRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star 
                          className={`h-8 w-8 transition-colors ${
                            isFilled ? 'text-primary fill-primary' : 'text-slate-200'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm font-semibold text-primary mt-2">
                  {ratingLabels[hoverRating || selectedRating]}
                </p>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Your Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like most? How was their communication, punctuality, and service quality?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-xl font-bold border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Review'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
