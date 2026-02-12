"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const API_ENDPOINT = "https://d5zxry52fj.execute-api.eu-central-1.amazonaws.com/prod/contact"

const formSchema = z.object({
  name: z.string().min(2, { message: "Imię musi mieć co najmniej 2 znaki" }).trim(),
  email: z.string().email({ message: "Nieprawidłowy adres email" }).trim(),
  subject: z.string().min(3, { message: "Temat musi mieć co najmniej 3 znaki" }).trim(),
  message: z.string().min(10, { message: "Wiadomość musi mieć co najmniej 10 znaków" }).trim(),
})

type FormData = z.infer<typeof formSchema>

export default function ContactPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const { register, handleSubmit, formState: { errors }, reset } = form

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Plik jest za duży (maks. 5 MB)")
      e.target.value = ""
      return
    }

    setFile(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const fd = new FormData()
      fd.append("name", data.name)
      fd.append("email", data.email)
      fd.append("subject", data.subject)
      fd.append("message", data.message)
      if (file) {
        fd.append("attachment", file)
      }

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: fd,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Błąd HTTP: ${response.status}`)
      }

      const result = await response.json()
      toast.success(result.message || "Wiadomość wysłana!")

      reset()
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Imię
                </label>
                <Input
                  id="name"
                  placeholder="Twoje imię"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="twoj@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Temat
              </label>
              <Input
                id="subject"
                placeholder="W czym mogę pomóc?"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Wiadomość
              </label>
              <Textarea
                id="message"
                placeholder="Opisz swoją sprawę..."
                rows={6}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
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