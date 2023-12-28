import Link from "next/link";
import UserOrSignin from "./userOrSignin";
import Image from "next/image";
import {cookies} from "next/headers";
import {use} from "react";
import {getAuthenticatedUser} from "../actions/getAuthenticatedUser";
import {hasMinimumRole} from "../lib/utils";

const Navbar = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  let user = null;
  if (token) user = use(getAuthenticatedUser(token.value, 'medlem'))

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
        { user && hasMinimumRole(user.role, 'medlem') &&
            <Link className="text-lg font-semibold hover:underline" href={"/medlem"}>
                Medlemssider
            </Link>
        }
        { user && hasMinimumRole(user.role, 'styre') &&
            <Link className="text-lg font-semibold hover:underline" href={"/styresider"}>
                Styresider
            </Link>
        }
        <UserOrSignin/>
      </nav>
    </header>
  )
}

export default Navbar