import {ReactNode} from "react";
import Link from "next/link";
import {cn} from "../../lib/utils";
import {buttonVariants} from "../../components/ui/button";

export default function StyreLayout({children}: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}