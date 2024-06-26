"use client"

import * as React from "react"

import { useMediaQuery } from "../../hooks/use-media-query"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "../ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {User} from "../../db/schema";
import {addMemberToGame} from "../../actions/addMemberToGame";
import {getMembersNotInGame} from "../../actions/getMembersNotInGame";
import {PlayersInGameResponse} from "../../actions/common";

export function AddPlayerBoxClient({tokenValue, gameId}: {tokenValue: string, gameId: number}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data } = useQuery({ queryKey: ['membersNotInGame', gameId], queryFn: () => getMembersNotInGame(tokenValue, gameId) })

  if (!data) return null; // TODO: Skeleton loader


  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-auto justify-center">
            Legg til medlem
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <PlayerList setOpen={setOpen} players={data} tokenValue={tokenValue} gameId={gameId}/>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-auto justify-center">
          Legg til medlem
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <PlayerList setOpen={setOpen} players={data} tokenValue={tokenValue} gameId={gameId}/>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function PlayerList({
                      setOpen,
                      players,
                      tokenValue,
                      gameId
                    }: {
  setOpen: (open: boolean) => void,
  players: User[],
  tokenValue: string,
  gameId: number
}) {
  const queryClient = useQueryClient();

  const handleAddPlayer = useMutation({
    mutationFn: (update: {playerId: number, playerName: string}) => addMemberToGame(tokenValue, gameId, update.playerId),
    onMutate: async (newGameRoundPlayer) => {
      await queryClient.cancelQueries({ queryKey: ['playersInGame', gameId] })
      const previousUsers = queryClient.getQueryData<PlayersInGameResponse>(['playersInGame', gameId])
      if (previousUsers === undefined) throw new Error('Missing previousUsers')
      queryClient.setQueryData<PlayersInGameResponse>(['playersInGame', gameId], (old) => {
        if (old === undefined) throw new Error('Missing old')
        if (old?.rounds === undefined) throw new Error('Missing old.rounds')
        if (old?.players === undefined) throw new Error('Missing old.players')

        return {
          rounds: old.rounds,
          players: [
            ...old.players,
            {
              id: -1,
              name: newGameRoundPlayer.playerName,
              type: 'medlem',
              userId: newGameRoundPlayer.playerId,
            }
          ]
        }
      })
      const previousNotInGame = queryClient.getQueryData<User[]>(['membersNotInGame', gameId])
      if (previousNotInGame === undefined) throw new Error('Missing previousNotInGame')
      queryClient.setQueryData<User[]>(['membersNotInGame', gameId], (old) => {
        if (old === undefined) throw new Error('Missing old')
        return old.filter((user) => user.full_name !== newGameRoundPlayer.playerName)
      })

      return {previousUsers, previousNotInGame}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['playersInGame', gameId]})
      queryClient.invalidateQueries({queryKey: ['membersNotInGame', gameId]})
    },
    onError: (err, newGuest, context) => {
      console.log(err)
      if (context?.previousUsers === undefined) {
        throw new Error('Missing context.previousUsers, while handling error in updateMutation')
      }
      if (context?.previousNotInGame === undefined) {
        throw new Error('Missing context.previousNotInGame, while handling error in updateMutation')
      }
      queryClient.setQueryData(['playersInGame', gameId], context.previousUsers)
      queryClient.setQueryData(['membersNotInGame', gameId], context.previousNotInGame)
    },
    onSettled: () => {
      setOpen(false)
    }
  })

  return (
    <Command>
      <CommandInput placeholder="Søk etter spiller ..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {players.map((player) => (
            <CommandItem
              key={player.id}
              value={player.full_name}
              onSelect={() => {
                handleAddPlayer.mutate({playerId: player.id, playerName: player.full_name})
              }}
            >
              {player.full_name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
