import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {use} from "react";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";

export default function Admin() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const user = use(getAuthenticatedUser(token.value, 'admin'));
  return (
    <main>
      <section className="flex flex-col items-center justify-center py-12">
        <p className="text-2xl font-bold">Du er nå innlogget. Type: Admin</p>
      </section>
    </main>
  )
}