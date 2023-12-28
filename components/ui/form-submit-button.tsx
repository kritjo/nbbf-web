import {Button} from "./button";
import {useFormStatus} from "react-dom";
import {Loader2} from "lucide-react";

// @ts-ignore // TODO: Fix this
const FormSubmitButton = ({children, ...props }) => {
  const { pending } = useFormStatus();
  return (

    <Button className="mt-4" variant="outline" size="sm" type="submit" disabled={pending} aria-busy={pending} aria-disabled={pending} {...props}>
      {pending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </Button>
  );
}

export default FormSubmitButton