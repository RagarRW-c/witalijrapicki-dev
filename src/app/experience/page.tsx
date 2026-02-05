"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Cloud, Server } from "lucide-react"
import { Variants } from "framer-motion"

const experiences = [
  {
    title: "Cloud Engineer",
    company: "Microsecond S.C.",
    period: "03/2022 – obecnie",
    icon: Cloud,
    points: [
      "Projektowanie i utrzymywanie infrastruktury jako kod przy użyciu Terraform modules",
      "Wdrażanie statycznych aplikacji React na AWS (S3 + CloudFront + ACM + Route53)",
      "Automatyzacja provisioningu zasobów AWS (IaC)",
      "Konfiguracja i monitoring usług: EC2, VPC, S3, RDS, Lambda",
      "Zarządzanie pipeline’ami CI/CD (AWS CodePipeline, GitHub Actions, GitLab CI)",
      "Rozwiązywanie problemów sieciowych w VPC, subnets, security groups",
      "Zarządzanie backupami i disaster recovery (EBS, RDS)",
    ],
  },
  {
    title: "System & Network Engineer",
    company: "Microsecond S.C.",
    period: "03/2017 – 02/2022",
    icon: Server,
    points: [
      "Projektowanie i wdrażanie rozwiązań sieciowych high-availability (LAN, WAN, WLAN)",
      "Konfiguracja routerów, switchy, firewalli (Cisco, Unifi, MikroTik)",
      "Zarządzanie usługami: DHCP, DNS, NTP",
      "Konfiguracja polityk bezpieczeństwa (firewalle, ACL, SSL/TLS)",
      "Budowa połączeń hybrydowych (Site-to-Site VPN, Direct Connect)",
      "Zarządzanie zdalnym dostępem (VPN, SSH, RDP)",
      "Administracja systemami Linux / Windows / macOS",
    ],
  },
  {
    title: "System Administrator",
    company: "BWI Group",
    period: "12/2016 – 02/2017",
    icon: Briefcase,
    points: [
      "Wsparcie użytkowników (tickety, email, telefon)",
      "Administracja Active Directory",
      "Wsparcie techniczne Windows / macOS / Linux",
      "Rutynowa konserwacja sprzętu i naprawa błędów oprogramowania",
      "Backup i odzyskiwanie danych",
    ],
  },
]

// warianty animacji dla kart (każda kolejna pojawia się z lekkim opóźnieniem)
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
}

export default function ExperiencePage() {
  return (
    <div className="container px-4 py-10 md:py-16 lg:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
        Doświadczenie zawodowe
      </h1>

      <div className="relative mx-auto max-w-5xl">
        {/* Linia pionowa – delikatny gradient */}
        <div className="absolute left-5 md:left-1/2 h-full w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 transform -translate-x-1/2" />

        <div className="space-y-12 md:space-y-16 lg:space-y-20">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants as any}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 group ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Kropka z ikoną i ringiem */}
              <div className="absolute left-5 md:left-1/2 w-11 h-11 rounded-full bg-background border-4 border-primary/60 flex items-center justify-center transform -translate-x-1/2 z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-500/70">
                <exp.icon className="h-5 w-5 text-primary group-hover:text-cyan-400 transition-colors" />
              </div>

              {/* Data i stanowisko */}
              <div
                className={`w-full md:w-5/12 pl-14 md:pl-0 ${
                  index % 2 === 0 ? "md:text-right md:pr-10 lg:pr-12" : "md:pl-10 lg:pl-12"
                }`}
              >
                <time className="text-sm md:text-base font-medium text-muted-foreground block mb-1 md:mb-2">
                  {exp.period}
                </time>
                <h3 className="text-xl md:text-2xl font-semibold">{exp.title}</h3>
                <p className="text-muted-foreground text-base md:text-lg">{exp.company}</p>
              </div>

              {/* Karta z neonowym hover */}
              <Card
                className={`w-full md:w-6/12 bg-card/70 backdrop-blur-md border border-border/40 shadow-md transition-all duration-300 
                  group-hover:shadow-[0_0_25px_-5px] group-hover:shadow-cyan-500/20 
                  group-hover:border-cyan-500/40 group-hover:-translate-y-1 
                  ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg md:text-xl">{exp.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm md:text-base">
                  <ul className="list-disc pl-5 space-y-2.5 text-muted-foreground">
                    {exp.points.map((point, i) => (
                      <li key={i} className="leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}