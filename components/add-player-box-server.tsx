'use server'

import {QueryClient} from "@tanstack/react-query";
import {getMembers} from "../actions/getMembers";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {AddPlayerBoxClient} from "./add-player-box-client";
import {getMembersNotInGame} from "../actions/getMembersNotInGame";

export async function AddPlayerBoxServer({gameId}: {gameId: number}) {
  const token = cookies().get('token');
  if (!token) redirect('/')
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['membersNotInGame', gameId],
    queryFn: () => getMembersNotInGame(token.value, gameId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AddPlayerBoxClient tokenValue={token.value} gameId={gameId} />
    </HydrationBoundary>
  )
}