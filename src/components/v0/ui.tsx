import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card"

type Ephemeris = {
  id: number
  day: number
  month: number
  year: number
  event: string
}

type UiProps = { ephemeris: Ephemeris }

export function Ui({ ephemeris }: UiProps) {
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(ephemeris.year, ephemeris.month - 1, ephemeris.day))

  return (
    <div className="mx-auto max-w-4xl p-6 text-green-400">
      <div className="rounded-lg border border-green-800/50 bg-black/60 p-4">
        <div className="mb-4 flex items-center justify-between rounded-md border border-green-800/60 bg-black/70 px-3 py-2 text-sm">
          <span className="flex items-center gap-2">
            <span className="text-green-300">▸</span>
            <span>code-history v0.1.0</span>
          </span>
          <span className="text-green-500">{new Date().toLocaleTimeString("es-ES", { hour12: false })}</span>
        </div>

        <div className="mb-4 font-mono text-sm">
          <span className="text-green-500">user@mouredev</span>:<span className="text-green-600">~</span>$ ./code-history --day
        </div>

        <ul className="mb-6 space-y-1 text-sm">
          <li>● Iniciando sistema de efemérides de programación...</li>
          <li>● Conectando con la base de datos... <span className="text-green-500">[OK]</span></li>
          <li>● Cargando datos históricos... <span className="text-green-500">[OK]</span></li>
          <li>● Sistema listo. Descubre la historia de la programación día a día.</li>
        </ul>

        <div className="mb-6 rounded-md border border-green-800/60 p-3 text-sm">
          <span className="mr-2">⏱</span>
          <span>
            Fecha actual: <span className="text-green-300">{formattedDate}</span>
          </span>
        </div>

        <Card className="border-green-800/60 bg-black/60">
          <CardHeader className="border-b border-green-800/50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-green-300">EFEMÉRIDE DEL DÍA</CardTitle>
                <CardDescription className="text-green-500">
                  {ephemeris.day} de {new Intl.DateTimeFormat("es-ES", { month: "long" }).format(new Date(ephemeris.year, ephemeris.month - 1, ephemeris.day))} de {ephemeris.year}:
                </CardDescription>
              </div>
              <CardAction>
                <button className="rounded-md border border-green-800/60 px-3 py-1 text-sm text-green-300 hover:bg-green-900/20">
                  ✕ Compartir
                </button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="whitespace-pre-line leading-7 text-green-400">{ephemeris.event}</p>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-2 text-center text-xs text-green-600 relative z-10">
          <p>&gt; Pulsa Ctrl+W para salir</p>
          <p>
            © 2025 <a className="underline" href="#">NicoDev</a> — Desarrollado con <span className="text-red-400">❤</span>
          </p>
        </div>
      </div>
    </div>
  )
}
