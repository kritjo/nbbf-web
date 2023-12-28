'use client'

import {Dialog, DialogContent, DialogTrigger} from "./ui/dialog";
import {Button} from "./ui/button";
import {Label} from "./ui/label";
import {Input} from "./ui/input";
import {Checkbox} from "./ui/checkbox";
import FormSubmitButton from "./ui/form-submit-button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "./ui/card";
import {Badge} from "./ui/badge";
import Link from "next/link";
import {updateMember} from "../actions/updateMember";
import {useFormState} from "react-dom";
import {User} from "../db/schema";

const GameManager = ({user, tokenValue}: {user: User, tokenValue: string}) => {
  const updateMemberWithToken = updateMember.bind(null, tokenValue);
  const [formState, formAction] = useFormState(updateMemberWithToken, null);

  return (
    <div className="flex flex-col h-full p-4">

      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Game Manager</h1>
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
                          disabled={user.role === 'admin'}/>
                <Label htmlFor="official">Offisielt spill</Label>
                {formState?.errors?.role && (
                  <div id="name-error" style={{color: `#dc2626`}}>
                    {formState.errors.role.join(',')}
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Game 1</CardTitle>
                <Badge className="bg-blue-500 text-white">Creator</Badge>
              </div>
              <Badge className="bg-green-500 text-white">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              Created by: <Link href="#">Creator 1</Link>
            </p>
            <p>
              Number of players: <span className="font-bold">5</span>
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span>Started: 2 days ago</span>
            <Button className="text-blue-500 border-blue-500" variant="outline">
              View
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Game 2</CardTitle>
                <Badge className="bg-gray-500 text-white">Participant</Badge>
              </div>
              <Badge className="bg-red-500 text-white">Inactive</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              Created by: <Link href="#">Creator 2</Link>
            </p>
            <p>
              Number of players: <span className="font-bold">3</span>
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span>Started: 1 week ago</span>
            <Button className="text-blue-500 border-blue-500" variant="outline">
              View
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Game 3</CardTitle>
                <Badge className="bg-gray-500 text-white">Participant</Badge>
              </div>
              <Badge className="bg-yellow-500 text-white">Pending</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p>
              Created by: <Link href="#">Creator 3</Link>
            </p>
            <p>
              Number of players: <span className="font-bold">7</span>
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span>Started: 5 days ago</span>
            <Button className="text-blue-500 border-blue-500" variant="outline">
              View
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default GameManager