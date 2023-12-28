'use client'

import {Table, TableBody, TableHead, TableHeader, TableRow} from "./ui/table";
import {useQuery} from "@tanstack/react-query";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {getMembers} from "../actions/getMembers";
import MemberTableRow from "./member-table-row";

const MemberTable = ({token}: {token: RequestCookie}) => {
  const { data } = useQuery({ queryKey: ['members'], queryFn: () => getMembers(token.value) })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>E-post</TableHead>
          <TableHead>Fullt navn</TableHead>
          <TableHead>Rolle</TableHead>
          <TableHead>Rediger</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(member => (
          <MemberTableRow member={member} key={member.id} token={token}/>
        ))}
      </TableBody>
    </Table>
  )
}

export default MemberTable