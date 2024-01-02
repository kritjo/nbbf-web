import {getMembers} from "../../actions/getMembers";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import MemberTable from "../../components/member-table";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";

export default async function Medlemmer() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const authenticatedUser = await getAuthenticatedUser(token.value, 'styre');
  if (!authenticatedUser) redirect('/')

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['members'],
    queryFn: () => getMembers(token.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MemberTable authenticatedUser={authenticatedUser} token={token}/>
    </HydrationBoundary>
  )
}