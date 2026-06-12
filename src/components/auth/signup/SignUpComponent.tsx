'use client'

import { SessionType } from '@/utils/types';
import { signupRoute, checkAvailabilityRoute } from "@/utils/APIRoutes";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlobalNavbar from '@/components/GlobalNavbar';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { getUserSession } from '@/utils/reuseableCode';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ValuesType = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type AvailabilityState = 'idle' | 'checking' | 'available' | 'taken' | 'error';

function AvailabilityHint({ state, takenMsg }: { state: AvailabilityState; takenMsg: string }) {
    if (state === 'idle') return null;
    if (state === 'checking') return <p className="text-xs text-muted-foreground mt-1">Checking...</p>;
    if (state === 'available') return <p className="text-xs text-green-600 mt-1">✓ Available</p>;
    if (state === 'taken') return <p className="text-xs text-red-500 mt-1">✗ {takenMsg}</p>;
    return null;
}

export default function Signup() {
    const router = useRouter()
    const [message, setMessage] = useState<string>();
    const [session, setSession] = useState<SessionType>();
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState<ValuesType>({ username: "", email: "", password: "", confirmPassword: "" });

    const [usernameAvail, setUsernameAvail] = useState<AvailabilityState>('idle');
    const [emailAvail, setEmailAvail] = useState<AvailabilityState>('idle');

    const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const checkAvailability = async (type: 'username' | 'email', value: string) => {
        const setter = type === 'username' ? setUsernameAvail : setEmailAvail;
        if (!value || (type === 'username' && value.length < 3)) { setter('idle'); return; }
        setter('checking');
        try {
            const res = await axios.get(`${checkAvailabilityRoute}?type=${type}&value=${encodeURIComponent(value)}`);
            setter(res.data.available ? 'available' : 'taken');
        } catch {
            setter('error');
        }
    };

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setValues((prev) => ({ ...prev, [name]: value }));

        if (name === 'username') {
            if (usernameTimer.current) clearTimeout(usernameTimer.current);
            usernameTimer.current = setTimeout(() => checkAvailability('username', value), 500);
        }
        if (name === 'email') {
            if (emailTimer.current) clearTimeout(emailTimer.current);
            emailTimer.current = setTimeout(() => checkAvailability('email', value), 500);
        }
    };

    const handleValidation = () => {
        if (message) setMessage('');
        const { password, confirmPassword, username, email } = values;
        if (!username) { setMessage("Enter your username"); return false; }
        if (!email) { setMessage("Enter your email"); return false; }
        if (!password) { setMessage("Enter your password"); return false; }
        if (!confirmPassword) { setMessage("Please confirm your password"); return false; }
        if (confirmPassword !== password) { setMessage('Passwords must match'); return false; }
        if (username.length < 3) { setMessage("Username must be at least 3 characters."); return false; }
        if (password.length < 8) { setMessage("Password must be at least 8 characters."); return false; }
        if (usernameAvail === 'taken') { setMessage("That username is already taken."); return false; }
        if (emailAvail === 'taken') { setMessage("That email is already registered."); return false; }
        return true;
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!handleValidation()) return;
        setIsLoading(true);
        try {
            const { email, username, password } = values;
            const response = await axios.post(signupRoute, { username, email, password }, { withCredentials: true });
            const data = response.data;
            if (response.status !== 200) { setMessage(data.error); return; }
            sessionStorage.setItem('user', JSON.stringify(data.user));
            setSession(JSON.parse(sessionStorage.getItem('user')!));
            router.push('/jobs');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('NE1-Freelance is down for maintenance. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const isAuthenticated = getUserSession();
        if (isAuthenticated) { setSession(isAuthenticated); router.push('/jobs'); }
    }, [router]);

    return (
        <>
            <GlobalNavbar session={session} />
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>Join NE1 Freelance and start earning</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {message && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" type="text" name="username" value={values.username} placeholder="johndoe" onChange={handleChange} />
                                <AvailabilityHint state={usernameAvail} takenMsg="Username already taken" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" value={values.email} placeholder="example@example.com" onChange={handleChange} />
                                <AvailabilityHint state={emailAvail} takenMsg="Email already registered" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password1">Password</Label>
                                <Input id="password1" type="password" name="password" value={values.password} placeholder="••••••••" onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password2">Confirm Password</Label>
                                <Input id="password2" type="password" name="confirmPassword" value={values.confirmPassword} placeholder="••••••••" onChange={handleChange} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading || usernameAvail === 'checking' || emailAvail === 'checking'}>
                                {isLoading ? "Creating account..." : "Create account"}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Already a member?{" "}
                                <Link href="/auth/login" className="text-primary font-medium hover:underline">Login</Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
