'use client'

import {Button} from "./ui/button";
import {useTransition} from "react";
import {changeGameState} from "../actions/changeGameState";
import {Loader2} from "lucide-react";

const GameStatusStartBtn = ({tokenValue, gameId}: {tokenValue: string, gameId: number}) => {
  const [isPending, startTransition] = useTransition();
  const handleStart = async () => {
    startTransition(async () => {
      const resp = await changeGameState(tokenValue, gameId, 'started');
    });
  }

  return (
    <Button
      className="text-white bg-green-500"
      onClick={() => handleStart()}
      disabled={isPending}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Start spill
    </Button>
  )
}

export default GameStatusStartBtn