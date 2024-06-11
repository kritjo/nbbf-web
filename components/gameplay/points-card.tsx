import {Card, CardContent, CardHeader, CardTitle} from "../ui/card";
import {Button} from "../ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Slider} from "../ui/slider";
import {Input} from "../ui/input";
import {Switch} from "../ui/switch";
import {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {newRound} from "../../actions/newRound";
import {setBidsTricks} from "../../actions/setBidsTricks";
import {PlayersInGameResponse} from "../../actions/common";
import {getGame} from "../../actions/getGame";
import {getPlayersInGame} from "../../actions/getPlayersInGame";

enum WaitingFor {
  Bids = 0,
  Tricks = 1,
  NewRound = 2,
}

const calculatePoints = (game_round_player: {id: number, game_round: number, game_player: number, bid: number, managed: boolean, created_at: Date}) => {
  if (game_round_player.bid === 0 && game_round_player.managed) {
    return 5;
  } else if (game_round_player.managed) {
    return 10 + game_round_player.bid;
  } else {
    return 0;
  }
}

const PointsCard = ({gameId, tokenValue}: { gameId: number, tokenValue: string }) => {
  const queryClient = useQueryClient();
  const [gameRoundState, setGameRoundState] = useState(0);
  const [waitingFor, setWaitingFor] = useState(WaitingFor.Bids);
  const [isPending, setIsPending] = useState(false);

  const {data: game, isLoading: isGameLoading} = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => getGame(tokenValue, gameId),
  });

  useEffect(() => {
    if (game?.rounds) {
      setGameRoundState(game.rounds);
    }
  }, [game?.rounds]);

  const {data: playersInGame, isLoading: isPIGLoading} = useQuery({
    queryKey: ['playersInGame', gameId],
    queryFn: () => getPlayersInGame(tokenValue, gameId)
  });

  const handleNewRound = useMutation({
    mutationFn: () => newRound(tokenValue, gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['game', gameId]});
      queryClient.invalidateQueries({queryKey: ['playersInGame', gameId]});

      setGameRoundState((prev) => prev + 1);
      setWaitingFor(WaitingFor.Bids);
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {
      setIsPending(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (update: {gameRoundPlayer: number, bids: number, managed: boolean}) => {
      return setBidsTricks(tokenValue, update.gameRoundPlayer, update.bids, update.managed)
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
                  managed: newGameRoundPlayer.managed,
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
  });

  if (!game || !playersInGame) return null;
  if (isGameLoading || isPIGLoading) return null;

  const bets_this_round = playersInGame.rounds.filter((round) => {
    return round.game_rounds?.round === gameRoundState;
  }).reduce((acc, round) => {
    return acc + round.game_round_players.bid;
  }, 0);

  const pointsPerPlayer = playersInGame.players.map((player) => {
    return {
      player: player,
      points: playersInGame.rounds.reduce((acc, round) => {
        if (round.game_players?.id === player.id) {
          return acc + calculatePoints(round.game_round_players);
        }
        return acc;
      }, 0)
    };
  });

  const max_rounds = Math.floor((52 - 1) / game.player_count) * 2;
  let cards_this_round;
  if (max_rounds / 2 >= gameRoundState) {
    cards_this_round = gameRoundState;
  } else {
    cards_this_round = max_rounds - gameRoundState + 1;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>
              <div className="flex justify-around">
                <p>
                  {waitingFor === WaitingFor.Bids && 'Venter på bud'}
                  {waitingFor === WaitingFor.Tricks && 'Venter på stikk'}
                  {waitingFor === WaitingFor.NewRound && gameRoundState !== max_rounds && 'Venter på neste runde'}
                </p>
              </div>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="text-white bg-blue-500"
              disabled={isPending || gameRoundState === 0}
              onClick={() => {
                if (waitingFor === WaitingFor.Bids) {
                  setWaitingFor(WaitingFor.NewRound);
                  setGameRoundState((prev) => prev - 1);
                } else if (waitingFor === WaitingFor.Tricks) {
                  setWaitingFor(WaitingFor.Bids);
                } else if (waitingFor === WaitingFor.NewRound) {
                  setWaitingFor(WaitingFor.Tricks);
                } else {
                  throw new Error('Invalid waitingFor state');
                }
              }}
            >
              Tilbake
            </Button>
            {waitingFor !== WaitingFor.NewRound &&
                <Button
                    className="text-white bg-blue-500"
                    onClick={() => setWaitingFor((prev) => prev + 1)}
                >
                  {waitingFor === WaitingFor.Bids && 'Gjør bud'}
                  {waitingFor === WaitingFor.Tricks && 'Bekreft stikk'}
                </Button>
            }
            {waitingFor === WaitingFor.NewRound &&
                <Button
                    className="text-white bg-blue-500"
                    disabled={isPending || gameRoundState === max_rounds}
                    onClick={() => {
                      if (gameRoundState === game?.rounds)handleNewRound.mutate()
                      else {
                        setWaitingFor(WaitingFor.Bids);
                        setGameRoundState((prev) => prev + 1);
                      }
                    }}
                >
                  {gameRoundState === max_rounds ? 'Ingen flere runder' : 'Neste runde'}
                </Button>
            }
          </div>
        </div>
        <p>
          Runde {gameRoundState}/{max_rounds} ({cards_this_round} kort denne runden)
        </p>
        { waitingFor !== WaitingFor.Bids &&
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
              <TableHead>Poeng totalt</TableHead>
              <TableHead>Bud</TableHead>
              <TableHead>Riktig?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pointsPerPlayer.sort((a, b) => {
              return b.points - a.points;
            }).map((playerWithPoints, i) => {
              const player = playerWithPoints.player;
              const playerPoints = playerWithPoints.points;

              const playerCurrentRound = playersInGame.rounds.find((round) => {
                return round.game_players?.id === player.id && round.game_rounds?.round === gameRoundState;
              });

              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{playerPoints}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-10">
                      <Slider
                        defaultValue={[0]}
                        min={0}
                        max={cards_this_round}
                        step={1}
                        className={"w-full min-w-[10rem]" + (waitingFor !== WaitingFor.Bids ? ' opacity-50' : ' opacity-100')}
                        value={[playerCurrentRound?.game_round_players.bid || 0]}
                        onValueChange={(value) => {
                          if (!playerCurrentRound?.game_round_players.id) throw new Error('Missing game_round_player.id')
                          updateMutation.mutate({
                            gameRoundPlayer: playerCurrentRound?.game_round_players.id,
                            bids: value[0],
                            managed: false,
                          })
                        }}
                        disabled={waitingFor !== WaitingFor.Bids}
                      />
                      <Input
                        type="number"
                        name={"bid"}
                        required
                        className="w-[5rem]"
                        disabled={waitingFor !== WaitingFor.Bids}
                        value={playerCurrentRound?.game_round_players.bid || 0}
                        max={cards_this_round}
                        onChange={(e) => {
                          if (!playerCurrentRound?.game_round_players.id) throw new Error('Missing game_round_player.id')
                          updateMutation.mutate({
                            gameRoundPlayer: playerCurrentRound?.game_round_players.id,
                            bids: parseInt(e.target.value),
                            managed: false,
                          })
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-10">
                    <div className="flex items-center gap-10">
                      <Switch
                        checked={playerCurrentRound?.game_round_players.managed}
                        disabled={waitingFor !== WaitingFor.Tricks}
                        onCheckedChange={(e) => {
                          if (!playerCurrentRound?.game_round_players.id) throw new Error('Missing game_round_player.id')
                          updateMutation.mutate({
                            gameRoundPlayer: playerCurrentRound?.game_round_players.id,
                            bids: playerCurrentRound?.game_round_players.bid,
                            managed: e,
                          })
                        }}
                      />
                      {playerCurrentRound?.game_round_players.managed ? '✅' : '❌'}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default PointsCard;