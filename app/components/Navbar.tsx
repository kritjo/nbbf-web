import Link from "next/link";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center px-8 py-4">
      <Link href="#">
        <img className="w-24 h-24" src="/nbbf-nt-nbg.png" alt="Norges Bondebridgeforbund Logo"/>
      </Link>
      <nav className="space-x-4">
        <Link className="text-lg font-semibold hover:underline" href="/">
          Hjem
        </Link>
        <Link className="text-lg font-semibold hover:underline" href="/kontakt">
          Kontakt
        </Link>
        <Link className="text-lg font-semibold hover:underline" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </Link>
      </nav>
    </header>
  )
}

export default Navbar