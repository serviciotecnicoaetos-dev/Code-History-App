import { CopyButton } from "@/components/copy-button"; // Crearemos este componente después

export default function HomePage() {
  const ephemeral = {
    displayDate: "August 22, 1978",
    historyText:
      "On this day, the first version of the Smalltalk-76 programming language was released at Xerox PARC. It was one of the first object-oriented languages and heavily influenced the development of many others, including Java, Python, and Ruby.",
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden antialiased md:p-8">
      <div className="w-full max-w-2xl">
        <header className="flex flex-col items-center w-full mb-8 text-center md:flex-row md:justify-between">
          <h1 className="text-xl font-medium text-zinc-500">
            Code History Day
          </h1>
          <p className="flex items-center gap-2 text-lg">
            <span className="text-zinc-500">Last login:</span>
            <time dateTime={ephemeral.displayDate}>
              {ephemeral.displayDate}
            </time>
            <span className="w-2 h-4 bg-lime-400 animate-pulse" />
          </p>
        </header>

        <p className="text-lg text-justify">{ephemeral.historyText}</p>
      </div>

      <footer className="absolute flex items-center justify-center gap-4 bottom-8">
        <a
          href="https://github.com/serviciotecnicoaetos-dev/code-history-app" // Cambia esto a tu usuario de GitHub
          target="_blank"
          className="text-sm transition-colors text-zinc-500 hover:text-white"
        >
          Fork on GitHub
        </a>
        <CopyButton textToCopy={ephemeral.historyText} />
      </footer>
    </main>
  );
}