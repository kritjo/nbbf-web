'use client'

import {Button} from "./ui/button";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {Input} from "./ui/input";
import {Badge} from "./ui/badge";
import GameDeleteBtn from "./game-delete-btn";
import AddGuestBox from "./add-guest-box";
import GameMemberRow from "./game-member-row";
import GameStatusStartBtn from "./game-status-start-btn";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getGame} from "../actions/getGame";
import {getPlayersInGame} from "../actions/getPlayersInGame";
import {setBidsTricks} from "../actions/setBidsTricks";
import {PlayersInGameResponse} from "../actions/common";
import {AddPlayerBoxClient} from "./add-player-box-client";
import {useState} from "react";
import {changeRoundState} from "../actions/changeRoundState";
import {RoundWaitFor} from "../db/schema";
import {newRound} from "../actions/newRound";
import GameCardContent from "./GameCardContent";

const calculatePoints = (game_round_player: {id: number, game_round: number, game_player: number, bid: number, tricks: number, created_at: Date}) => {
  if (game_round_player.bid === 0 && game_round_player.tricks === 0) {
    return 5;
  } else if (game_round_player.bid ===  game_round_player.tricks) {
    return 10 + game_round_player.bid;
  } else {
    return 0;
  }
}

const GameViewClient = ({gameId, tokenValue}: { gameId: number, tokenValue: string }) => {
  const queryClient = useQueryClient();
  const {data: game, isLoading: isGameLoading} = useQuery({queryKey: ['game', gameId], queryFn: () => getGame(tokenValue, gameId)})
  const {data: playersInGame, isLoading: isPIGLoading} = useQuery({queryKey: ['playersInGame', gameId], queryFn: () => getPlayersInGame(tokenValue, gameId)})
  const [isPending, setIsPending] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (update: {gameRoundPlayer: number, bids: number, tricks: number}) => {
      return setBidsTricks(tokenValue, update.gameRoundPlayer, update.bids, update.tricks)
    },
    onMutate: async (newGameRoundPlayer) => {
      await queryClient.cancelQueries({ queryKey: ['playersInGame', gameId] })
      const previousUsers = queryClient.getQueryData<PlayersInGameResponse>(['playersInGame', gameId])
      if (previousUsers === undefined) throw new Error('Missing previousUsers')
      queryClient.setQueryData<PlayersInGameResponse>(['playersInGame', gameId], (old) => {
        if (old === undefined) throw new Error('Missing old')
        if (old?.rounds === undefined) throw new Error('Missing old.rounds')
        if (old?.players === undefined) throw new Error('Missing old.players')

        return {
          ...old,
          rounds: old?.rounds.map((round) => {
            if (round.game_round_players.id === newGameRoundPlayer.gameRoundPlayer) {
              return {
                ...round,
                game_round_players: {
                  ...round.game_round_players,
                  bid: newGameRoundPlayer.bids,
                  tricks: newGameRoundPlayer.tricks
                }
              }
            } else {
              return round
          }
        })}
      })
      return {previousUsers}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['playersInGame', gameId]})
    },
    onError: (err, _, context) => {
      console.log(err)
      if (context?.previousUsers === undefined) {
        throw new Error('Missing context.previousUsers, while handling error in updateMutation')
      }
      queryClient.setQueryData(['playersInGame', gameId], context.previousUsers)
    },
  })

  const handleNextAction = useMutation({
    mutationFn: (nextAction: RoundWaitFor) => changeRoundState(tokenValue, gameId, nextAction),
    onMutate: async () => {
      setIsPending(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['playersInGame', gameId]})
      queryClient.invalidateQueries({queryKey: ['game', gameId]})
    },
    onError: (err) => {
      console.log(err)
    },
    onSettled: () => {
      setIsPending(false);
    }
  })

  const handleNewRound = useMutation({
    mutationFn: () => newRound(tokenValue, gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['game', gameId]});
      queryClient.invalidateQueries({queryKey: ['playersInGame', gameId]});
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {
      setIsPending(false);
    }
  })

  if (!game || !playersInGame) return null;
  if (isGameLoading || isPIGLoading) return null;

  const max_rounds = Math.round(52 / game.players) * 2;
  let cards_this_round;
  if (max_rounds / 2 >= game.rounds) {
    cards_this_round = game.rounds;
  } else {
    cards_this_round = max_rounds - game.rounds + 1;
  }

  const bets_this_round = playersInGame.rounds.filter((round) => {
    return round.game_rounds?.round === game.rounds;
  }).reduce((acc, round) => {
    return acc + round.game_round_players.bid;
  }, 0);

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
        {game.waiting_for !== null && <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>
                  <div className="flex justify-around">
                      <p>
                       {game.waiting_for === 'bids' && 'Venter på bud'}
                        {game.waiting_for === 'tricks' && 'Venter på stikk'}
                        {game.waiting_for === 'finished' && game.rounds !== max_rounds && 'Venter på neste runde'}
                      </p>
                  </div>
                </CardTitle>
              </div>
              {game.waiting_for !== 'finished' &&
                  <Button
                      className="text-white bg-blue-500"
                      disabled={
                        queryClient.isMutating({mutationKey: ['playersInGame', gameId]}) > 0
                        || isPending
                      }
                      onClick={() => handleNextAction.mutate(game.waiting_for === 'bids' ? 'tricks' : 'finished')}
                  >
                    {game.waiting_for === 'bids' && 'Gjør bud'}
                    {game.waiting_for === 'tricks' && 'Bekreft stikk'}
                  </Button>
              }
              {game.waiting_for === 'finished' &&
                  <Button
                      className="text-white bg-blue-500"
                      disabled={isPending || game.rounds === max_rounds}
                      onClick={() => handleNewRound.mutate()}
                  >
                    {game.rounds === max_rounds ? 'Ingen flere runder' : 'Neste runde'}
                  </Button>
              }
            </div>
            <p>
                Runde {game.rounds}/{max_rounds} ({cards_this_round} kort denne runden)
            </p>
            { game.waiting_for !== 'bids' &&
                <p>
                    {bets_this_round > cards_this_round ?
                      'Overmeldt' : bets_this_round === cards_this_round ?
                      'Meldt riktig' : 'Undermeldt'
                    }
                </p>
            }
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
                    return round.game_players?.id === player.id && round.game_rounds?.wait_for === game.waiting_for;
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
                          onChange={(e) => {
                            if (!playerCurrentRound?.game_round_players.id) throw new Error('Missing game_round_player.id')
                            updateMutation.mutate({
                              gameRoundPlayer: playerCurrentRound?.game_round_players.id,
                              bids: parseInt(e.target.value),
                              tricks: playerCurrentRound?.game_round_players.tricks || 0
                            })
                          }}
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
                          onChange={(e) => {
                            if (!playerCurrentRound?.game_round_players.id) throw new Error('Missing game_round_player.id')
                            updateMutation.mutate({
                              gameRoundPlayer: playerCurrentRound?.game_round_players.id,
                              bids: playerCurrentRound?.game_round_players.bid || 0,
                              tricks: parseInt(e.target.value)
                            })
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>}
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