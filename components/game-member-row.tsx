'use client'

import {TableCell, TableRow} from "./ui/table";
import {Button} from "./ui/button";
import {useState, useTransition} from "react";
import {deleteGameUser} from "../actions/deleteGameUser";
import {Loader2} from "lucide-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {setBidsTricks} from "../actions/setBidsTricks";
import {PlayersInGameResponse} from "../actions/common";

const GameMemberRow = ({gamePlayerId, name, tokenValue, type, disableDelete}: {gamePlayerId: number, name: string, tokenValue: string, type: string, disableDelete: boolean}) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const removeMember = useMutation({
    mutationFn: () => {
      return deleteGameUser(tokenValue, gamePlayerId);
    },
    onMutate: async (newGameRoundPlayer) => {
      setIsPending(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['playersInGame']});
    },
    onError: (err, newGuest, context) => {
      console.log(err);
    },
    onSettled: () => {
      setIsPending(false);
    }
  })

  return (
    <TableRow key={gamePlayerId}>
      <TableCell>{name}</TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>
        {!disableDelete && <Button variant="outline" className="text-red-500" onClick={() => removeMember.mutate()} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
          Fjern
        </Button>}
      </TableCell>
    </TableRow>
  )
}

export default GameMemberRow