interface Props {
  score: number;
}

export default function ScoreCard({ score }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Ad Performance Score
          </h2>

          <p className="text-slate-400">Based on AI analysis</p>
        </div>

        <div className="text-5xl font-bold text-white">{score}</div>
      </div>
    </div>
  );
}
