import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image src="/mintwave-logo.svg" alt="MINTWAVE" width={180} height={60} priority />
          </div>

          <Card className="bg-black/40 backdrop-blur-sm border-mint/20">
            <CardHeader>
              <CardTitle className="text-2xl">
                Check your email
              </CardTitle>
              <CardDescription>Confirm your account to start minting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent you a confirmation email. Please check your inbox and click the link to verify your account.
              </p>
              <Button asChild className="w-full" variant="outline">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
