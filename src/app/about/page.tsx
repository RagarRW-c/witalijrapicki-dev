import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Linkedin, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16">
        About me
      </h1>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto">
        {/* Photo / avatar placeholder */}
        <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xl shadow-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background/60" />
          {/* Placeholder – replace later */}
          <div className="flex items-center justify-center h-full text-muted-foreground text-lg font-medium bg-muted/40">
            Your photo will be here
          </div>
          {/* When you have photo: */}
          {/* <Image src="/me.jpg" alt="Witalij Rapicki" fill className="object-cover" /> */}
        </div>

        {/* Text */}
        <div className="space-y-6 md:space-y-8">
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Hi! I'm Witalij – Cloud Engineer and DevOps from Krakow.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Currently focusing on Cloud Engineer role (2+ years experience), previously worked for 5 years as System & Network Administrator – designing and maintaining networks, servers, and high-availability hybrid solutions.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            I like when things work predictably, fast, and securely – that's why I spend most of my time writing code that manages infrastructure, pipelines, and backups itself.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Daily working with Linux, containers, networks, and CI/CD tools. Constantly learning – next: Terraform cert → AWS → Docker → Kubernetes.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Outside work, I bike, play games, grow fruit plants, and sometimes modify cars.  
            Fluent in Polish, English, Ukrainian, and Russian.
          </p>

          {/* Highlighted cards – all in uniform structure */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-primary">2+</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  years in<br />cloud
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  years<br />Sys & Net Admin
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-primary">AWS</p>
                <p className="text-xs text-muted-foreground">daily</p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-primary">IaC</p>
                <p className="text-xs text-muted-foreground">Terraform</p>
              </CardContent>
            </Card>

            {/* Docker */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                  alt="Docker"
                  width={36}
                  height={36}
                />
                <p className="text-base font-semibold text-primary">Docker</p>
                <p className="text-xs text-muted-foreground">basics</p>
              </CardContent>
            </Card>

            {/* Kubernetes */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg"
                  alt="Kubernetes"
                  width={36}
                  height={36}
                />
                <p className="text-base font-semibold text-primary">Kubernetes</p>
                <p className="text-xs text-muted-foreground">in progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-8">
            <Button size="lg" asChild>
              <Link href="/contact">
                Contact me <Mail className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <a href="https://www.linkedin.com/in/witalij-rapicki/" target="_blank" rel="noopener noreferrer">
                LinkedIn <Linkedin className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/RagarRW-c" target="_blank" rel="noopener noreferrer">
                GitHub <Github className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}