import {cookies} from "next/headers";
import {use} from "react";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";
import {redirect} from "next/navigation";

export default function Medlem() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const user = use(getAuthenticatedUser(token.value, 'medlem'));

  return (
    <main>
      <section className="flex flex-col items-center justify-center py-12">
        <p className="text-2xl font-bold">Hei {user?.full_name}, du er nå innlogget. Type: Medlem</p>
      </section>
    </main>
  )
}