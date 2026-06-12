'use client'

import GlobalNavbar from "@/components/GlobalNavbar";
import { SessionType } from "@/utils/types";
import { loginRoute, forgotPasswordRoute } from "@/utils/APIRoutes";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { getUserSession } from "@/utils/reuseableCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginComponent() {
    const router = useRouter()
    const [session, setSession] = useState<SessionType>()
    const [message, setMessage] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState({ email: "", password: "" });

    // Forgot password state
    const [showForgot, setShowForgot] = useState(false)
    const [forgotEmail, setForgotEmail] = useState("")
    const [forgotMessage, setForgotMessage] = useState<{ text: string; ok: boolean }>()
    const [forgotLoading, setForgotLoading] = useState(false)

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.currentTarget.name]: event.currentTarget.value });
    };

    const validateForm = () => {
        const { email, password } = values;
        if (email === "") { setMessage("Please enter your email."); return false; }
        if (password === "") { setMessage("Please enter your password."); return false; }
        return true;
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        const { email, password } = values;
        try {
            const response = await axios.post(loginRoute, { email, password }, { withCredentials: true });
            const data = response.data;
            if (response.status !== 200) { setMessage(data.error); return; }
            sessionStorage.setItem('user', JSON.stringify(data.user));
            setSession(JSON.parse(sessionStorage.getItem('user')!));
            router.push("/jobs");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Our servers are down. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (!forgotEmail) { setForgotMessage({ text: "Enter your email address.", ok: false }); return; }
        setForgotLoading(true)
        setForgotMessage(undefined)
        try {
            await axios.post(forgotPasswordRoute, { email: forgotEmail })
            setForgotMessage({ text: "Check your inbox — we sent a reset link if that email is registered.", ok: true })
        } catch {
            setForgotMessage({ text: "Something went wrong. Please try again.", ok: false })
        } finally {
            setForgotLoading(false)
        }
    }

    useEffect(() => {
        const isAuthenticated = getUserSession();
        if (isAuthenticated) { setSession(isAuthenticated); router.push('/jobs'); }
    }, [router]);

    return (
        <>
            <GlobalNavbar session={session} />
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
                <Card className="w-full max-w-md shadow-lg">
                    {!showForgot ? (
                        <>
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                                <CardDescription>Sign in to your NE1 Freelance account</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {message && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertDescription>{message}</AlertDescription>
                                    </Alert>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            placeholder="example@example.com"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            <button
                                                type="button"
                                                onClick={() => { setShowForgot(true); setMessage(undefined); }}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={values.password}
                                            placeholder="••••••••"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Signing in..." : "Sign in"}
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground">
                                        Don&apos;t have an account?{" "}
                                        <Link href="/auth/signup" className="text-primary font-medium hover:underline">
                                            Sign up
                                        </Link>
                                    </p>
                                </form>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
                                <CardDescription>Enter your email and we&apos;ll send a reset link</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {forgotMessage && (
                                    <Alert variant={forgotMessage.ok ? "default" : "destructive"} className={`mb-4 ${forgotMessage.ok ? "border-green-500 text-green-700 bg-green-50" : ""}`}>
                                        <AlertDescription>{forgotMessage.text}</AlertDescription>
                                    </Alert>
                                )}
                                <form onSubmit={handleForgotSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="forgot-email">Email address</Label>
                                        <Input
                                            id="forgot-email"
                                            type="email"
                                            placeholder="example@example.com"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={forgotLoading}>
                                        {forgotLoading ? "Sending..." : "Send reset link"}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowForgot(false); setForgotMessage(undefined); setForgotEmail(""); }}
                                        className="w-full text-center text-sm text-muted-foreground hover:underline"
                                    >
                                        Back to sign in
                                    </button>
                                </form>
                            </CardContent>
                        </>
                    )}
                </Card>
            </main>
        </>
    )
}
