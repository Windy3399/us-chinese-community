export interface Post {
  id: string;
  title: string;
  description: string;
  username: string;
  category_name: string;
  state: string;
  city: string;
  status: "pending" | "active" | "rejected" | "expired";
  is_sticky: number;
  sticky_order: number;
  created_at: string;
  view_count: number;
}