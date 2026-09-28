export type EvidenceLevel = "Exploring" | "Developing" | "Practiced" | "Proficient" | "Advanced";

export function levelFromScore(score: number): EvidenceLevel {
  if (score >= 90) return "Advanced";
  if (score >= 75) return "Proficient";
  if (score >= 50) return "Practiced";
  if (score >= 30) return "Developing";
  return "Exploring";
}
