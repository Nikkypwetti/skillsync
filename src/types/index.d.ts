export type Skill = {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  level: number;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  repo_link: string | null;
  live_url: string | null;
  evidence_url: string | null;
  career_track: string | null;
  project_type: string | null;
  role: string | null;
  challenge: string | null;
  contribution: string | null;
  outcome: string | null;
  tools: string[];
  featured: boolean;
  public: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectSkill = {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  category: string | null;
  evidence_score: number;
  evidence_level: string;
  rationale: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  career_track: string | null;
  headline: string | null;
  location: string | null;
  about: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  portfolio_public: boolean;
};
