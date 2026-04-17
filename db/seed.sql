-- =============================================
-- US Chinese Community Seed Data
-- =============================================

-- 1. 本土资讯 (Local News)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('本土资讯', 'local-news', 'Newspaper', 1, 1),
    ('当地事件', 'local-events', 'Newspaper', 0, 0),
    ('华人热点', 'chinese-news', 'Newspaper', 0, 0);

UPDATE categories SET parent_id = 1 WHERE slug = 'local-events';
UPDATE categories SET parent_id = 1 WHERE slug = 'chinese-news';

-- 2. 华人社区 (Chinese Community)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('华人社区', 'chinese-community', 'Users', 1, 2),
    ('茶话吃瓜', 'casual-chat', 'Coffee', 0, 0),
    ('互助信息', 'mutual-help', 'Handshake', 0, 0),
    ('黑名单', 'blacklist', 'ShieldAlert', 0, 0);

UPDATE categories SET parent_id = 5 WHERE slug = 'casual-chat';
UPDATE categories SET parent_id = 5 WHERE slug = 'mutual-help';
UPDATE categories SET parent_id = 5 WHERE slug = 'blacklist';

-- 3. 招聘求职 (Jobs)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('招聘求职', 'jobs', 'Briefcase', 0, 3),
    ('招聘', 'hiring', 'Briefcase', 0, 0),
    ('求职', 'job-seeking', 'Search', 0, 0);

UPDATE categories SET parent_id = 9 WHERE slug = 'hiring';
UPDATE categories SET parent_id = 9 WHERE slug = 'job-seeking';

-- 4. 房屋租售 (Housing)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('房屋租售', 'housing', 'Home', 0, 4),
    ('房屋出租', 'for-rent', 'Key', 0, 0),
    ('房屋需求', 'housing-wanted', 'Home', 0, 0),
    ('房屋出售', 'for-sale', 'DollarSign', 0, 0);

UPDATE categories SET parent_id = 13 WHERE slug = 'for-rent';
UPDATE categories SET parent_id = 13 WHERE slug = 'housing-wanted';
UPDATE categories SET parent_id = 13 WHERE slug = 'for-sale';

-- 5. 同城交易 (Marketplace)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('同城交易', 'marketplace', 'ShoppingBag', 0, 5),
    ('闲置物品', 'used-items', 'Package', 0, 0),
    ('二手车辆', 'vehicles', 'Car', 0, 0),
    ('生意转让', 'business-transfer', 'Store', 0, 0);

UPDATE categories SET parent_id = 18 WHERE slug = 'used-items';
UPDATE categories SET parent_id = 18 WHERE slug = 'vehicles';
UPDATE categories SET parent_id = 18 WHERE slug = 'business-transfer';

-- 6. 福利放送 (Welfare)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('福利放送', 'welfare', 'Gift', 1, 6);

-- 7. 好趣推荐 (Recommendations)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('好趣推荐', 'recommendations', 'ThumbsUp', 1, 7);

-- 8. 商家优惠 (Deals)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('商家优惠', 'deals', 'Tag', 0, 8);

-- 9. 行业黄页 (Yellow Pages)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('行业黄页', 'yellow-pages', 'BookOpen', 0, 9),
    ('美食餐饮', 'food-dining', 'UtensilsCrossed', 0, 0),
    ('家政服务', 'home-services', 'Wrench', 0, 0),
    ('代跑接送', 'errands', 'Footprints', 0, 0),
    ('美容美发', 'beauty', 'Scissors', 0, 0),
    ('休闲娱乐', 'entertainment', 'Gamepad2', 0, 0),
    ('医疗健康', 'healthcare', 'HeartPulse', 0, 0),
    ('法律会计', 'legal-accounting', 'Scale', 0, 0),
    ('金融保险', 'finance', 'Landmark', 0, 0),
    ('五金辅料', 'hardware', 'Hammer', 0, 0),
    ('建筑装修', 'construction', 'HardHat', 0, 0),
    ('电工电气', 'electrical', 'Zap', 0, 0),
    ('汽车服务', 'auto-service', 'Car', 0, 0),
    ('物流货运', 'logistics', 'Truck', 0, 0),
    ('批发贸易', 'wholesale', 'Boxes', 0, 0),
    ('教育培训', 'education', 'GraduationCap', 0, 0),
    ('宠物服务', 'pets', 'PawPrint', 0, 0),
    ('其他', 'yp-other', 'MoreHorizontal', 0, 0);

UPDATE categories SET parent_id = 25 WHERE slug = 'food-dining';
UPDATE categories SET parent_id = 25 WHERE slug = 'home-services';
UPDATE categories SET parent_id = 25 WHERE slug = 'errands';
UPDATE categories SET parent_id = 25 WHERE slug = 'beauty';
UPDATE categories SET parent_id = 25 WHERE slug = 'entertainment';
UPDATE categories SET parent_id = 25 WHERE slug = 'healthcare';
UPDATE categories SET parent_id = 25 WHERE slug = 'legal-accounting';
UPDATE categories SET parent_id = 25 WHERE slug = 'finance';
UPDATE categories SET parent_id = 25 WHERE slug = 'hardware';
UPDATE categories SET parent_id = 25 WHERE slug = 'construction';
UPDATE categories SET parent_id = 25 WHERE slug = 'electrical';
UPDATE categories SET parent_id = 25 WHERE slug = 'auto-service';
UPDATE categories SET parent_id = 25 WHERE slug = 'logistics';
UPDATE categories SET parent_id = 25 WHERE slug = 'wholesale';
UPDATE categories SET parent_id = 25 WHERE slug = 'education';
UPDATE categories SET parent_id = 25 WHERE slug = 'pets';
UPDATE categories SET parent_id = 25 WHERE slug = 'yp-other';

-- 10. 其他 (Others)
INSERT INTO categories (name, slug, icon, is_admin_only, sort_order) VALUES
    ('其他', 'others', 'MoreHorizontal', 0, 10);

-- =============================================
-- Seed Data
-- =============================================

-- Sample notices
INSERT INTO notices (title, content, is_active, created_at) VALUES
    ('欢迎来到 US Chinese Community', '欢迎使用我们的社区平台！请遵守社区规则，文明发言。', 1, datetime('now')),
    ('重要通知', '平台将于2024年1月1日进行系统升级，届时可能会有短暂的服务中断。', 1, datetime('now'));

-- Sample ads
INSERT INTO ads (title, position, image_url, link_url, is_active, is_global, priority, created_at) VALUES
    ('首页横幅广告', 'homepage_top', 'https://example.com/banner.jpg', 'https://example.com', 1, 1, 10, datetime('now')),
    ('侧边栏广告', 'homepage_sidebar', 'https://example.com/sidebar.jpg', 'https://example.com', 0, 0, 5, datetime('now'));

-- Sample KV
INSERT OR REPLACE INTO kv_store (key, value, updated_at) VALUES
    ('site_announcement', '{"enabled": false, "content": "", "style": "info"}', datetime('now'));
