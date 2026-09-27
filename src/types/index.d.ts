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
  repo_url: string | null;
  live_url: string | null;
  description: string | null;
  created_at: string;
};
