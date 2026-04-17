export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  is_banned: number;
  is_unlimited: number;
  daily_post_count: number;
  last_post_date: string | null;
  daily_comment_count: number;
  last_comment_date: string | null;
  created_at: string;
}