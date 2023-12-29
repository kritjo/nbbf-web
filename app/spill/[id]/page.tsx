import { Button } from "../../../components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import {use} from "react";
import {getGame} from "../../../actions/getGame";
import {cookies} from "next/headers";
import {notFound, redirect} from "next/navigation";
import GameDeleteBtn from "../../../components/game-delete-btn";
import {AddPlayerBoxServer} from "../../../components/add-player-box-server";
import AddGuestBox from "../../../components/add-guest-box";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "../../../components/ui/table";
import {getMembersInGame} from "../../../actions/getMembersInGame";
import {getGuestsInGame} from "../../../actions/getGuestsInGame";
import GameMemberRow from "../../../components/game-member-row";

export default function GameInstance({ params }: { params: { id: string } }) {
  const { id } = params;
  const token = cookies().get('token');
  if (!token) redirect('/');
  const game = use(getGame(token.value, parseInt(id)));
  if (!game) notFound();
  const membersInGame = use(getMembersInGame(token.value, parseInt(id)));
  const guestsInGame = use(getGuestsInGame(token.value, parseInt(id)));


  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4 flex justify-end items-center">
        <Button className="text-white bg-blue-500">Tilbake til Spilladministrasjon</Button>
      </div>
      <main>
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
              <GameDeleteBtn gameId={game.id} tokenValue={token.value}/>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              Opprettet av: {game.creator_name}
            </p>
            <p>
              Antall spillere: {game.players}
            </p>
            <p>
              Antall runder spilt: {game.rounds}
            </p>
            <p>
              Offisielt spill: {game.official ? 'Ja' : 'Nei'}
            </p>
          </CardContent>
        </Card>
      </main>
      <aside className="mt-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Spillere</h2>
          </CardHeader>
          <CardContent>
            <AddPlayerBoxServer gameId={game.id}/>
            <AddGuestBox gameId={game.id} tokenValue={token.value}/>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Medlem/Gjest</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersInGame?.map((member) => (
                  <GameMemberRow gamePlayerId={member.id} name={member.full_name} key={member.id} tokenValue={token.value} type="Medlem"/>
                ))}
                {guestsInGame?.map((guest) => (
                  <GameMemberRow gamePlayerId={guest.gamePlayersId} name={guest.guest_name} key={guest.gamePlayersId} tokenValue={token.value} type="Gjest"/>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

