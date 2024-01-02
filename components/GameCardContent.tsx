import {CardContent} from "./ui/card";
import {GetGamesResponse} from "../actions/common";

const GameCardContent = ({game}: { game: GetGamesResponse }) => {
  return (
    <CardContent>
      <p>
        Opprettet av: {game.creator_name}
      </p>
      <p>
        Antall spillere: {game.players}
      </p>
      <p>
        Antall runder spilt: {game.rounds}
      </p>
      <p>
        Offisielt spill: {game.official ? 'Ja' : 'Nei'}
      </p>
    </CardContent>
  )
}

export default GameCardContent;