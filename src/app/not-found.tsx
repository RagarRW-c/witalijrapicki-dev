"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search, AlertTriangle } from "lucide-react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-md w-full space-y-8 text-center"
      >
        {/* Icon */}
        <motion.div variants={itemVariants}>
          <AlertTriangle className="h-24 w-24 mx-auto text-destructive mb-4" />
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent mb-2">
            404
          </h1>
          <p className="text-xl text-muted-foreground">
            Page Not Found
          </p>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Lost in the cloud?</CardTitle>
              <CardDescription>
                The page you're looking for doesn't exist. Maybe it's in another dimension – or just a wrong URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/about">
                    <Search className="mr-2 h-4 w-4" />
                    About Me
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-sm text-muted-foreground italic"
        >
          P.S. If this is a bug, ping me on <a href="mailto:witalijrapicki@gmail.com" className="text-primary hover:underline">email</a>.
        </motion.p>
      </motion.div>
    </div>
  )
}