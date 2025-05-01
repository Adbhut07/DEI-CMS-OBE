import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="relative mx-auto h-60 w-60">
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-24 w-24 text-muted-foreground/30" strokeWidth={1} />
          </div>
          <div className="absolute -right-4 top-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-2 -left-6 h-16 w-16 rounded-full bg-muted" />
          <div className="absolute -top-2 left-10 h-8 w-8 rounded-full bg-muted" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="text-muted-foreground">
          We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">Go back home</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
