export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  is_banned: number;
  daily_post_count: number;
  last_post_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  icon: string | null;
  sort_order: number;
  is_admin_only: number;
  created_at: string;
}

export interface CategoryWithChildren extends Category {
  children: Category[];
}

export interface Post {
  id: string;
  user_id: string;
  category_id: number | null;
  title: string;
  description: string;
  state: string | null;
  city: string | null;
  phone: string | null;
  wechat: string | null;
  status: "pending" | "active" | "rejected" | "expired";
  is_sticky: number;
  sticky_order: number;
  extra_fields: string | null;
  view_count: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostWithDetails extends Post {
  username?: string;
  category_name?: string;
  category_slug?: string;
  images?: PostImage[];
}

export interface PostImage {
  id: number;
  post_id: string;
  image_url: string;
  sort_order: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CommentWithUser extends Comment {
  username: string;
}

export interface Ad {
  id: number;
  category_id: number | null;
  position: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  is_active: number;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
