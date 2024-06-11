'use client'

import {Table, TableBody, TableHead, TableHeader, TableRow} from "../ui/table";
import ApplcationTableRow from "./applcation-table-row";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {useQuery} from "@tanstack/react-query";
import {getApplications} from "../../actions/getApplications";

const ApplicationTable = ({token} : {token: RequestCookie}) => {
  const { data } = useQuery({ queryKey: ['applications'], queryFn: () => getApplications(token.value) })

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
        {data?.map((application_joined) => {
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

export default ApplicationTable