'use client'

import {TableCell, TableRow} from "./ui/table";
import {Button} from "./ui/button";
import {useTransition} from "react";
import {deleteGameUser} from "../actions/deleteGameUser";
import {Loader2} from "lucide-react";

const GameMemberRow = ({gamePlayerId, name, tokenValue, type, disableDelete}: {gamePlayerId: number, name: string, tokenValue: string, type: string, disableDelete: boolean}) => {
  const [isPending, startTransition] = useTransition();

  const removeMember = async () => {
    startTransition(async () => {
      const success = await deleteGameUser(tokenValue, gamePlayerId);
      if (!success) alert('Noe gikk galt');
    })
  }

  return (
    <TableRow key={gamePlayerId}>
      <TableCell>{name}</TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>
        {!disableDelete && <Button variant="outline" className="text-red-500" onClick={() => removeMember()} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
          Fjern
        </Button>}
      </TableCell>
    </TableRow>
  )
}

export default GameMemberRow