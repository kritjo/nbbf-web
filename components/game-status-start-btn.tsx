'use client'

import {Button} from "./ui/button";
import {useState} from "react";
import {changeGameState} from "../actions/changeGameState";
import {Loader2} from "lucide-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {newRound} from "../actions/newRound";

const GameStatusStartBtn = ({tokenValue, gameId}: {tokenValue: string, gameId: number}) => {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

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

  const handleStart = useMutation({
    mutationFn: () => changeGameState(tokenValue, gameId, 'started'),
    onMutate: async () => {
      setIsPending(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['game', gameId]});
      handleNewRound.mutate();
    },
    onError: (err) => {
      console.log(err);
      setIsPending(false);
    },
  })

  return (
    <Button
      className="text-white bg-green-500"
      onClick={() => handleStart.mutate()}
      disabled={isPending}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Start spill
    </Button>
  )
}

export default GameStatusStartBtn