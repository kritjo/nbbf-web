import '@fontsource/pt-mono';
import ApplicationForm from "../components/application/applicationForm";
export default function Home() {
  return (
    <main>
      <section
        className="py-12 px-8 bg-center bg-cover"
        style={{
          backgroundImage: '"url("/hero-bg.jpg")"',
        }}
      >
        <h1 className="text-xl font-bold mb-4 nbbf-font md:text-2xl xl:text-5xl">Norges Bondebridgeforbund</h1>
      </section>
      <section className="flex flex-col items-center justify-center py-12">
        <ApplicationForm/>
      </section>
      <section className="w-full py-12 bg-transparent text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="mx-auto max-w-[700px] text-lg md:text-xl dark:text-zinc-400">
                Sjakk er ikke det eneste spillet der konger og dronninger kan demonstrere sin taktiske overlegenhet -
                Forbundet tilbyr en unik utfordring der hver bonde kan bli en konge på slagmarken.
              </p>
              <span className="text-sm italic">- Styrets Leder</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
