"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip, X } from "lucide-react"
import { toast } from "sonner"

const API_ENDPOINT =
  "https://d5zxry52fj.execute-api.eu-central-1.amazonaws.com/prod/contact"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Plik za duży", {
        description: "Maksymalny rozmiar: 5 MB",
      })
      return
    }

    setFile(selectedFile)
  }

  const removeFile = () => setFile(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data = new FormData()
    data.append("name", formData.name)
    data.append("email", formData.email)
    data.append("subject", formData.subject)
    data.append("message", formData.message)
    if (file) data.append("attachment", file)

    try {
      console.log("Submitting →", API_ENDPOINT)

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: data,
      })

      console.log("Status:", response.status)

      const rawText = await response.text()
      console.log("Raw response:", rawText)

      let result: any = {}

      try {
        result = rawText ? JSON.parse(rawText) : {}
      } catch {
        result = { raw: rawText }
      }

      if (response.ok) {
        toast.success("Wiadomość wysłana!", {
          description:
            result?.message ||
            "Dzięki! Odpowiem najszybciej jak mogę.",
        })

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })

        setFile(null)
      } else {
        toast.error("Błąd wysyłania", {
          description:
            result?.error ||
            result?.raw ||
            "Spróbuj ponownie.",
        })
      }
    } catch (err) {
      console.error("Fetch error:", err)

      toast.error("Błąd połączenia", {
        description: "Nie udało się połączyć z API.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
        Kontakt
      </h1>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Napisz do mnie</CardTitle>
            <CardDescription>
              Możesz dołączyć plik (CV, PDF, do 5 MB)
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Imię i nazwisko</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subject">Temat</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Wiadomość</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="file">Załącznik (opcjonalny)</Label>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md border border-border"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span>Wybierz plik</span>

                    <Input
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip"
                    />
                  </label>

                  {file && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="truncate max-w-[180px]">
                        {file.name}
                      </span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={removeFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Maks. 5 MB
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>{/* Dane kontaktowe */}</div>
      </div>
    </div>
  )
}
