import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
      {/* Lekki gradient w tle */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />

      <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          Witalij Rapicki
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground">
          Cloud Engineer • DevOps • Infrastructure as Code
        </p>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto pt-4">
          Projektuję i utrzymuję skalowalną infrastrukturę w chmurze (AWS), specjalizuję się w Terraformie, 
          automatyzacji CI/CD oraz wysokodostępnych środowiskach.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-8 md:pt-10">
          <Button size="lg" asChild>
            <Link href="/about">
              O mnie <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Skontaktuj się</Link>
          </Button>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-8 pt-10 md:pt-12">
          <a
            href="https://github.com/RagarRW-c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-8 w-8" />
          </a>

          <a
            href="https://www.linkedin.com/in/witalij-rapicki/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-8 w-8" />
          </a>

          <a
            href="mailto:witalijrapicki@gmail.com"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="h-8 w-8" />
          </a>
        </div>
      </div>
    </main>
  )
}