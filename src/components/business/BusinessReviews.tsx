'use client';

import { Review } from '@/types/business-profile';
import { Star, MessageCircleReply } from 'lucide-react';

interface BusinessReviewsProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function BusinessReviews({ reviews, rating, reviewCount }: BusinessReviewsProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Star className="h-5 w-5 text-primary fill-primary" /> 
        Reviews & Ratings
      </h3>
      
      {/* Overall Score */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
        <div className="text-center shrink-0">
          <p className="text-5xl font-extrabold text-slate-900">{rating.toFixed(1)}</p>
          <div className="flex gap-1 justify-center my-2">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className={`h-4 w-4 ${star <= Math.round(rating) ? 'text-primary fill-primary' : 'text-slate-200'}`} />
            ))}
          </div>
          <p className="text-sm text-slate-500 font-medium">Based on {reviewCount} reviews</p>
        </div>
        
        {/* Placeholder for progress bars. A real implementation would calculate these from the reviews array */}
        <div className="flex-1 hidden sm:flex flex-col gap-2">
          {[5,4,3,2,1].map((score) => (
            <div key={score} className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <span className="w-3">{score}</span>
              <Star className="h-3 w-3 text-slate-400" />
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: score === 5 ? '80%' : score === 4 ? '15%' : '0%' }} />
              </div>
            </div>
          ))}
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
                  <p className="font-bold text-slate-900">{review.customerName}</p>
                  <p className="text-xs text-slate-500">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-primary fill-primary' : 'text-slate-200'}`} />
                ))}
              </div>
            </div>
            
            <p className="text-slate-700 leading-relaxed text-sm md:text-base">{review.comment}</p>
            
            {review.vendorReply && (
              <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 ml-4 md:ml-12 relative">
                <div className="absolute -left-3 top-4 text-slate-300">
                  <MessageCircleReply className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Vendor Reply</p>
                <p className="text-sm text-slate-700">{review.vendorReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
