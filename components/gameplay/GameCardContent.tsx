import {CardContent} from "../ui/card";
import {GetGamesResponse} from "../../actions/common";

const GameCardContent = ({game}: { game: GetGamesResponse }) => {
  return (
    <CardContent>
      <p>
        Opprettet av: {game.creator_name}
      </p>
      <p>
        Antall spillere: {game.player_count}
      </p>
      { game.status === 'finished' &&
          <p>
            Antall runder spilt: {game.rounds}
          </p>
      }
      { game.status === 'started' &&
          <p>
            Gjeldende runde: {game.rounds}
          </p>
      }
      <p>
        Offisielt spill: {game.official ? 'Ja' : 'Nei'}
      </p>
    </CardContent>
  )
}

export default GameCardContent;