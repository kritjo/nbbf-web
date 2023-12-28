import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {use} from "react";
import {getApplications} from "../../actions/getApplications";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "../../components/ui/dialog";
import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import {Textarea} from "../../components/ui/textarea";
import {Separator} from "../../components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../../components/ui/alert-dialog";
import {Button} from "../../components/ui/button";

export default function Soknader() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const applications = use(getApplications(token.value));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>E-post</TableHead>
          <TableHead>Fullt navn</TableHead>
          <TableHead>Tittel</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications?.map(application_joined => {
          const application = application_joined.applications;
          const status_by = application_joined.users;

          return (
          <TableRow key={application.id}
                    className={application.status === 'pending' ? "" : application.status === 'approved' ? "bg-green-900" : "bg-red-900"}

          >
            <TableCell>{application.email}</TableCell>
            <TableCell>{application.full_name}</TableCell>
            <TableCell>{application.title}</TableCell>
            <TableCell>{application.status}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger>Åpne</DialogTrigger>
                <DialogContent>
                  <form>
                    <Label htmlFor="full_name">Fullt navn</Label>
                    <Input type="text" name={"full_name"} value={application.full_name} disabled className="mb-1"/>

                    <Label htmlFor="full_name">E-post addresse</Label>
                    <Input type="email" placeholder="" name={"email"} value={application.email} disabled
                           className="mb-1"/>

                    <Label htmlFor="title">Søknadens tittel</Label>
                    <Input type="text" placeholder="" name={"title"} value={application.title} disabled
                           className="mb-1"/>

                    <Label htmlFor="body">Søknadens innhold</Label>
                    <Textarea name={"content"} value={application.content} disabled className="mb-1"/>
                  </form>

                  <Separator orientation="horizontal" className="my-5"/>

                  {application.status === 'pending' && <div className="flex justify-around">
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="destructive">Avslå</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Er du sikker på at du vil avslå søknaden?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Dette er en permanent handling, og kan ikke reverseres.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                  <AlertDialogAction>Avslå søknad</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="default">Godkjenn</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Er du sikker på at du vil godkjenne søknaden?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Dette er en permanent handling, og kan ikke reverseres.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                  <AlertDialogAction>Godkjenn søknad</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                  </div>}
                  {application.status !== 'pending' && <div>
                      <p className="text-center">Denne søknaden er allerede {application.status}.</p>
                      <p className="text-center">Behandler: {status_by?.full_name ?? 'ukjent'}</p>
                      <p className="text-center">Behandlet tidspunkt: {application.status_at?.toString() ?? 'ukjent'}</p>
                  </div>}
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
    </Table>
  )
}