'use client'

import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "./ui/dialog";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {useState} from "react";
import {Loader2} from "lucide-react";
import {addMemberToGame} from "../actions/addMemberToGame";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const AddGuestBox = ({gameId, tokenValue}: {gameId: number, tokenValue: string}) => {
  const [open, setOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleAddGuest = useMutation({
    mutationFn: (guestName: string) => addMemberToGame(tokenValue, gameId, -1, guestName),
    onMutate: async () => {
      setIsPending(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['playersInGame']});
    },
    onError: (err) => {
      console.log(err);
    },
    onSettled: () => {
      setIsPending(false);
      setOpen(false);
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