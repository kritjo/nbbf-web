import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import GameViewClient from "./game-view-client";
import {getGame} from "../actions/getGame";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {getPlayersInGame} from "../actions/getPlayersInGame";

const GameViewServer = ({gameId}: {gameId: number}) => {
  const token = cookies().get('token');
  if (!token) redirect('/');

  const queryClient = new QueryClient();
  queryClient.prefetchQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGame(token.value, gameId)
  })
  queryClient.prefetchQuery({
    queryKey: ['playersInGame', gameId],
    queryFn: () => getPlayersInGame(token.value, gameId)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GameViewClient gameId={gameId} tokenValue={token.value}/>
    </HydrationBoundary>
  )
}

export default GameViewServer