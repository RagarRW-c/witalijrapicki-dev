"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Linkedin, Github, Send, Paperclip, X } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Limit rozmiaru np. 5 MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Plik jest za duży. Maksymalny rozmiar: 5 MB")
        return
      }
      setFile(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Tutaj będzie prawdziwe wysyłanie (tymczasowo symulacja)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Dane formularza:", formData)
    console.log("Załącznik:", file?.name)

    alert("Wiadomość + załącznik wysłane! (symulacja)")

    setSubmitted(true)
    setIsSubmitting(false)

    // Reset po sukcesie
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" })
      setFile(null)
      setSubmitted(false)
    }, 4000)
  }

  return (
    <div className="container py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16">
        Kontakt
      </h1>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16 max-w-5xl mx-auto">
        {/* Formularz */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Napisz do mnie</CardTitle>
            <CardDescription>
              Możesz dołączyć plik (CV, PDF, do 5 MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-12">
                <Send className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Dzięki za wiadomość!</h3>
                <p className="text-muted-foreground">
                  {file ? "Załącznik został wysłany." : ""}
                  Odpowiem najszybciej jak mogę.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Imię i nazwisko</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Witalij Rapicki"
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
                    placeholder="witalijrapicki@gmail.com"
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
                    placeholder="Propozycja współpracy / Pytanie techniczne"
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
                    placeholder="Cześć Witalij, chciałbym porozmawiać o..."
                    rows={5}
                    required
                  />
                </div>

                {/* Pole na załącznik */}
                <div className="grid gap-2">
                  <Label htmlFor="file">Załącznik (opcjonalny)</Label>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="file"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md border border-border transition-colors"
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
                        <span className="truncate max-w-[180px]">{file.name}</span>
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
                    Maks. 5 MB • PDF, Word, TXT, obrazki, ZIP
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Dane kontaktowe – bez zmian */}
        <div className="space-y-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Dane kontaktowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:witalijrapicki@gmail.com" className="text-primary hover:underline">
                    witalijrapicki@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Linkedin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <a
                    href="https://www.linkedin.com/in/witalij-rapicki/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    linkedin.com/in/witalij-rapicki
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Github className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">GitHub</p>
                  <a
                    href="https://github.com/RagarRW-c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/RagarRW-c
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}