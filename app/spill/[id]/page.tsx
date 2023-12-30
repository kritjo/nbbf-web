import GameViewServer from "../../../components/game-view-server";

export default function GameInstance({ params }: { params: { id: string } }) {
  const { id } = params;
  const game_id = parseInt(id);

  return (
    <GameViewServer gameId={game_id}/>
  )
}
