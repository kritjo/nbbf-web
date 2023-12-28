import {cookies} from "next/headers";
import {use} from "react";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";
import {redirect} from "next/navigation";
import GameManager from "../../components/game-manager";

export default function Medlem() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const user = use(getAuthenticatedUser(token.value, 'medlem'));
  if (!user) redirect('/')


  return (
    <main>
        <GameManager user={user} tokenValue={token.value}/>
    </main>
  )
}