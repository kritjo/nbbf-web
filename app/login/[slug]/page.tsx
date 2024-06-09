'use client' // So small component, so entire can be client side

import {Button} from "../../../components/ui/button";
import {signIn} from "../../../actions/signIn";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

export default function Login({ params }: { params: { slug: string } }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  return (
    <main>
      <section className="flex flex-col items-center justify-center py-12">
        <Button className="mt-4" disabled={pending} aria-busy={pending} aria-disabled={pending} onClick={() => {
          setPending(true);
          signIn(params.slug).then(r => {
            setPending(false);
            router.push('/spill');
          }).catch(e => {
            setPending(false);
            alert(e.message);
            router.push('/');
          });
        }}>
          {
            pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          }
          Bruk magisk lenke
        </Button>
      </section>
    </main>
  )
}