'use client'

import {Button} from "./ui/button";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "./ui/table";
import {Badge} from "./ui/badge";
import GameDeleteBtn from "./game-delete-btn";
import AddGuestBox from "./add-guest-box";
import GameMemberRow from "./game-member-row";
import GameStatusStartBtn from "./game-status-start-btn";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getGame} from "../actions/getGame";
import {getPlayersInGame} from "../actions/getPlayersInGame";
import {AddPlayerBoxClient} from "./add-player-box-client";
import GameCardContent from "./GameCardContent";
import PointsCard from "./points-card";

const GameViewClient = ({gameId, tokenValue}: { gameId: number, tokenValue: string }) => {
  const {data: game, isLoading: isGameLoading} = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGame(tokenValue, gameId)
  })
  const {data: playersInGame, isLoading: isPIGLoading} = useQuery({
    queryKey: ['playersInGame', gameId],
    queryFn: () => getPlayersInGame(tokenValue, gameId)
  })

  if (!game || !playersInGame) return null;
  if (isGameLoading || isPIGLoading) return null;



  return (

    <div className="flex flex-col h-full p-4">
      <div className="mb-4 flex justify-end items-center">
        <Button className="text-white bg-blue-500" asChild>
          <Link href={"/spill"}>
            Tilbake til Spilladministrasjon
          </Link>
        </Button>
      </div>
      <main>
        {game.status === 'started' && <PointsCard gameId={gameId} tokenValue={tokenValue}/>}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{game.game_name}</CardTitle>
                {game.status === 'started' && (
                  <Badge className="bg-green-500 text-white">Aktivt</Badge>
                )}
                {game.status === 'pending' && (
                  <Badge className="bg-yellow-500 text-white">Ventende</Badge>
                )}
                {game.status === 'finished' && (
                  <Badge className="bg-red-500 text-white">Fullført</Badge>
                )}
              </div>
              <GameDeleteBtn gameId={game.id} tokenValue={tokenValue}/>
            </div>
          </CardHeader>
          <GameCardContent game={game}/>
        </Card>
      </main>
      <aside className="mt-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Spillere</h2>
          </CardHeader>
          <CardContent>
            {game.status === 'pending' && <AddPlayerBoxClient tokenValue={tokenValue} gameId={gameId}/>}
            {game.status === 'pending' && <AddGuestBox gameId={game.id} tokenValue={tokenValue}/>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Medlem/Gjest</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersInGame.players.map((player) => (
                  <GameMemberRow gamePlayerId={player.id} name={player.name} key={player.id} tokenValue={tokenValue}
                                 type={player.type} disableDelete={game.status !== 'pending'}/>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </aside>
      {game.status === 'pending' && (
        <div className="mt-4 flex justify-end items-center">
          <GameStatusStartBtn gameId={game.id} tokenValue={tokenValue}/>
        </div>
      )}
    </div>
  )
}

export default GameViewClient;