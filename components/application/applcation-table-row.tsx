'use client'

import {ReactNode, useState, useTransition} from "react";
import {applcationAction} from "../../actions/applicationAction";
import {TableCell, TableRow} from "../ui/table";
import {Dialog, DialogContent, DialogTrigger} from "../ui/dialog";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {Separator} from "../ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog";
import {Button} from "../ui/button";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {Loader2} from "lucide-react";
import {ApplicationAction, GetApplicationsResponse} from "../../actions/common";
import {useQueryClient} from "@tanstack/react-query";


export type ApplcationTableRowProps = {
  application_joined: GetApplicationsResponse,
  token: RequestCookie
}

const ApplcationTableRow = ({ application_joined, token }: ApplcationTableRowProps): ReactNode => {
  const application = application_joined.applications;
  const status_by = application_joined.users;
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleApplicationAction = async (action: ApplicationAction) => {
    startTransition(async () => {
      const resp = await applcationAction(token.value, application.id, action);
      await queryClient.invalidateQueries({queryKey: ['applications']});
      await queryClient.invalidateQueries({queryKey: ['members']});
      if (resp.success) {
        setOpen(false);
      } else {
        alert('Noe gikk galt. Vennligst prøv igjen senere.');
        console.error(resp);
      }
    });
  };

  return (
    <TableRow key={application.id}
              className={application.status === 'pending' ? "" : application.status === 'approved' ? "bg-green-900" : "bg-red-900"}
    >
      <TableCell>{application.email}</TableCell>
      <TableCell>{application.full_name}</TableCell>
      <TableCell>{application.title}</TableCell>
      <TableCell>{application.status}</TableCell>
      <TableCell>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>Åpne</DialogTrigger>
          <DialogContent>
            <form>
              <Label htmlFor="full_name">Fullt navn</Label>
              <Input type="text" name={"full_name"} value={application.full_name} disabled className="mb-1"/>

              <Label htmlFor="email">E-post addresse</Label>
              <Input type="email" placeholder="" name={"email"} value={application.email} disabled
                     className="mb-1"/>

              <Label htmlFor="title">Søknadens tittel</Label>
              <Input type="text" placeholder="" name={"title"} value={application.title} disabled
                     className="mb-1"/>

              <Label htmlFor="content">Søknadens innhold</Label>
              <Textarea name={"content"} value={application.content} disabled className="mb-1"/>
            </form>

            <Separator orientation="horizontal" className="my-5"/>

            {application.status === 'pending' && <div className="flex justify-around">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isPending}>
                          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Avslå
                        </Button>
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
                            <AlertDialogAction
                                onClick={() => handleApplicationAction(ApplicationAction.rejected)}
                                disabled={isPending}
                            >
                              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Avslå søknad
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="default" disabled={isPending}>
                          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Godkjenn
                        </Button>
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
                            <AlertDialogAction
                                onClick={() => handleApplicationAction(ApplicationAction.approved)}
                                disabled={isPending}
                            >
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Godkjenn søknad
                            </AlertDialogAction>
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
  )
}

export default ApplcationTableRow