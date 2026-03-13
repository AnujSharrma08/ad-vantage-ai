interface AuditSummary {
  risk: string;
  summary: string;
  confidence: number;
}

interface Props {
  parsedSummary: AuditSummary | null;
}

export default function AnalysisResult({ parsedSummary }: Props) {
  if (!parsedSummary) return null;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
      <h3 className="text-xl font-semibold text-white mb-4">
        Detailed Analysis
      </h3>

      <p className="text-slate-300 text-lg">{parsedSummary.summary}</p>
    </div>
  );
}
