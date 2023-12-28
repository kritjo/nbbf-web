import {Table, TableBody, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {use} from "react";
import {getApplications} from "../../actions/getApplications";
import ApplcationTableRow from "../../components/applcation-table-row";

export default function Soknader() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) redirect('/')
  const applications = use(getApplications(token.value));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>E-post</TableHead>
          <TableHead>Fullt navn</TableHead>
          <TableHead>Tittel</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application_joined) => {
          return (
            <ApplcationTableRow
              key={application_joined.applications.id}
              application_joined={application_joined}
              token={token}/>
        )})}
      </TableBody>
    </Table>
  )
}