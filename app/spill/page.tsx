import {cookies} from "next/headers";
import {use} from "react";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";
import {redirect} from "next/navigation";
import GameManager from "../../components/gameplay/game-manager";
import {getGames} from "../../actions/getGames";

export default function Spill() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const user = use(getAuthenticatedUser(token.value, 'medlem'));
  if (!user) redirect('/')
  const games = use(getGames(token.value));


  return (
    <main>
        <GameManager user={user} tokenValue={token.value} games={games}/>
    </main>
  )
}