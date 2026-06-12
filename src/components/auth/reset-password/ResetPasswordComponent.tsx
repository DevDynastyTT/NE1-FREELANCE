'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import GlobalNavbar from '@/components/GlobalNavbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { resetPasswordRoute } from '@/utils/APIRoutes'

export default function ResetPasswordComponent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState<{ text: string; ok: boolean }>()
    const [isLoading, setIsLoading] = useState(false)
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (!token) setMessage({ text: 'Invalid or missing reset token.', ok: false })
    }, [token])

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setMessage(undefined)

        if (password.length < 8) {
            setMessage({ text: 'Password must be at least 8 characters.', ok: false })
            return
        }
        if (password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match.', ok: false })
            return
        }

        setIsLoading(true)
        try {
            await axios.post(resetPasswordRoute, { token, password })
            setDone(true)
            setMessage({ text: 'Password updated! Redirecting to login...', ok: true })
            setTimeout(() => router.push('/auth/login'), 2500)
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                setMessage({ text: error.response.data.error, ok: false })
            } else {
                setMessage({ text: 'Something went wrong. Please try again.', ok: false })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <GlobalNavbar session={undefined} />
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
                        <CardDescription>Choose a strong password for your account</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {message && (
                            <Alert
                                variant={message.ok ? 'default' : 'destructive'}
                                className={`mb-4 ${message.ok ? 'border-green-500 text-green-700 bg-green-50' : ''}`}
                            >
                                <AlertDescription>{message.text}</AlertDescription>
                            </Alert>
                        )}

                        {!done && token && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update password'}
                                </Button>
                            </form>
                        )}

                        {(!token || done) && (
                            <p className="text-center text-sm text-muted-foreground mt-2">
                                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                                    Back to sign in
                                </Link>
                            </p>
                        )}
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
