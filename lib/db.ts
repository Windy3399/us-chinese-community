import type { D1Database } from "@cloudflare/workers-types";

export interface CloudflareContext {
  env: {
    DB?: D1Database;
    [key: string]: unknown;
  };
}

export function getDB(context: CloudflareContext): D1Database {
  if (!context.env?.DB) {
    throw new Error(
      "D1 database binding 'DB' not found. Make sure wrangler.toml is configured correctly."
    );
  }
  return context.env.DB;
}

export function extractDBFromRequest(request: Request): D1Database | null {
  const env = (request as any).env;
  if (env?.DB) {
    return env.DB;
  }
  return null;
}

export async function getCategories(db: D1Database) {
  const result = await db
    .prepare(
      `
      WITH parent_cats AS (
        SELECT id, name, slug, parent_id, icon, sort_order, is_admin_only, created_at
        FROM categories
        WHERE parent_id IS NULL
        ORDER BY sort_order
      ),
      child_cats AS (
        SELECT id, name, slug, parent_id, icon, sort_order, is_admin_only, created_at
        FROM categories
        WHERE parent_id IS NOT NULL
        ORDER BY sort_order
      )
      SELECT 
        p.id, p.name, p.slug, p.icon, p.sort_order, p.is_admin_only, p.created_at,
        (
          SELECT json_group_array(
            json_object(
              'id', c.id,
              'name', c.name,
              'slug', c.slug,
              'parent_id', c.parent_id,
              'icon', c.icon,
              'sort_order', c.sort_order,
              'is_admin_only', c.is_admin_only,
              'created_at', c.created_at
            )
          )
          FROM child_cats c
          WHERE c.parent_id = p.id
        ) as children
      FROM parent_cats p
    `
    )
    .all();

  return result.results.map((row: any) => ({
    ...row,
    children: JSON.parse(row.children || "[]").filter((c: any) => c.id !== null),
  }));
}
