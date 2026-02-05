"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Cloud,
  Server,
  Code,
  Settings,
  Database,
  Terminal,
  Lock,
  Network,
  Cpu,
  FileCode,
  Braces,
  GitBranch,
  Container,
  Cog,
  Shield,
  Globe,
  HardDrive,
  Layers,
} from "lucide-react"

const skills = [
  {
    category: "Cloud & DevOps",
    icon: Cloud,
    items: [
      { name: "AWS (EC2, VPC, Route53, IAM, S3, CloudFront, Lambda, RDS, DynamoDB, ECS)", icon: Cloud },
      { name: "Terraform (Infrastructure as Code)", icon: Cog },
      { name: "GitHub Actions / GitLab CI/CD", icon: GitBranch },
      { name: "Docker (podstawy + zarządzanie kontenerami)", icon: Container },
      { name: "Kubernetes (w trakcie nauki i certyfikacji)", icon: Layers },
      { name: "Jenkins (podstawowa konfiguracja pipeline’ów)", icon: Cog },
      { name: "Ansible – basics", icon: Terminal },
      { name: "Azure – basics", icon: Globe },
    ],
  },
  {
    category: "Systemy i sieci",
    icon: Server,
    items: [
      { name: "Linux / Windows Server", icon: Server },
      { name: "Sieci (LAN/WAN/WLAN, routing, switching, firewall)", icon: Network },
      { name: "Cisco, Unifi, MikroTik", icon: HardDrive },
      { name: "VPN, SSH, RDP", icon: Lock },
      { name: "DHCP, DNS, NTP", icon: Globe },
      { name: "SSL/TLS, IAM, security groups", icon: Shield },
    ],
  },
  {
    category: "Programowanie / skrypty",
    icon: Code,
    items: [
      { name: "Bash (podstawowa automatyzacja)", icon: Terminal },
      { name: "Python", icon: FileCode },
      { name: "JSON / YAML", icon: Braces },
    ],
  },
  {
    category: "Inne",
    icon: Settings,
    items: [
      { name: "Active Directory", icon: Shield },
      { name: "Monitoring, backup & recovery", icon: HardDrive },
      { name: "Troubleshooting", icon: Cpu },
      { name: "Unifi console management", icon: Settings },
      { name: "ServiceNow / Jira", icon: Cog },
    ],
  },
]

// Animacja badge'ów
const badgeVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.03 + 0.1, // lekkie opóźnienie między kategoriami
      duration: 0.35,
      ease: "easeOut",
    },
  }),
}

export default function SkillsPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
        Umiejętności
      </h1>

      <Accordion type="multiple" defaultValue={skills.map((s) => s.category)} className="w-full max-w-4xl mx-auto">
        {skills.map((category, catIndex) => (
          <AccordionItem key={category.category} value={category.category} className="border-border/50">
            <AccordionTrigger className="text-xl md:text-2xl py-5 hover:no-underline group">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-7 w-7 text-primary" />
                </div>
                <span>{category.category}</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-6 pt-3">
              <div className="flex flex-wrap gap-2.5 md:gap-3">
                {category.items.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    custom={catIndex * 10 + index} // różne opóźnienie dla każdej kategorii
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={badgeVariants as any}
                  >
                    <Badge
                      variant="secondary"
                      className="text-sm py-1.5 px-3.5 bg-secondary/70 hover:bg-secondary/90 transition-colors flex items-center gap-1.5 border border-border/40"
                    >
                      {skill.icon && <skill.icon className="h-3.5 w-3.5 opacity-80" />}
                      {skill.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}