'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import {Input} from "./ui/input";
import {sendMagicLink} from "../actions/sendMagicLink";
import { useFormState } from "react-dom";
import FormSubmitButton from "./ui/form-submit-button";

const SigninDialog = () => {
  const [formState, formAction] = useFormState(sendMagicLink, null);

  return (
    <Dialog>
      <DialogTrigger>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logg inn</DialogTitle>
        </DialogHeader>
        {formState?.success ? (
          <DialogDescription>
            Dersom du har en konto hos oss, vil du motta en e-post med en lenke for å logge inn.
          </DialogDescription>
        ) : (
          <>
            {/* @ts-ignore */}
            <form action={formAction}>
              <Input type="email" placeholder="E-post" name={"email"} required/>
              {formState?.errors?.email && (
                <div id="name-error" style={{color: `#dc2626`}}>
                  {formState.errors.email.join(',')}
                </div>
              )}
              <FormSubmitButton>
                Send lenke
              </FormSubmitButton>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SigninDialog