import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { MailCheck } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-card text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-xl text-card-foreground">Check your email</CardTitle>
          <CardDescription className="text-muted-foreground">
            {"We've sent you a confirmation link. Click it to activate your account and start earning $GRU tokens."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/auth/login"
            className="text-sm text-primary hover:underline font-medium"
          >
            Back to Sign In
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
