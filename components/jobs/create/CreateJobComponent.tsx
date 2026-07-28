'use client'

import { SessionType, JobCategory } from '@/utils/types';
import GlobalNavbar from '@/components/GlobalNavbar';
import { fetchCategories, getUserSession } from "@/utils/reuseableCode"
import { getCategories, createJob } from '@/utils/APIRoutes'
import axios from 'axios';
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DESC_MAX = 500;

export default function CreateJobComponent() {
    const router = useRouter();
    const [session, setSession] = useState<SessionType>()
    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>('')
    const [category, setCategory] = useState<string>()
    const [jobCategories, setJobCategories] = useState<JobCategory[]>()
    const [price, setPrice] = useState<number>()
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    function handleThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    }

    async function handleCreateJobSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData()
        formData.append('freeLancerID', session?._id || '')
        formData.append('title', title || '')
        formData.append('description', description || '')
        formData.append('price', String(price || ''))
        formData.append('category', category || '')
        formData.append('thumbnail', event.currentTarget?.thumbnail.files[0]);
        try {
            const response = await axios.post(createJob, formData)
            const data = response.data;
            if (data.error) { setMessage(data.error); }
            else if (data.message) { router.push('/jobs'); }
        } catch (error) {
            console.log(error);
            setMessage("Error creating job. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const userSession = getUserSession()
        setSession(userSession)
        fetchCategories(setJobCategories, getCategories)
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, []);

    const descLen = description.length;
    const descNearLimit = descLen > 450;

    return (
        <>
            <GlobalNavbar session={session} />
            <main className="min-h-screen bg-gray-50 py-12 px-6">
                <div className="max-w-2xl mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">Create a Job Listing</CardTitle>
                            <CardDescription>Fill in the details to post your service for clients to find.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {message.length > 0 && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertDescription>{message}</AlertDescription>
                                </Alert>
                            )}
                            <form id="job_form" onSubmit={handleCreateJobSubmit} encType="multipart/form-data" className="space-y-6">

                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <p className="text-xs text-muted-foreground">Use keywords buyers search for when looking for services like yours.</p>
                                    <Input id="title" type="text" name="title" onChange={(e) => setTitle(e.target.value)} required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <p className="text-xs text-muted-foreground">Describe your service clearly and highlight your unique skills.</p>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        maxLength={DESC_MAX}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows={5}
                                    />
                                    <p className={`text-xs text-right ${descNearLimit ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                                        {descLen}/{DESC_MAX}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <p className="text-xs text-muted-foreground">Choose the most suitable category for your listing.</p>
                                    <select
                                        id="category"
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        name="category"
                                        defaultValue=""
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {jobCategories?.map(cat => (
                                            <option value={cat.name} key={cat._id ?? cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (TTD)</Label>
                                    <p className="text-xs text-muted-foreground">Starting from $100 TTD.</p>
                                    <Input
                                        id="price"
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        min="0"
                                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thumbnail-input">Thumbnail</Label>
                                    {previewUrl && (
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 mb-2">
                                            <Image src={previewUrl} alt="Thumbnail preview" fill className="object-cover" unoptimized />
                                        </div>
                                    )}
                                    <Input
                                        id="thumbnail-input"
                                        type="file"
                                        name="thumbnail"
                                        accept="image/*"
                                        required
                                        className="cursor-pointer"
                                        onChange={handleThumbnailChange}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Creating...' : 'Create Job'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}
