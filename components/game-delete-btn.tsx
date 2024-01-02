'use client'

import {Loader2} from "lucide-react";
import {Button} from "./ui/button";
import {useTransition} from "react";
import {deleteGame} from "../actions/deleteGame";
import {redirect} from "next/navigation";

const GameDeleteBtn = ({gameId, tokenValue}: {gameId: number, tokenValue: string}) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const resp = await deleteGame(tokenValue, gameId);
      if (resp) {
        redirect('/spill');
      }
    });
  }

  return (
    <Button
      className="text-white bg-red-500"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Delete
    </Button>
  )
}

export default GameDeleteBtn