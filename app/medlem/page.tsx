import {cookies} from "next/headers";
import {use} from "react";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";
import {redirect} from "next/navigation";
import {Button} from "../../components/ui/button";
import {Card, CardHeader, CardTitle} from "../../components/ui/card";
import {Badge} from "../../components/ui/badge";
import {CardContent, CardFooter} from "../../components/ui/card";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../components/ui/dialog";

export default function Medlem() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const user = use(getAuthenticatedUser(token.value, 'medlem'));

  return (
    <main>
      <div className="flex flex-col h-full p-4">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Game Manager</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white bg-blue-500">Nytt spill</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
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
    </main>
  )
}