'use client'

import {DropdownMenuItem} from "./dropdown-menu";
import {signOut} from "../../actions/signOut";

const LogoutMenuButton = () => {
  return (
    <DropdownMenuItem onClick={async () => {
      await signOut();
    }}>Log out</DropdownMenuItem>
  )
}

export default LogoutMenuButton