import {ReactNode, use} from "react";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";

export default function AdminLayout({children}: { children: ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const user = use(getAuthenticatedUser(token.value, 'admin'))
  if (!user) redirect('/')

  return (
    <>
      {children}
    </>
  )
}