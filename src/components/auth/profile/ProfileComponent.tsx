'use client';

import { Profile, SessionType } from '@/utils/types';
import { getUserSession } from '@/utils/reuseableCode';
import { updateUser, getUserProfile, updateProfile } from '@/utils/APIRoutes';
import GlobalNavbar from '@/components/GlobalNavbar';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react'
import { usePathname } from 'next/navigation';
import GlobalFooter from '@/components/GlobalFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfileComponent() {
    const router = useRouter();
    const pathname = usePathname();
    const [session, setSession] = useState<SessionType>();
    const [userProfile, setUserProfile] = useState<Profile>();
    const [userBio, setBio] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);
    const [values, setValues] = useState({ username: "", email: "", password: "", confirmPassword: "" });

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.currentTarget.name]: event.currentTarget.value });
    };

    const handleValidation = () => {
        const { password, confirmPassword } = values;
        if (password || confirmPassword) {
            if (password !== confirmPassword) { setMessage("Passwords do not match."); return false; }
            if (password.length < 8) { setMessage("Password must be at least 8 characters."); return false; }
        }
        return true;
    };

    async function handleLogOut() {
        sessionStorage.removeItem('user')
        if (pathname !== '/jobs') router.push("/jobs")
        else window.location.href = 'jobs'
    }

    async function profile() {
        try {
            const response = await axios.get(`${getUserProfile}/${session?._id}`, { withCredentials: true });
            setUserProfile(response.data.user_profile);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) router.push('/auth/login');
                else if (error.response?.status !== 404) setMessage('Failed to load profile. Please refresh.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleProfileUploadFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('userID', session?._id || '');
        formData.append('bio', userBio || '');
        formData.append('profile_picture', event.currentTarget.profilepicture.files[0]);
        try {
            const response = await axios.put(updateProfile, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            const data = response.data
            if (response.status !== 200) { setMessage(data.error); return; }
            setMessage(data.message);
            const imageResponse = await axios.get(response.data.signedUrl, { responseType: 'blob' });
            const imageUrl = URL.createObjectURL(imageResponse.data);
            setUserProfile(prev => ({ ...prev, userID: prev?.userID || '', bio: userProfile?.bio, profilePicture: imageUrl, creditCard: userProfile?.creditCard }));
        } catch (error) {
            console.log(error);
        }
    }

    async function handleUpdateUserSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!handleValidation()) return;
        try {
            const { email, username, password } = values;
            const response = await axios.post(updateUser, { userID: session?._id, username, email, password })
            const data = response.data
            if (response.status !== 200) { setMessage(data.error); return; }
            setMessage('Changes saved. You will be logged out shortly.')
            setTimeout(() => { handleLogOut().then(() => router.push('/auth/login')) }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const isAuthenticated = getUserSession()
        if (!isAuthenticated) { router.push('/auth/login'); return; }
        setSession(isAuthenticated);
    }, []);

    useEffect(() => {
        if (session?._id) profile();
    }, [session])

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col flex-1">
            {session?._id && (
                <>
                    <GlobalNavbar session={session} />

                    <main className="min-h-screen bg-gray-50 py-12 px-6">
                        <div className="max-w-5xl mx-auto">
                            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

                            {message && (
                                <Alert variant={message.toLowerCase().includes('error') || message.toLowerCase().includes('match') || message.toLowerCase().includes('incorrect') ? 'destructive' : 'default'} className="mb-6">
                                    <AlertDescription>{message}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Left: Avatar & Bio */}
                                <div className="space-y-6">
                                    <Card className="shadow-sm">
                                        <CardContent className="pt-6 flex flex-col items-center text-center">
                                            <Avatar className="w-24 h-24 mb-4">
                                                <AvatarImage src={userProfile?.profilePicture ?? '/images/default.png'} alt="Profile picture" />
                                                <AvatarFallback>{session.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex items-center gap-2 justify-center flex-wrap">
                                                <p className="font-semibold text-gray-900 text-lg">{session.username}</p>
                                                {session.isStaff && (
                                                    <span className="text-xs bg-[#fd8700] text-white px-2 py-0.5 rounded-full font-medium">Staff</span>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground text-sm mt-0.5">{session.email}</p>
                                            {session.dateJoined && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Member since {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(new Date(session.dateJoined))}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-base">Update Avatar & Bio</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleProfileUploadFormSubmit} encType="multipart/form-data" className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="image-input">Profile Picture</Label>
                                                    <Input id="image-input" type="file" name="profilepicture" accept="image/*" className="cursor-pointer" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="bio">Bio</Label>
                                                    <Textarea
                                                        id="bio"
                                                        name="bio"
                                                        rows={3}
                                                        placeholder={userProfile?.bio && userProfile.bio !== 'undefined' ? userProfile.bio : 'Tell us about yourself'}
                                                        onChange={(e) => setBio(e.target.value)}
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full">Save Changes</Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right: Account Settings */}
                                <div className="lg:col-span-2">
                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <CardTitle>Account Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleUpdateUserSubmit} className="space-y-5">
                                                <div className="space-y-2">
                                                    <Label htmlFor="username">Username</Label>
                                                    <Input id="username" type="text" name="username" placeholder={session.username} onChange={handleChange} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input id="email" type="email" name="email" placeholder={session.email} onChange={handleChange} />
                                                </div>
                                                <Separator />
                                                <p className="text-xs text-muted-foreground">Leave password fields blank to keep your current password.</p>
                                                <div className="space-y-2">
                                                    <Label htmlFor="password">New Password</Label>
                                                    <Input id="password" type="password" name="password" placeholder="••••••••" onChange={handleChange} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                    <Input id="confirmPassword" type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} />
                                                </div>
                                                <Button type="submit" className="w-full">Update Information</Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>

                            </div>
                        </div>
                    </main>

                    <GlobalFooter />
                </>
            )}
        </div>
    )
}
