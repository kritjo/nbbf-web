import {getMembers} from "../../actions/getMembers";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {use} from "react";
import {getAuthenticatedUser} from "../../actions/getAuthenticatedUser";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";

export default function Medlemmer() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const members = use(getMembers(token.value));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>E-post</TableHead>
          <TableHead>Fullt navn</TableHead>
          <TableHead>Rolle</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members?.map(member => (
          <TableRow key={member.id}>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.full_name}</TableCell>
            <TableCell>{member.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}