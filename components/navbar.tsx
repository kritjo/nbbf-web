import Link from "next/link";
import UserOrSignin from "./userOrSignin";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center px-8 py-4">
      <Link href="/">
        <Image width={80} height={80} src="/nbbf-nt-nbg.png" alt="Norges Bondebridgeforbund Logo"/>
      </Link>
      <nav className="space-x-4 flex">
        <Link className="text-lg font-semibold hover:underline" href="/">
          Hjem
        </Link>
        <Link className="text-lg font-semibold hover:underline" href={"/kontakt"}>
          Kontakt
        </Link>
        <UserOrSignin/>
      </nav>
    </header>
  )
}

export default Navbar