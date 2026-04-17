import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

export const runtime = 'edge';

const createPostSchema = z.object({
  categoryId: z.number().int().positive("请选择分类"),
  title: z.string().min(1, "请输入标题").max(100, "标题最多100个字符"),
  description: z.string().min(1, "请输入描述").max(2000, "描述最多2000个字符"),
  state: z.string().min(1, "请选择州"),
  city: z.string().min(1, "请输入城市"),
  phone: z.string().min(1, "请输入电话"),
  wechat: z.string().min(1, "请输入微信号"),
  extraFields: z.record(z.string(), z.any()).optional(),
  images: z.array(z.string().url()).optional(),
});

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// 开发环境模拟数据
const mockPosts = [
  {
    id: "1",
    title: "洛杉矶豪华公寓出租 - 近华人区，包水电家具",
    description: "🏠 房源介绍\n\n位于洛杉矶华人区核心地段，交通便利，周边生活设施齐全。",
    state: "California",
    city: "Los Angeles",
    status: "active",
    is_sticky: 1,
    view_count: 1234,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    username: "房东老王",
    category_name: "房屋出租",
    category_slug: "for-rent",
    thumbnail: null
  },
  {
    id: "2",
    title: "高薪诚聘！洛杉矶中餐厅招服务员和后厨",
    description: "我们是一家位于洛杉矶的中餐厅，现招聘服务员和后厨人员，待遇优厚。",
    state: "California",
    city: "Los Angeles",
    status: "active",
    is_sticky: 0,
    view_count: 567,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    username: "招聘经理",
    category_name: "招聘",
    category_slug: "hiring",
    thumbnail: null
  },
  {
    id: "3",
    title: "99新特斯拉 Model 3 低价转让",
    description: "2022年特斯拉Model 3，续航300英里，车况极佳，因搬家转让。",
    state: "New York",
    city: "New York City",
    status: "active",
    is_sticky: 0,
    view_count: 890,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    username: "车主小李",
    category_name: "二手车辆",
    category_slug: "vehicles",
    thumbnail: null
  },
  {
    id: "4",
    title: "旧金山台湾美食餐厅新店开业，全场8折",
    description: "正宗台湾美食，开业庆典期间所有菜品8折优惠，欢迎光临！",
    state: "California",
    city: "San Francisco",
    status: "active",
    is_sticky: 1,
    view_count: 2341,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    username: "餐厅老板",
    category_name: "美食餐饮",
    category_slug: "food-dining",
    thumbnail: null
  },
  {
    id: "5",
    title: "法拉盛超大主卧招室友，包水电网",
    description: "法拉盛公寓出租主卧，房间宽敞，设施齐全，包水电网，限单人。",
    state: "New York",
    city: "Flushing",
    status: "active",
    is_sticky: 0,
    view_count: 456,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    username: "租客转租",
    category_name: "房屋出租",
    category_slug: "for-rent",
    thumbnail: null
  },
  {
    id: "6",
    title: "Costco 代购服务上线！每周往返，代购费低至5%",
    description: "专业Costco代购，每周往返，代购费仅5%，量大从优。",
    state: "California",
    city: "Irvine",
    status: "active",
    is_sticky: 0,
    view_count: 678,
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    username: "代购小王",
    category_name: "代跑接送",
    category_slug: "errands",
    thumbnail: null
  },
];

