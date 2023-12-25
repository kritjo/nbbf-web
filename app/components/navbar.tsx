import Link from "next/link";
import UserOrSignin from "@/components/userOrSignin";

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
        <UserOrSignin/>
      </nav>
    </header>
  )
}

export default Navbar