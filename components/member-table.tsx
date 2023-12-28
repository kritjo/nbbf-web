'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {useQuery} from "@tanstack/react-query";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {getMembers} from "../actions/getMembers";

const MemberTable = ({token}: {token: RequestCookie}) => {
  const { data } = useQuery({ queryKey: ['members'], queryFn: () => getMembers(token.value) })

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
        {data?.map(member => (
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

export default MemberTable