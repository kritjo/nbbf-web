import {ReactNode} from "react";
import Link from "next/link";
import {cn} from "../../lib/utils";
import {buttonVariants} from "../../components/ui/button";

export default function StyreLayout({children}: { children: ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-center py-12">
      <div className="basis-1/6 flex flex-col items-center justify-center h-full border-2 border-gray-700 rounded-md p-2 m-2">
        <nav className="grid gap-1 px-2">
          <Link
            href="/styresider/medlemmer"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-start"
            )}
          >
              <span
                className={cn(
                  "text-background dark:text-white"
                )}
              >
                Medlemmer
              </span>
          </Link>
          <Link
            href="/styresider/soknader"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-start"
            )}
          >
              <span
                className={cn(
                  "text-background dark:text-white"
                )}
              >
                Søknader
              </span>
          </Link>
        </nav>
      </div>
      <div className="basis-5/6 flex flex-col items-center justify-center h-full">
        {children}
      </div>
    </div>
  )
}