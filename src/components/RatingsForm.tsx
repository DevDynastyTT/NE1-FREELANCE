'use client'
import axios from "axios";
import { useState, FormEvent } from "react";
import { rateFreelancer, updateRatings } from "@/utils/APIRoutes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  formType: string;
  jobID: string;
  clientID: string;
  freeLancerID: string;
};

function StarPicker({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none transition-transform hover:scale-110"
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill={filled ? '#fd8700' : 'none'}
              stroke={filled ? '#fd8700' : '#d1d5db'}
              strokeWidth="1.5"
              className="transition-colors duration-100"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

export default function RatingForm({ formType, jobID, clientID, freeLancerID }: Props) {
  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const isUpdate = formType === 'update';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stars === 0) { setStatus({ type: 'error', msg: 'Please select a star rating.' }); return; }
    setLoading(true);
    setStatus(null);
    const endpoint = isUpdate ? updateRatings : rateFreelancer;
    try {
      const response = await axios.post(endpoint, {
        jobID,
        freeLancerID,
        userID: clientID,
        ratings: stars,
        feedback,
      });
      const data = response.data;
      if (data.error) { setStatus({ type: 'error', msg: data.error }); return; }
      setStatus({ type: 'success', msg: isUpdate ? 'Review updated!' : 'Review submitted — thank you!' });
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setStatus({ type: 'error', msg: 'Failed to submit review. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{isUpdate ? 'Update your review' : 'Leave a review'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">How would you rate this service?</p>
            <StarPicker value={stars} onChange={setStars} />
          </div>

          <Textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Share your experience with this freelancer..."
            rows={3}
            className="resize-none"
          />

          {status && (
            <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {status.msg}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting…' : isUpdate ? 'Update Review' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
