"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Project = {
  title: string
  description: string
  stack: string[]
  link: string
  liveLink?: string  // Opcjonalny link do live strony
  image?: string  // Opcjonalny obrazek
  video?: string  // Opcjonalny filmik (MP4/GIF) – nowy
}

const projects: Project[] = [
  {
    title: "Terraform AWS VPC Module",
    description: "Reusable Terraform module for VPC setup with subnets, security groups, and NAT gateways. Used in production for multi-env deployments.",
    stack: ["Terraform", "AWS VPC", "IaC", "Modules"],
    link: "https://github.com/RagarRW-c/terraform-vpc-module",
    image: "/projects/vpc-diagram.png",
  },
  {
    title: "Next.js Portfolio with AWS Backend",
    description: "This site – static export to S3/CloudFront, contact form with Lambda/SES (multipart attachments). Full IaC with Terraform.",
    stack: ["Next.js", "AWS Lambda", "SES", "Terraform", "shadcn/ui"],
    link: "https://github.com/RagarRW-c/witalijrapicki-dev",
  },
  {
    title: "CI/CD Pipeline for React App",
    description: "Automated deployment of React app to S3 + CloudFront using GitHub Actions and Terraform. Includes tests and invalidations.",
    stack: ["GitHub Actions", "AWS S3", "CloudFront", "Terraform"],
    link: "https://github.com/RagarRW-c/react-ci-cd",
    image: "/projects/pipeline-diagram.png",
  },
  // Nowy projekt: Typrr z filmikiem zamiast image
  {
    title: "Typrr – Cloud-Native Typing Platform",
    description: "Production-ready full-stack application for measuring typing speed and accuracy, designed in cloud-native architecture and deployed on AWS using Infrastructure as Code. Combines web app development with production environment including autoscaling, HTTPS, monitoring, logging, and secure secret management.",
    stack: ["React", "TypeScript", "Vite", "Nginx", "Node.js", "Express", "Prisma ORM", "JWT", "SQLite", "PostgreSQL", "AWS ECS Fargate", "ALB", "Route53", "ACM", "RDS", "S3", "CloudWatch", "Secrets Manager", "Terraform", "Docker"],
    link: "https://github.com/RagarRW-c/typrr",
    liveLink: "https://typrr.cloud",
    video: "https://i.imgur.com/NcVQTqh.gif",  // Looping GIF demo typing test – działa jako <video src>
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ProjectsPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
        Projects
      </h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((proj, index) => (
          <motion.div key={proj.title} variants={cardVariants}>
            <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
              {proj.video ? (
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <video
                    src={proj.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : proj.image ? (
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <Image
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-muted rounded-t-xl flex items-center justify-center">
                  <Github className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{proj.title}</CardTitle>
                <CardDescription className="text-base">{proj.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {proj.stack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={proj.link} target="_blank" rel="noopener noreferrer">
                      View on GitHub <Github className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                  {proj.liveLink && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer">
                        View Live <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-center text-muted-foreground mt-12 italic">
        More projects coming soon... 🚀
      </p>
    </div>
  )
}