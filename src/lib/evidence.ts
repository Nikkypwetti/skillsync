export type EvidenceLevel = "Exploring" | "Developing" | "Practiced" | "Proficient" | "Advanced";

export function levelFromScore(score: number): EvidenceLevel {
  if (score >= 85) return "Advanced";
  if (score >= 65) return "Proficient";
  if (score >= 45) return "Practiced";
  if (score >= 25) return "Developing";
  return "Exploring";
}
