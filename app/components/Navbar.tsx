import Link from "next/link";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center px-8 py-4">
      <Link href="#">
        <svg
          className=" w-12 h-12"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          <line x1="4" x2="4" y1="22" y2="15"/>
        </svg>
      </Link>
      <nav className="space-x-4">
        <Link className="text-lg font-semibold hover:underline" href="#">
          Home
        </Link>
        <Link className="text-lg font-semibold hover:underline" href="#">
          About
        </Link>
        <Link className="text-lg font-semibold hover:underline" href="#">
          Events
        </Link>
        <Link className="text-lg font-semibold hover:underline" href="#">
          News
        </Link>
        <Link className="text-lg font-semibold hover:underline" href="#">
          Contact
        </Link>
      </nav>
    </header>
  )
}

export default Navbar