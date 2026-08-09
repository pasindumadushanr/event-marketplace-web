'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Star, MessageCircle, Reply, User, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/vendor/reviews');
      setReviews(res.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;
    try {
      await api.patch(`/vendor/reviews/${reviewId}/reply`, { reply: replyText });
      toast.success('Reply posted successfully!');
      setReplyingTo(null);
      setReplyText('');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
      />
    ));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Customer Reviews</h2>
        <p className="text-muted-foreground mt-1 text-slate-500">
          Monitor your feedback and reply to your customers.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No reviews yet</h3>
          <p className="text-slate-500 mt-1">When customers complete a booking and leave a review, it will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                    {review.customer.profileImage ? (
                      <img src={review.customer.profileImage} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{review.customer.firstName} {review.customer.lastName}</h4>
                    <p className="text-xs text-slate-500">{format(new Date(review.createdAt), 'MMMM do, yyyy')}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4">
                <p className="text-slate-700">{review.comment || 'No comment provided.'}</p>
              </div>

              {review.reply ? (
                <div className="ml-8 border-l-2 border-primary/30 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Reply className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-slate-900">Your Reply</span>
                  </div>
                  <p className="text-slate-600 text-sm">{review.reply}</p>
                </div>
              ) : replyingTo === review.id ? (
                <div className="ml-8 space-y-3 mt-4">
                  <Textarea 
                    placeholder="Write your reply to the customer..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                    <Button size="sm" onClick={() => handleReplySubmit(review.id)} disabled={!replyText.trim()}>Post Reply</Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-8 text-primary border-primary/20 hover:bg-primary/5"
                  onClick={() => {
                    setReplyingTo(review.id);
                    setReplyText('');
                  }}
                >
                  <Reply className="h-4 w-4 mr-2" /> Reply to Customer
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
