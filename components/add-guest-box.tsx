'use client'

import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "./ui/dialog";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {useState, useTransition} from "react";
import {Loader2} from "lucide-react";
import {addMemberToGame} from "../actions/addMemberToGame";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {PlayersInGameResponse} from "../actions/common";

const AddGuestBox = ({gameId, tokenValue}: {gameId: number, tokenValue: string}) => {
  const [open, setOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleAddGuest = useMutation({
    mutationFn: (guestName: string) => addMemberToGame(tokenValue, gameId, -1, guestName),
    onMutate: async (newGuest) => {
      setIsPending(true);
      await queryClient.cancelQueries({queryKey: ['playersInGame', gameId]});
      const previousPlayersInGame= queryClient.getQueryData<PlayersInGameResponse>(['playersInGame', gameId]);
      if (!previousPlayersInGame) throw new Error('Missing previousPlayersInGame, while handling onMutate in handleAddGuest mutation');
      queryClient.setQueryData<PlayersInGameResponse>(['playersInGame', gameId], (old) => {
        if (!old) throw new Error('Missing old, while handling onMutate in handleAddGuest mutation');
        return {
          ...old,
          players: [...old.players, {
            id: -1,
            name: newGuest,
            type: 'gjest',
            userId: null,
          }]
        }
      });
      return { previousPlayersInGame };
    },
    onError: (err, newGuest, context) => {
      console.log(err);
      if (context?.previousPlayersInGame === undefined) {
        throw new Error('Missing context.previousMembers, while handling error in handleAddGuest mutation')
      }
      queryClient.setQueryData(['membersNotInGame', gameId], context.previousPlayersInGame);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['membersNotInGame', gameId]});
      setOpen(false);
    },
    onSettled: () => {
      setIsPending(false);
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="m-2">
          Legg til gjest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Legg til gjest</DialogTitle>
        <Input placeholder="Navn på gjest" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
        <Button
          className="mt-4"
          onClick={() => handleAddGuest.mutate(guestName)}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Legg til
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default AddGuestBox