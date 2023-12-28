'use client'

import {Dialog, DialogContent, DialogTrigger} from "./ui/dialog";
import {Button} from "./ui/button";
import {Label} from "./ui/label";
import {Input} from "./ui/input";
import {Checkbox} from "./ui/checkbox";
import FormSubmitButton from "./ui/form-submit-button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "./ui/card";
import {Badge} from "./ui/badge";
import {useFormState} from "react-dom";
import {User} from "../db/schema";
import {GetGamesResponse} from "../actions/common";
import Link from "next/link";
import {createGame} from "../actions/createGame";

const GameManager = ({user, tokenValue, games}: {user: User, tokenValue: string, games: GetGamesResponse[]}) => {
  const createGameWithToken = createGame.bind(null, tokenValue);
  const [formState, formAction] = useFormState(createGameWithToken, null);

  return (
    <div className="flex flex-col h-full p-4">

      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Spilladministrasjon</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white bg-blue-500">Nytt spill</Button>
          </DialogTrigger>
          <DialogContent>
            <form action={formAction}>
              <Label htmlFor="name">Spillets navn</Label>
              <Input type="text" name={"name"} required className="mb-1"/>
              {formState?.errors?.name && (
                <div id="name-error" style={{color: `#dc2626`}}>
                  {formState.errors.name.join(',')}
                </div>
              )}
              <div className="flex items-center gap-2 mt-[1rem]">
                <Checkbox name="official"
                          disabled={user.role === 'medlem'}/>
                <Label htmlFor="official">Offisielt spill</Label>
                {formState?.errors?.official && (
                  <div id="name-error" style={{color: `#dc2626`}}>
                    {formState.errors.official.join(',')}
                  </div>
                )}
              </div>
              <FormSubmitButton>
                Send inn
              </FormSubmitButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map(game => (
          <Card key={game.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{game.game_name}</CardTitle>
                  {game.created_by === user.id ? (
                    <Badge className="bg-blue-500 text-white">Skaper</Badge>
                  ) : (
                    <Badge className="bg-gray-500 text-white">Deltager</Badge>
                  )}
                </div>
                {game.status === 'started' && (
                  <Badge className="bg-green-500 text-white">Aktivt</Badge>
                )}
                {game.status === 'pending' && (
                  <Badge className="bg-yellow-500 text-white">Ventende</Badge>
                )}
                {game.status === 'finished' && (
                  <Badge className="bg-red-500 text-white">Fullført</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Opprettet av: {game.creator_name}
              </p>
              <p>
                Antall spillere: {game.players}
              </p>
              <p>
                Antall runder spilt: {game.rounds}
              </p>
              <p>
                Offisielt spill: {game.official ? 'Ja' : 'Nei'}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span>Started: {game.created_at.toLocaleDateString("no-NO")}</span>
              <Button className="text-blue-500 border-blue-500" variant="outline" asChild>
                <Link href={`/spill/${game.id}`}>
                  Se
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default GameManager