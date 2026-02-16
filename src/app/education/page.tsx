"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Award, Calendar, BookOpen } from "lucide-react"

const education = [
  {
    degree: "Master Degree - Management in IT",
    school: "High School of Banking and Management in Cracow",
    field: "Computer Science",
    period: "03/2018 – 11/2020",
    badges: ["Management", "IT Strategy"],  // Optional badges for highlights
  },
  {
    degree: "Bachelor Degree - Operating Systems and Networks",
    school: "High School of Banking and Management in Cracow",
    field: "Computer Science",
    period: "08/2013 – 10/2017",
    badges: ["Networks", "Operating Systems"],
  },
]

const certifications = [
  {
    name: "Terraform Associate Certification",
    issuer: "HashiCorp",
    status: "in progress",
    planned: "2026",
    badges: ["IaC", "Cloud"],  // Badges for skills covered
  },
  {
    name: "AWS Certified Solutions Architect / Developer",
    issuer: "Amazon Web Services",
    status: "planned",
    planned: "2026 / 2027",
    badges: ["AWS", "Architecture"],
  },
  {
    name: "Docker Certified Associate",
    issuer: "Docker Inc.",
    status: "planned",
    planned: "after AWS",
    badges: ["Containers", "DevOps"],
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    status: "planned",
    planned: "at the end",
    badges: ["Kubernetes", "Orchestration"],
  },
]

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
}

export default function EducationPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
        Education & Certifications
      </h1>

      {/* Education Section */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 flex items-center justify-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          Education
        </h2>

        <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto space-y-4">
          {education.map((edu, index) => (
            <motion.div
              key={edu.degree}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={badgeVariants as any}
            >
              <AccordionItem value={edu.degree} className="border-border/50">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-left">
                      <h3 className="text-xl font-semibold">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.school}</p>
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      <strong>Field:</strong> {edu.field}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Period:</strong> {edu.period}
                    </p>
                    {edu.badges && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {edu.badges.map((badge, i) => (
                          <motion.div
                            key={badge}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            variants={badgeVariants as any}
                          >
                            <Badge variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </section>

      {/* Certifications Section */}
      <section>
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 flex items-center justify-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          Certifications
        </h2>

        <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto space-y-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={badgeVariants as any}
            >
              <AccordionItem value={cert.name} className="border-border/50">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-left">
                      <h3 className="text-xl font-semibold">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={cert.status === "in progress" ? "default" : "secondary"}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Planned: {cert.planned}
                      </p>
                    </div>
                    {cert.badges && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {cert.badges.map((badge, i) => (
                          <motion.div
                            key={badge}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            variants={badgeVariants as any}
                          >
                            <Badge variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <p className="text-center text-muted-foreground mt-8 italic">
          The list will be updated as new certifications are obtained 🚀
        </p>
      </section>
    </div>
  )
}