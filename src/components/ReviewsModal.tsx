import React, { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquare } from 'lucide-react';
import { Product, UserReview } from '../types';
import { formatReviewTimestamp } from '../utils/reviews';

interface ReviewsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddReview: (productId: string, review: UserReview) => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  product,
  onClose,
  onAddReview
}) => {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  if (!product) return null;

  const reviews = product.userReviews || product.reviews || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const now = Date.now();
    const newReview: UserReview = {
      id: now.toString(),
      author: authorName.trim() || 'Verified Parent',
      rating,
      timestamp: now,
      createdAt: new Date(now).toISOString(),
      date: new Date(now).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      comment: comment.trim(),
      verifiedPurchase: true
    };

    onAddReview(product.id, newReview);
    setComment('');
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Verified Parent &amp; Educator Reviews</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {product.title}
            </h3>

            {/* Score summary */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {reviews.length > 0 ? (
                  <>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">{product.rating}</span>
                    <span className="text-xs text-slate-500">({reviews.length} reviews)</span>
                  </>
                ) : (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    ★ No reviews yet · Be the first!
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowForm(!showForm)}
                className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
              >
                {showForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>
          </div>

          {/* Review Submission Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">
                Share Your Experience:
              </h4>

              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          starVal <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Your Name &amp; Location:
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Jessica (California, US)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Your Feedback:
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How did your children enjoy the worksheets?"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition"
              >
                Submit Verified Review
              </button>
            </form>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Star className="w-8 h-8 text-amber-400 mx-auto fill-amber-400/30" />
              <div className="text-xs font-bold text-slate-700">No reviews yet for this listing</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Be the first parent, teacher, or customer to share feedback!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{rev.author}</div>
                    <span className="text-[11px] text-slate-400 font-medium">{formatReviewTimestamp(rev.timestamp || rev.createdAt || rev.date, rev.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
