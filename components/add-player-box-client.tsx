"use client"

import * as React from "react"

import { useMediaQuery } from "../hooks/use-media-query"
import { Button } from "./ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "./ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {User} from "../db/schema";
import {addMemberToGame} from "../actions/addMemberToGame";
import {getMembersNotInGame} from "../actions/getMembersNotInGame";

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
              onSelect={async () => {
                await addMemberToGame(tokenValue, gameId, player.id)
                await queryClient.invalidateQueries({queryKey: ['membersNotInGame', gameId]})
                setOpen(false)
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
