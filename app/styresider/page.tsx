import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {use} from "react";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";

export default function StyreHome() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const user = use(getAuthenticatedUser(token.value, 'styre'));

  redirect('/styresider/medlemmer')
}