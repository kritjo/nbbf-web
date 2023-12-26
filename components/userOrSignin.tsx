import SigninDialog from "./signin-dialog";
import {getAuthenticatedUser} from "../actions/getAuthenticatedUser";
import { cookies } from 'next/headers';
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "./ui/dropdown-menu";
import LogoutMenuButton from "./ui/logout-menu-button";
import { use } from 'react'


const UserOrSignin = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) return <SigninDialog/>;
  const user = use(getAuthenticatedUser(token.value));
  if (!user) return <SigninDialog/>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <LogoutMenuButton/>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserOrSignin