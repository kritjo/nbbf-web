import {TableCell, TableRow} from "./ui/table";
import {Button} from "./ui/button";

const GameMemberRow = ({gamePlayerId, name}: {gamePlayerId: number, name: string}) => {
  return (
    <TableRow key={gamePlayerId}>
      <TableCell>{name}</TableCell>
      <TableCell>Medlem</TableCell>
      <TableCell>
        <Button variant="outline" className="text-red-500">
          Fjern
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default GameMemberRow