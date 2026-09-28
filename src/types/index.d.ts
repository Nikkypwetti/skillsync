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
  status: "in_progress" | "completed" | "archived";
  source: string;
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
  portfolio_template: string;
  accent_color: string;
  show_experience: boolean;
  show_certifications: boolean;
  onboarding_completed: boolean;
  github_username: string | null;
};

export type ProjectAsset = {
  id: string;
  project_id: string;
  user_id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
};


export type ProjectEvidenceLink = {
  id: string;
  project_id: string;
  user_id: string;
  evidence_type: string;
  label: string | null;
  url: string;
  created_at: string;
};

export type ProjectSkillReview = {
  id: string;
  project_id: string;
  user_id: string;
  skill_name: string;
  status: "confirmed" | "dismissed";
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: string;
  user_id: string;
  role: string;
  organization: string;
  employment_type: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  public: boolean;
  created_at: string;
  updated_at: string;
};

export type Certificate = {
  id: string;
  user_id: string;
  name: string;
  issuer: string | null;
  date_issued: string | null;
  url: string | null;
  description: string | null;
  credential_id: string | null;
  public: boolean;
  created_at: string;
  updated_at: string;
};
