import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import GameViewClient from "../../../components/game-view-client";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {getGame} from "../../../actions/getGame";
import {getPlayersInGame} from "../../../actions/getPlayersInGame";
import {getMembersNotInGame} from "../../../actions/getMembersNotInGame";

export default function GameInstance({ params }: { params: { id: string } }) {
  const { id } = params;
  const gameId = parseInt(id);
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
  queryClient.prefetchQuery({
    queryKey: ['membersNotInGame', gameId],
    queryFn: () => getMembersNotInGame(token.value, gameId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GameViewClient gameId={gameId} tokenValue={token.value}/>
    </HydrationBoundary>
  )
}
