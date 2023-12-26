import {Button} from "./button";
import {useFormStatus} from "react-dom";

// @ts-ignore // TODO: Fix this
const FormSubmitButton = ({children, ...props }) => {
  const { pending } = useFormStatus();
  return (

    <Button className="mt-4" variant="outline" size="sm" type="submit" disabled={pending} aria-busy={pending} aria-disabled={pending} {...props}>
      {children}
    </Button>
  );
}

export default FormSubmitButton