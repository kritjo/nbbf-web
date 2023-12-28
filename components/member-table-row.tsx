import {TableCell, TableRow} from "./ui/table";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogTrigger} from "./ui/dialog";
import {Button} from "./ui/button";
import {Label} from "./ui/label";
import {Input} from "./ui/input";
import FormSubmitButton from "./ui/form-submit-button";
import {User} from "../db/schema";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {updateMember} from "../actions/updateMember";
import {useFormState} from "react-dom";

const MemberTableRow = ({ member, token, authenticatedUser }: {member: User, token: RequestCookie, authenticatedUser: User}) => {
  const updateMemberWithToken = updateMember.bind(null, token.value);
  const [formState, formAction] = useFormState(updateMemberWithToken, null);

  return (
    <TableRow key={member.id}>
      <TableCell>{member.email}</TableCell>
      <TableCell>{member.full_name}</TableCell>
      <TableCell>{member.role}</TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form action={formAction}>
              <Label htmlFor="full_name">Fullt navn</Label>
              <Input type="text" name={"full_name"} required className="mb-1" defaultValue={member.full_name}/>
              {formState?.errors?.full_name && (
                <div id="name-error" style={{color: `#dc2626`}}>
                  {formState.errors.full_name.join(',')}
                </div>
              )}
              <Label htmlFor="full_name">E-post addresse</Label>
              <Input type="email" placeholder="" name={"email"} required className="mb-1" defaultValue={member.email}/>
              {formState?.errors?.email && (
                <div id="name-error" style={{color: `#dc2626`}}>
                  {formState.errors.email.join(',')}
                </div>
              )}
              {
                authenticatedUser.role === 'admin' && (
                  <>
                    <Label htmlFor="role">Rolle</Label>
                    <Input type="text" placeholder="" name={"role"} required className="mb-1" defaultValue={member.role}/>
                    {formState?.errors?.role && (
                      <div id="name-error" style={{color: `#dc2626`}}>
                        {formState.errors.role.join(',')}
                      </div>
                    )}
                  </>
                )
              }
              <FormSubmitButton>
                Send inn
              </FormSubmitButton>
            </form>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )
}

export default MemberTableRow