'use client'

import { SessionType, JobsType } from '@/utils/types';
import { getUserSession } from '@/utils/reuseableCode';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import GlobalNavbar from '@/components/GlobalNavbar';
import {
  countCategories, countInvoices, countJobs, countJobsInCategory,
  countServices, countUsers, allUsersRoute, getAllJobs,
} from '@/utils/APIRoutes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Pagination from '@/components/ui/Pagination';

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;
const BATCH_SIZE = 100; // 5 pages per batch

// ─── Types ────────────────────────────────────────────────────────────────────
type UserRow = {
  _id: string;
  username: string;
  email: string;
  isStaff: boolean;
  isActive: boolean;
  dateJoined: string;
};

type CategoryBar = { _id: string; count: number };
type Tab = 'overview' | 'users' | 'jobs';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function batchSkip(page: number) {
  const batchIndex = Math.floor((page - 1) / (BATCH_SIZE / PAGE_SIZE));
  return batchIndex * BATCH_SIZE;
}

function itemsForPage<T>(batch: T[], page: number): T[] {
  const posInBatch = ((page - 1) % (BATCH_SIZE / PAGE_SIZE)) * PAGE_SIZE;
  return batch.slice(posInBatch, posInBatch + PAGE_SIZE);
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminComponent() {
  const router = useRouter();
  const [session, setSession] = useState<SessionType>();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Counts
  const [categoryCount, setCategoryCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [jobsByCategory, setJobsByCategory] = useState<CategoryBar[]>([]);

  // Users pagination
  const [userBatch, setUserBatch] = useState<UserRow[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPage, setUserPage] = useState(1);
  const [userBatchSkip, setUserBatchSkip] = useState(-1); // -1 = not loaded
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Jobs pagination
  const [jobBatch, setJobBatch] = useState<JobsType[]>([]);
  const [jobTotal, setJobTotal] = useState(0);
  const [jobPage, setJobPage] = useState(1);
  const [jobBatchSkip, setJobBatchSkip] = useState(-1);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const s = getUserSession();
    if (!s) { router.push('/auth/login'); return; }
    if (!s.isStaff) { router.push('/jobs'); return; }
    setSession(s);
  }, []);

  // ── Fetch overview counts ───────────────────────────────────────────────────
  useEffect(() => {
    async function fetchCounts() {
      const [cat, job, user, svc, inv, catJobs] = await Promise.allSettled([
        axios.get(countCategories),
        axios.get(countJobs),
        axios.get(countUsers),
        axios.get(countServices),
        axios.get(countInvoices),
        axios.get(countJobsInCategory),
      ]);
      if (cat.status === 'fulfilled') setCategoryCount(cat.value.data.count ?? 0);
      if (job.status === 'fulfilled') setJobCount(job.value.data.count ?? 0);
      if (user.status === 'fulfilled') setUserCount(user.value.data.count ?? 0);
      if (svc.status === 'fulfilled') setServiceCount(svc.value.data.count ?? 0);
      if (inv.status === 'fulfilled') setInvoiceCount(inv.value.data.count ?? 0);
      if (catJobs.status === 'fulfilled') setJobsByCategory(catJobs.value.data ?? []);
    }
    fetchCounts();
  }, []);

  // ── Fetch user batch when page or tab changes ───────────────────────────────
  useEffect(() => {
    if (activeTab !== 'users') return;
    const needed = batchSkip(userPage);
    if (needed === userBatchSkip) return; // already loaded this batch
    setLoadingUsers(true);
    axios.get(`${allUsersRoute}?skip=${needed}&limit=${BATCH_SIZE}`)
      .then(res => {
        setUserBatch(res.data.users ?? []);
        setUserTotal(res.data.total ?? 0);
        setUserBatchSkip(needed);
      })
      .catch(console.error)
      .finally(() => setLoadingUsers(false));
  }, [activeTab, userPage]);

  // ── Fetch job batch when page or tab changes ────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'jobs') return;
    const needed = batchSkip(jobPage);
    if (needed === jobBatchSkip) return;
    setLoadingJobs(true);
    axios.get(`${getAllJobs}?skip=${needed}&limit=${BATCH_SIZE}`)
      .then(res => {
        setJobBatch(res.data.reversedJobList ?? []);
        setJobTotal(res.data.total ?? 0);
        setJobBatchSkip(needed);
      })
      .catch(console.error)
      .finally(() => setLoadingJobs(false));
  }, [activeTab, jobPage]);

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const maxCatCount = Math.max(...jobsByCategory.map(item => item.count), 1);
  const userTotalPages = Math.ceil(userTotal / PAGE_SIZE);
  const jobTotalPages = Math.ceil(jobTotal / PAGE_SIZE);

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'overview', label: 'Overview', icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
      ),
    },
    {
      key: 'users', label: 'Users', icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      ),
    },
    {
      key: 'jobs', label: 'Jobs', icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
    },
  ];

  return (
    <>
      <GlobalNavbar session={session} />

      <div className="min-h-screen bg-gray-50 flex">

        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 bg-gray-900 min-h-screen pt-8 px-3 hidden md:block">
          <div className="mb-8 px-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Admin Panel</p>
            <p className="text-white font-semibold text-sm truncate">{session.username}</p>
            <Badge className="mt-1 bg-[#fd8700] text-white text-[10px] px-1.5 py-0 border-0">Staff</Badge>
          </div>
          <nav className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === tab.key
                  ? 'bg-[#fd8700] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <Separator className="my-6 bg-gray-700" />
          <div className="space-y-3 px-3">
            {[
              { label: 'Users', value: userCount },
              { label: 'Jobs', value: jobCount },
              { label: 'Categories', value: categoryCount },
              { label: 'Invoices', value: invoiceCount },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{item.label}</span>
                <span className="text-xs font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">

          {/* Mobile tab bar */}
          <div className="flex gap-2 mb-6 md:hidden overflow-x-auto pb-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 ${activeTab === tab.key ? 'bg-[#fd8700] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">Platform overview at a glance.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard label="Users" value={userCount} color="bg-blue-100" icon={
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                } />
                <StatCard label="Jobs" value={jobCount} color="bg-orange-100" icon={
                  <svg className="w-6 h-6 text-[#fd8700]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                } />
                <StatCard label="Categories" value={categoryCount} color="bg-purple-100" icon={
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                } />
                <StatCard label="Services" value={serviceCount} color="bg-green-100" icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                } />
                <StatCard label="Invoices" value={invoiceCount} color="bg-yellow-100" icon={
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                } />
              </div>

              {jobsByCategory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Jobs by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...jobsByCategory].sort((aItem, bItem) => bItem.count - aItem.count).map(item => (
                        <div key={item._id} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-36 truncate flex-shrink-0">{item._id}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div className="h-3 rounded-full bg-[#fd8700] transition-all duration-500" style={{ width: `${Math.round((item.count / maxCatCount) * 100)}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-6 text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle className="text-base">Platform Health</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: 'Avg jobs per user', value: userCount > 0 ? (jobCount / userCount).toFixed(1) : '—', sub: 'jobs / user' },
                      { label: 'Jobs per category', value: categoryCount > 0 ? (jobCount / categoryCount).toFixed(1) : '—', sub: 'avg' },
                      { label: 'Invoice rate', value: jobCount > 0 ? `${Math.round((invoiceCount / jobCount) * 100)}%` : '—', sub: 'jobs with invoices' },
                    ].map(item => (
                      <div key={item.label} className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                        <p className="text-[10px] text-gray-400">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="text-muted-foreground text-sm mt-1">{userTotal} registered account{userTotal !== 1 ? 's' : ''}</p>
              </div>

              <Card>
                <CardContent className="p-0">
                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left">
                              <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">User</th>
                              <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Email</th>
                              <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Joined</th>
                              <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {itemsForPage(userBatch, userPage).map(user => (
                              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                                      {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-900">{user.username}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5 text-muted-foreground">{user.email}</td>
                                <td className="px-5 py-3.5 text-muted-foreground">
                                  {user.dateJoined ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(user.dateJoined)) : '—'}
                                </td>
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {user.isStaff && (
                                      <span className="text-[10px] bg-[#fd8700] text-white px-1.5 py-0.5 rounded-full font-semibold">Staff</span>
                                    )}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                      {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {userBatch.length === 0 && (
                          <p className="text-center py-12 text-muted-foreground text-sm">No users found.</p>
                        )}
                      </div>

                      <Pagination
                        currentPage={userPage}
                        totalPages={userTotalPages}
                        onPageChange={setUserPage}
                        pageSize={PAGE_SIZE}
                        totalItems={userTotal}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── JOBS ── */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
                <p className="text-muted-foreground text-sm mt-1">{jobTotal} total listing{jobTotal !== 1 ? 's' : ''}</p>
              </div>

              <Card>
                <CardContent className="p-0">
                  {loadingJobs ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left">
                              <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Title</th>
                              <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Freelancer</th>
                              <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                              <th className="px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {itemsForPage(jobBatch, jobPage).map(job => (
                              <tr
                                key={job._id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
                              >
                                <td className="px-5 py-3.5">
                                  <span className="font-medium text-gray-900 line-clamp-1 max-w-xs block">{job.title}</span>
                                </td>
                                <td className="px-5 py-3.5 text-muted-foreground">{job.username || '—'}</td>
                                <td className="px-5 py-3.5">
                                  <Badge variant="secondary" className="text-xs">{job.category}</Badge>
                                </td>
                                <td className="px-5 py-3.5 font-semibold text-gray-900">${job.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {jobBatch.length === 0 && (
                          <p className="text-center py-12 text-muted-foreground text-sm">No jobs found.</p>
                        )}
                      </div>

                      <Pagination
                        currentPage={jobPage}
                        totalPages={jobTotalPages}
                        onPageChange={setJobPage}
                        pageSize={PAGE_SIZE}
                        totalItems={jobTotal}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
