import {ReactNode, use} from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";

export default function AlreadySignedInLayout({children}: { children: ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  const user = use(getAuthenticatedUser(token?.value ?? '', 'medlem'))
  if (user) redirect('/spill')

  return (
    <>
      {children}
    </>
  )
}