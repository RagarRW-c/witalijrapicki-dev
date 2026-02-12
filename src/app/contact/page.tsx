"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

const API_ENDPOINT = "https://d5zxry52fj.execute-api.eu-central-1.amazonaws.com/prod/contact"

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
      toast.error("Plik jest za duży (maks. 5 MB)")
      e.target.value = "" // wyczyść input
      return
    }

    setFile(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Podstawowa walidacja po stronie klienta
    if (!formData.name.trim()) {
      toast.error("Imię jest wymagane")
      return
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      toast.error("Podaj poprawny adres email")
      return
    }
    if (!formData.subject.trim()) {
      toast.error("Temat jest wymagany")
      return
    }
    if (!formData.message.trim()) {
      toast.error("Wiadomość jest wymagana")
      return
    }

    setIsSubmitting(true)

    try {
      const data = new FormData()
      data.append("name", formData.name.trim())
      data.append("email", formData.email.trim())
      data.append("subject", formData.subject.trim())
      data.append("message", formData.message.trim())
      if (file) {
        data.append("attachment", file)
      }

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Błąd serwera (${response.status})`)
      }

      const result = await response.json()
      toast.success(result.message || "Wiadomość została wysłana!")

      // Reset formularza
      setFormData({ name: "", email: "", subject: "", message: "" })
      setFile(null)

    } catch (err: any) {
      console.error("Błąd wysyłania:", err)
      toast.error(err.message || "Nie udało się wysłać wiadomości. Spróbuj ponownie.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12 md:py-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Skontaktuj się ze mną</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Imię
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Twoje imię"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="twoj@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Temat
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="W czym mogę pomóc?"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Wiadomość
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Opisz swoją sprawę..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Załącznik (opcjonalny, max 5 MB)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors">
                    <Paperclip className="h-4 w-4" />
                    <span>Wybierz plik</span>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                  />
                </label>

                {file && (
                  <div className="flex items-center gap-2 text-sm bg-secondary px-3 py-1 rounded-md">
                    <span className="truncate max-w-[200px]">{file.name}</span>
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
                Dozwolone formaty: PDF, DOC, TXT, JPG, PNG
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wysyłanie...
                </>
              ) : (
                "Wyślij wiadomość"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}