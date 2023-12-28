import {ReactNode, use} from "react";
import {cookies} from "next/headers";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";
import {redirect} from "next/navigation";

export default function StyreLayout({children}: { children: ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const user = use(getAuthenticatedUser(token.value, 'styre'))
  if (!user) redirect('/')

  return (
    <>
      {children}
    </>
  )
}