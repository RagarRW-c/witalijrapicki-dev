import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Linkedin, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16">
        O mnie
      </h1>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto">
        {/* Miejsce na zdjęcie / avatar */}
        <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xl shadow-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background/60" />
          {/* Placeholder – później podmienisz */}
          <div className="flex items-center justify-center h-full text-muted-foreground text-lg font-medium bg-muted/40">
            Tu będzie Twoje zdjęcie
          </div>
          {/* Jak będziesz miał zdjęcie: */}
          {/* <Image src="/me.jpg" alt="Witalij Rapicki" fill className="object-cover" /> */}
        </div>

        {/* Tekst */}
        <div className="space-y-6 md:space-y-8">
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Cześć! Jestem Witalij – Cloud Engineer i DevOps z Krakowa.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Aktualnie skupiam się na roli Cloud Engineer (2+ lata doświadczenia), a wcześniej przez 5 lat pracowałem jako System & Network Administrator – projektując i utrzymując sieci, serwery oraz wysokodostępne rozwiązania hybrydowe.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Lubię, kiedy rzeczy działają przewidywalnie, szybko i bezpiecznie – dlatego większość mojego czasu spędzam na pisaniu kodu, który sam zarządza infrastrukturą, pipeline’ami i backupami.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Na co dzień pracuję z Linuxem, kontenerami, sieciami i narzędziami CI/CD. Ciągle się uczę – w kolejce: certyfikat Terraform → AWS → Docker → Kubernetes.
          </p>

          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Poza pracą jeżdżę na rowerze, gram w gry, hoduję rośliny owocowe i czasem modyfikuję auta.  
            Mówię płynnie po polsku, angielsku, ukraińsku i rosyjsku.
          </p>

          {/* Wyróżnione karty – wszystkie w jednolitej strukturze */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-primary">2+</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  lata w<br />chmurze
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  lat<br />Sys & Net Admin
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-border/40">
              <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-primary">AWS</p>
                <p className="text-xs text-muted-foreground">codziennie</p>
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
                <p className="text-xs text-muted-foreground">podstawy</p>
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
                <p className="text-xs text-muted-foreground">w trakcie nauki</p>
              </CardContent>
            </Card>
          </div>

          {/* Przyciski */}
          <div className="flex flex-wrap gap-4 pt-8">
            <Button size="lg" asChild>
              <Link href="/contact">
                Skontaktuj się <Mail className="ml-2 h-4 w-4" />
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