export async function GET(request: NextRequest) {
  try {
    // 开发环境：返回模拟数据
    if (process.env.NODE_ENV === 'development' || !request.headers.get('cf-env')) {
      const { searchParams } = new URL(request.url);
      const categoryId = searchParams.get("categoryId");
      const state = searchParams.get("state");
      const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
      const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

      // 过滤模拟数据
      let filteredPosts = [...mockPosts];

      if (categoryId) {
        filteredPosts = filteredPosts.filter(post => post.category_slug === categoryId);
      }
      if (state) {
        filteredPosts = filteredPosts.filter(post => post.state === state);
      }

      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      const paginatedPosts = filteredPosts.slice(offset, offset + limit);

      return NextResponse.json({
        data: {
          posts: paginatedPosts,
          total,
          page,
          totalPages,
          limit,
        },
      });
    }

    // 生产环境：从数据库读取
    const db = (request as any).env?.DB;
    if (!db) {
      console.error("DB binding not found");
      return NextResponse.json(
        { error: "数据库连接失败" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const state = searchParams.get("state");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    const conditions: string[] = ["p.status = 'active'"];
    const bindings: (string | number)[] = [];

    if (categoryId) {
      conditions.push("p.category_id = ?");
      bindings.push(parseInt(categoryId, 10));
    }

    if (state) {
      conditions.push("p.state = ?");
      bindings.push(state);
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await db
      .prepare(`SELECT COUNT(*) as total FROM posts p WHERE ${whereClause} AND (expires_at IS NULL OR expires_at > datetime('now'))`)
      .bind(...bindings)
      .first();

    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const posts = await db
      .prepare(`
        SELECT
          p.id,
          p.user_id,
          p.category_id,
          p.title,
          p.description,
          p.state,
          p.city,
          p.status,
          p.is_sticky,
          p.sticky_order,
          p.view_count,
          p.created_at,
          p.updated_at,
          u.username,
          c.name as category_name,
          c.slug as category_slug,
          (SELECT image_url FROM post_images WHERE post_id = p.id ORDER BY sort_order LIMIT 1) as thumbnail
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE ${whereClause}
          AND (p.expires_at IS NULL OR p.expires_at > datetime('now'))
        ORDER BY p.is_sticky DESC, p.sticky_order ASC, p.created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(...bindings, limit, offset)
      .all();

    return NextResponse.json({
      data: {
        posts: posts.results || [],
        total,
        page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);

    // 开发环境降级
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        data: {
          posts: mockPosts,
          total: mockPosts.length,
          page: 1,
          totalPages: 1,
          limit: 20,
        },
      });
    }

    return NextResponse.json(
      { error: "获取帖子列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 开发环境：简化验证
    if (process.env.NODE_ENV === 'development' || !request.headers.get('cf-env')) {
      const body = await request.json();

      // 基本验证
      if (!body.title || !body.description || !body.state || !body.city) {
        return NextResponse.json(
          { error: "请填写必填字段" },
          { status: 400 }
        );
      }

      const postId = generateId();
      const now = new Date().toISOString();

      return NextResponse.json({
        data: { postId },
        message: "发布成功，等待审核"
      });
    }

    // 生产环境：完整验证
    const db = (request as any).env?.DB;
    if (!db) {
      return NextResponse.json({ error: "数据库连接失败" }, { status: 500 });
    }

    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "登录已过期" }, { status: 401 });
    }

    const userId = decoded.userId;
    const body = await request.json();
    const validationResult = createPostSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues;
      return NextResponse.json(
        { error: errors[0]?.message || "数据验证失败" },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    const today = new Date().toISOString().split("T")[0];
    const userResult = await db
      .prepare("SELECT daily_post_count, last_post_date, role FROM users WHERE id = ?")
      .bind(userId)
      .first();

    if (!userResult) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    if (userResult.role !== 'admin') {
      const shouldReset = userResult.last_post_date !== today;
      const currentCount = shouldReset ? 0 : (userResult.daily_post_count || 0);

      if (currentCount >= 15) {
        return NextResponse.json(
          { error: "今日发布次数已达上限（15次），请明天再来" },
          { status: 429 }
        );
      }
    }

    const extraFieldsJson = JSON.stringify(data.extraFields);
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .split(".")[0];

    const postId = generateId();
    const now = new Date().toISOString().replace("T", " ").split(".")[0];

    await db
      .prepare(`
        INSERT INTO posts (id, user_id, category_id, title, description, state, city, phone, wechat, status, extra_fields, expires_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
      `)
      .bind(
        postId,
        userId,
        data.categoryId,
        data.title,
        data.description,
        data.state,
        data.city,
        data.phone,
        data.wechat,
        extraFieldsJson,
        expiresAt,
        now,
        now
      )
      .run();

    if (userResult.role !== 'admin') {
      const newDailyCount = (userResult.last_post_date === today ? userResult.daily_post_count : 0) + 1;
      await db
        .prepare(`
          UPDATE users SET daily_post_count = ?, last_post_date = ? WHERE id = ?
        `)
        .bind(newDailyCount, today, userId)
        .run();
    }

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        await db
          .prepare(`
            INSERT INTO post_images (post_id, image_url, sort_order)
            VALUES (?, ?, ?)
          `)
          .bind(postId, data.images[i], i)
          .run();
      }
    }

    return NextResponse.json({
      data: { postId },
      message: "发布成功，等待审核",
    });
  } catch (error) {
    console.error("Create post error:", error);

    // 开发环境降级
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        data: { postId: generateId() },
        message: "发布成功，等待审核"
      });
    }

    return NextResponse.json({ error: "发布失败，请稍后重试" }, { status: 500 });
  }
}
