import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {getApplications} from "../../actions/getApplications";
import ApplicationTable from "../../components/application-table";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";

export default async function Soknader() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['applications'],
    queryFn: () => getApplications(token.value),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApplicationTable token={token}/>
    </HydrationBoundary>
  )
}