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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../components/ui/table";
import GameMemberRow from "../../../components/game-member-row";
import Link from "next/link";
import GameStatusStartBtn from "../../../components/game-status-start-btn";
import {getPlayersInGame} from "../../../actions/getPlayersInGame";
import {Input} from "../../../components/ui/input";

const calculatePoints = (game_round_player: {id: number, game_round: number, game_player: number, bid: number, tricks: number, created_at: Date}) => {
  if (game_round_player.bid === 0 && game_round_player.tricks === 0) {
    return 5;
  } else if (game_round_player.bid ===  game_round_player.tricks) {
    return 10 + game_round_player.bid;
  } else {
    return 0;
  }
}

export default function GameInstance({ params }: { params: { id: string } }) {
  const { id } = params;
  const token = cookies().get('token');
  if (!token) redirect('/');
  const game = use(getGame(token.value, parseInt(id)));
  if (!game) notFound();
  const playersInGame = use(getPlayersInGame(token.value, parseInt(id)));

  if (!playersInGame) {
    return (
        <div className="mb-4 flex justify-end items-center">
          <Button className="text-white bg-blue-500" asChild>
            <Link href={"/spill"}>
              Tilbake til Spilladministrasjon
            </Link>
          </Button>
        </div>
    )
  }

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
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>
                  {game.waiting_for === 'bids' && 'Venter på bud'}
                  {game.waiting_for === 'tricks' && 'Venter på stikk'}
                  {game.waiting_for === 'finished' && 'Venter på neste runde'}
                </CardTitle>
              </div>
              <Button className="text-white bg-blue-500">
                {game.waiting_for === 'bids' && 'Gjør bud'}
                {game.waiting_for === 'tricks' && 'Bekreft stikk'}
                {game.waiting_for === 'finished' && 'Neste runde'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Spiller</TableHead>
                  <TableHead>Poeng</TableHead>
                  <TableHead>Bud</TableHead>
                  <TableHead>Stikk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersInGame.players.map((player, i) => {
                  const playerPoints = playersInGame.rounds.reduce((acc, round) => {
                    if (round.game_players?.id === player.id && round.game_rounds?.wait_for === 'finished') {
                      return acc + calculatePoints(round.game_round_players);
                    }
                    return acc;
                  }, 0);

                  const playerCurrentRound = playersInGame.rounds.find((round) => {
                    return round.game_players?.id === player.id;
                  });

                  return (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{playerPoints}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name={"bid"}
                          required
                          className="w-[5rem]"
                          disabled={game.waiting_for !== 'bids'}
                          value={playerCurrentRound?.game_round_players.bid || 0}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name={"tricks"}
                          required
                          className="w-[5rem]"
                          disabled={game.waiting_for !== 'tricks'}
                          value={playerCurrentRound?.game_round_players.tricks || 0}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
                {playersInGame.players.map((player) => (
                  <GameMemberRow gamePlayerId={player.id} name={player.name} key={player.id} tokenValue={token.value} type={player.type}/>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </aside>
      { game.status === 'pending' && (
        <div className="mt-4 flex justify-end items-center">
          <GameStatusStartBtn gameId={game.id} tokenValue={token.value}/>
        </div>
      )}
    </div>
  )
}

