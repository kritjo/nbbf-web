'use client'

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "./ui/dialog";
import {Button} from "./ui/button";
import {Label} from "./ui/label";
import {Input} from "./ui/input";
import {Textarea} from "./ui/textarea";
import FormSubmitButton from "./ui/form-submit-button";
import {useFormState} from "react-dom";
import {sendMemberApplication} from "../actions/sendMemberApplication";

export default function ApplicationForm() {
  const [formState, formAction] = useFormState(sendMemberApplication, null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">Send inn søknad om medlemsskap</Button>
      </DialogTrigger>
      <DialogContent className="w-full lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Søknad om medlemsskap i <p className="nbbf-font inline">Norges Bondebridgeforbund</p></DialogTitle>
        </DialogHeader>
        {formState?.success ? (
          <DialogDescription>
            Din søknad er sendt inn, og vil bli behandlet så snart som mulig.
          </DialogDescription>
        ) : (
          <form action={formAction}>
            <Label htmlFor="full_name">Fullt navn</Label>
            <Input type="text" name={"full_name"} required className="mb-1"/>
            {formState?.errors?.full_name && (
              <div id="name-error" style={{color: `#dc2626`}}>
                {formState.errors.full_name.join(',')}
              </div>
            )}
            <Label htmlFor="email">E-post addresse</Label>
            <Input type="email" placeholder="" name={"email"} required className="mb-1"/>
            {formState?.errors?.email && (
              <div id="name-error" style={{color: `#dc2626`}}>
                {formState.errors.email.join(',')}
              </div>
            )}
            <Label htmlFor="title">Søknadens tittel</Label>
            <Input type="text" placeholder="" name={"title"} required className="mb-1"/>
            {formState?.errors?.title && (
              <div id="name-error" style={{color: `#dc2626`}}>
                {formState.errors.title.join(',')}
              </div>
            )}
            <Label htmlFor="content">Søknadens innhold</Label>
            <Textarea placeholder="Fortell litt om deg selv" name={"content"} required className="mb-1" />
            {formState?.errors?.content && (
              <div id="name-error" style={{color: `#dc2626`}}>
                {formState.errors.content.join(',')}
              </div>
            )}

            <FormSubmitButton>
              Send inn
            </FormSubmitButton>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}