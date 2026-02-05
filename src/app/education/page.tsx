import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Award } from "lucide-react"

const education = [
  {
    degree: "Master Degree - Management in IT",
    school: "High School of Banking and Management in Cracow",
    field: "Computer Science",
    period: "03/2018 – 11/2020",
  },
  {
    degree: "Bachelor Degree - Operating Systems and Networks",
    school: "High School of Banking and Management in Cracow",
    field: "Computer Science",
    period: "08/2013 – 10/2017",
  },
]

const certifications = [
  {
    name: "Terraform Associate Certification",
    issuer: "HashiCorp",
    status: "w trakcie zdobywania",
    planned: "2026",
  },
  {
    name: "AWS Certified Solutions Architect / Developer",
    issuer: "Amazon Web Services",
    status: "planowany",
    planned: "2026 / 2027",
  },
  {
    name: "Docker Certified Associate",
    issuer: "Docker Inc.",
    status: "planowany",
    planned: "po AWS",
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    status: "planowany",
    planned: "na końcu",
  },
]

export default function EducationPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
        Edukacja & Certyfikaty
      </h1>

      {/* Edukacja */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 flex items-center justify-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          Edukacja
        </h2>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {education.map((edu) => (
            <Card key={edu.degree} className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">{edu.degree}</CardTitle>
                <CardDescription className="text-base">{edu.school}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  <strong>Kierunek:</strong> {edu.field}
                </p>
                <p className="text-muted-foreground">
                  <strong>Okres:</strong> {edu.period}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Certyfikaty */}
      <section>
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 flex items-center justify-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          Certyfikaty
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {certifications.map((cert) => (
            <Card key={cert.name} className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{cert.name}</CardTitle>
                  <Badge variant={cert.status.includes("w trakcie") ? "default" : "secondary"}>
                    {cert.status}
                  </Badge>
                </div>
                <CardDescription>{cert.issuer}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <strong>Planowany termin:</strong> {cert.planned}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8 italic">
          Lista będzie się aktualizować w miarę zdobywania kolejnych certyfikatów 🚀
        </p>
      </section>
    </div>
  )
}