'use client'
import { reportJob } from '@/utils/APIRoutes'
import axios from 'axios';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ReportInfo = {
  _id: string;
  jobTitle: string;
  userID: string;
  freeLancerID: string;
};

type Props = {
  showForm: boolean;
  setReportForm: Dispatch<SetStateAction<boolean>>;
  jobInfo: unknown[];
};

const REASONS = [
  'Non Original Content',
  'Inappropriate Gig',
  'Trademark Violations',
  'Copyright Violations',
];

export default function ReportForm({ showForm, setReportForm, jobInfo }: Props) {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const info = (jobInfo?.[0] as ReportInfo) ?? null;

  function handleClose() {
    setReportForm(false);
    setStatus(null);
    setReason('');
    setCategory('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category) { setStatus({ type: 'error', msg: 'Please select a report reason.' }); return; }
    setLoading(true);
    setStatus(null);
    try {
      const response = await axios.post(reportJob, {
        job_id: info?._id,
        jobTitle: info?.jobTitle,
        user_id: info?.userID,
        freelancer_id: info?.freeLancerID,
        reason,
        reportCategory: category,
      });
      const data = response.data;
      if (data.error) { setStatus({ type: 'error', msg: data.error }); return; }
      setStatus({ type: 'success', msg: 'Report submitted. Thank you for keeping the platform safe.' });
    } catch {
      setStatus({ type: 'error', msg: 'Failed to submit report. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={showForm} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report this job</DialogTitle>
          <DialogDescription>
            Your report is anonymous. We review all reports within 48 hours.
          </DialogDescription>
        </DialogHeader>

        {status?.type === 'success' ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-700">{status.msg}</p>
            <Button onClick={handleClose} variant="outline" className="mt-2">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Reason for report</Label>
              <div className="space-y-2">
                {REASONS.map(label => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${category === label ? 'border-[#fd8700] bg-[#fd8700]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                      {category === label && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <input type="radio" name="reportReason" value={label} className="sr-only" onChange={() => setCategory(label)} />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-reason">Additional details <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                id="report-reason"
                value={reason}
                onChange={event => setReason(event.target.value)}
                placeholder="Describe the issue in more detail..."
                rows={3}
                className="resize-none"
              />
            </div>

            {status?.type === 'error' && (
              <p className="text-sm text-red-500">{status.msg}</p>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                {loading ? 'Submitting…' : 'Submit Report'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
