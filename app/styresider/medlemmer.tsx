import {getMembers} from "../../actions/getMembers";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import MemberTable from "../../components/member-table";

export default async function Medlemmer() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['members'],
    queryFn: () => getMembers(token.value),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MemberTable token={token}/>
    </HydrationBoundary>
  )
}