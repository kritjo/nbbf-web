import {useQuery, useQueryClient} from "@tanstack/react-query";
import {cookies} from "next/headers";
import {getAuthenticatedUser} from "@/actions/getAuthenticatedUser";
import SigninDialog from "@/components/signin-dialog";
import {Skeleton} from "@/components/ui/skeleton";

const UserOrSignin = () => {
  const queryClient = useQueryClient();

  const {data: user, isLoading, isError} = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      const token = cookies().get('token');
      if (token) {
        return getAuthenticatedUser(token.value);
      } else {
        return Promise.resolve(null);
      }
    }
  });

  if (isLoading || isError) return <Skeleton className="w-24 h-8"/>

  return (
    <SigninDialog/>
  )
}

export default UserOrSignin