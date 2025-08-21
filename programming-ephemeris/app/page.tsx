"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

// Efemérides de programación por día del año
const programmingEphemeris = [
  {
    date: "1 de enero",
    year: 1970,
    event: "Inicio de la Era Unix - El tiempo Unix comienza a contar desde las 00:00:00 UTC del 1 de enero de 1970",
    category: "Sistema",
  },
  {
    date: "2 de enero",
    year: 1975,
    event: "Bill Gates y Paul Allen fundan Microsoft en Albuquerque, Nuevo México",
    category: "Empresa",
  },
  {
    date: "3 de enero",
    year: 1977,
    event: "Apple Computer se incorpora oficialmente como empresa",
    category: "Empresa",
  },
  {
    date: "4 de enero",
    year: 1999,
    event: "Se lanza la primera versión beta de Mozilla M1",
    category: "Software",
  },
  {
    date: "5 de enero",
    year: 1914,
    event: "Nace George Boole, matemático cuyo trabajo en álgebra booleana es fundamental para la programación",
    category: "Persona",
  },
  // Agregar más efemérides aquí...
  {
    date: "15 de febrero",
    year: 1946,
    event: "Se presenta ENIAC, una de las primeras computadoras electrónicas de propósito general",
    category: "Hardware",
  },
  {
    date: "12 de marzo",
    year: 1989,
    event: "Tim Berners-Lee propone la World Wide Web en el CERN",
    category: "Internet",
  },
  {
    date: "3 de abril",
    year: 1973,
    event: "Martin Cooper realiza la primera llamada desde un teléfono móvil",
    category: "Tecnología",
  },
  {
    date: "4 de mayo",
    year: 1979,
    event: "Se lanza VisiCalc, la primera hoja de cálculo para computadoras personales",
    category: "Software",
  },
  {
    date: "23 de junio",
    year: 1912,
    event: "Nace Alan Turing, padre de la ciencia de la computación teórica",
    category: "Persona",
  },
]

export default function ProgrammingEphemeris() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [todayEphemeris, setTodayEphemeris] = useState<(typeof programmingEphemeris)[0] | null>(null)
  const [terminalLines, setTerminalLines] = useState<string[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Obtener efeméride del día actual
    const today = new Date()
    const todayString = `${today.getDate()} de ${today.toLocaleDateString("es-ES", { month: "long" })}`

    const ephemeris = programmingEphemeris.find((e) => e.date === todayString)
    setTodayEphemeris(ephemeris || programmingEphemeris[Math.floor(Math.random() * programmingEphemeris.length)])

    // Simular carga de terminal
    const lines = [
      "$ programming-ephemeris --today",
      "Iniciando sistema de efemérides...",
      "Conectando a base de datos histórica...",
      "Cargando eventos del día...",
      "Sistema listo.",
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < lines.length) {
        setTerminalLines((prev) => [...prev, lines[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-emerald-950/20 animate-gradient-shift"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-float"></div>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"></div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Terminal Header */}
          <div className="mb-6">
            <div className="terminal-text text-sm mb-2">user@programming-history:~$ ./ephemeris.sh</div>
            <div className="terminal-highlight text-xs">
              {formatDate(currentTime)} | {formatTime(currentTime)}
            </div>
          </div>

          {/* Terminal Loading Animation */}
          <Card className="bg-black/60 backdrop-blur-sm border-emerald-500/20 shadow-lg shadow-emerald-500/5 mb-6 p-6 hover:shadow-emerald-500/10 transition-all duration-300">
            <div className="space-y-2">
              {terminalLines.map((line, index) => (
                <div key={index} className="terminal-text text-sm">
                  {line && line.startsWith("$") ? <span className="terminal-highlight">{line}</span> : line}
                </div>
              ))}
            </div>
          </Card>

          {/* Main Content */}
          {todayEphemeris && terminalLines.length >= 5 && (
            <Card className="bg-black/60 backdrop-blur-sm border-emerald-500/20 shadow-lg shadow-emerald-500/5 p-6 hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300">
              <div className="space-y-4">
                <div className="terminal-prompt text-sm">&gt; EFEMÉRIDE DEL DÍA</div>

                <div className="border-l-2 border-emerald-500/50 pl-4 space-y-2">
                  <div className="terminal-highlight text-lg font-bold">
                    {todayEphemeris.date} de {todayEphemeris.year}
                  </div>

                  <div className="terminal-text">{todayEphemeris.event}</div>

                  <div className="text-muted-foreground text-sm">
                    Categoría: <span className="terminal-highlight">{todayEphemeris.category}</span>
                  </div>
                </div>

                <div className="terminal-prompt text-sm mt-6">&gt; ESTADÍSTICAS DEL SISTEMA</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="terminal-text">Efemérides cargadas:</div>
                    <div className="terminal-highlight">{programmingEphemeris.length}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="terminal-text">Uptime del sistema:</div>
                    <div className="terminal-highlight">{formatTime(currentTime)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="terminal-text">Estado:</div>
                    <div className="terminal-highlight">ONLINE</div>
                  </div>
                </div>

                <div className="terminal-prompt text-xs mt-6 opacity-70">user@programming-history:~$ _</div>
              </div>
            </Card>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-muted-foreground text-xs">
            <div className="terminal-text">
              Programming Ephemeris Terminal v1.0 | Desarrollado con ❤️ para la comunidad dev
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
