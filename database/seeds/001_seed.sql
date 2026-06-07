INSERT INTO banners (id, title, subtitle, button_text, gradient, sort_no) VALUES
  ('b1', '618 年中盛典', '全场爆款低至 5 折', '立即逛逛', 'linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%)', 1),
  ('b2', '数码新品首发', '手机耳机限时立减', '抢先看', 'linear-gradient(135deg, #4f8cff 0%, #8d5cff 100%)', 2),
  ('b3', '品质生活馆', '家居好物第二件半价', '去发现', 'linear-gradient(135deg, #18c37d 0%, #12a1ff 100%)', 3)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  button_text = EXCLUDED.button_text,
  gradient = EXCLUDED.gradient,
  sort_no = EXCLUDED.sort_no,
  is_active = TRUE;

INSERT INTO categories (id, name, icon, sort_no, is_shortcut) VALUES
  ('all', '全部', '✨', 0, TRUE),
  ('phone', '数码手机', '📱', 1, TRUE),
  ('beauty', '美妆护肤', '💄', 2, TRUE),
  ('food', '食品生鲜', '🍓', 3, TRUE),
  ('home', '家居生活', '🏠', 4, TRUE),
  ('sport', '运动户外', '🏃', 5, TRUE),
  ('fashion', '服饰箱包', '👟', 6, TRUE),
  ('baby', '母婴玩具', '🧸', 7, TRUE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_no = EXCLUDED.sort_no,
  is_shortcut = EXCLUDED.is_shortcut,
  is_active = TRUE;

INSERT INTO products (
  id, category_id, title, description, price, old_price, sales, stock, badge, tags, cover_text, gradient, specs
) VALUES
  ('1001', 'phone', '云感轻薄手机 Pro 12+256G', '旗舰芯片、超清影像、全天候长续航，适合日常办公和游戏娱乐。', 3299, 3999, 3268, 996, '新品', ARRAY['12期免息', '顺丰包邮'], '轻薄手机', 'linear-gradient(135deg, #e6f0ff 0%, #b9d3ff 100%)', ARRAY['星河银', '曜石黑', '冰川蓝']),
  ('1002', 'phone', '智能主动降噪蓝牙耳机', '深度降噪、通透模式、低延迟游戏模式，单次续航 8 小时。', 399, 599, 9841, 1588, '爆款', ARRAY['降噪', '低延迟'], '降噪耳机', 'linear-gradient(135deg, #f1f4ff 0%, #d8c7ff 100%)', ARRAY['云朵白', '深空灰']),
  ('1003', 'beauty', '氨基酸净润洁面乳 120g', '温和清洁不紧绷，适合多种肤质，早晚均可使用。', 79, 129, 12036, 2220, '热卖', ARRAY['温和', '敏感肌可用'], '洁面乳', 'linear-gradient(135deg, #fff0f3 0%, #ffd6e1 100%)', ARRAY['120g', '两支装']),
  ('1004', 'beauty', '水光修护精华液 30ml', '补水保湿、改善干燥暗沉，打造通透水光肌。', 168, 239, 5120, 736, '满减', ARRAY['补水', '修护'], '精华液', 'linear-gradient(135deg, #f7f0ff 0%, #ead9ff 100%)', ARRAY['30ml', '50ml']),
  ('1005', 'food', '海南金枕榴莲果肉 500g', '冷链配送，果肉香甜绵密，开袋即食。', 99, 139, 4538, 430, '冷链', ARRAY['顺丰冷链', '产地直发'], '榴莲果肉', 'linear-gradient(135deg, #fff7d6 0%, #ffe08a 100%)', ARRAY['500g', '1kg']),
  ('1006', 'food', '每日坚果混合装 30 包', '甄选腰果、巴旦木、蔓越莓，每日一包营养加分。', 69, 99, 8872, 2810, '囤货', ARRAY['独立包装', '办公室零食'], '每日坚果', 'linear-gradient(135deg, #fff1df 0%, #ffd2a6 100%)', ARRAY['30包', '60包']),
  ('1007', 'home', '北欧风可拆洗懒人沙发', '高回弹填充，亲肤面料，可拆洗外套，小户型友好。', 499, 699, 1456, 338, '家装节', ARRAY['可拆洗', '小户型'], '懒人沙发', 'linear-gradient(135deg, #eef9f4 0%, #bfe9d5 100%)', ARRAY['米白色', '雾霾蓝', '焦糖棕']),
  ('1008', 'home', '抗菌柔软四件套 1.8m 床', 'A 类亲肤面料，柔软透气，四季皆宜。', 229, 329, 3880, 905, '好评', ARRAY['A类面料', '可机洗'], '四件套', 'linear-gradient(135deg, #f4fbff 0%, #c9ecff 100%)', ARRAY['1.5m床', '1.8m床']),
  ('1009', 'sport', '轻量缓震跑步鞋', '轻量鞋身、回弹中底、防滑大底，日常通勤和慢跑皆可。', 259, 399, 6321, 1188, '运动季', ARRAY['轻量', '缓震'], '跑步鞋', 'linear-gradient(135deg, #eef4ff 0%, #bfd8ff 100%)', ARRAY['39码', '40码', '41码', '42码']),
  ('1010', 'sport', '瑜伽健身垫加厚防滑', '高密度材质，回弹舒适，居家训练更安心。', 89, 129, 2764, 1640, '包邮', ARRAY['加厚', '防滑'], '瑜伽垫', 'linear-gradient(135deg, #f0fff6 0%, #b8efd1 100%)', ARRAY['樱花粉', '湖水绿', '高级灰']),
  ('1011', 'fashion', '通勤大容量托特包', '大容量分区，轻便耐磨，通勤、旅行都适合。', 159, 219, 3310, 780, '上新', ARRAY['大容量', '百搭'], '托特包', 'linear-gradient(135deg, #fff1f7 0%, #ffd3e4 100%)', ARRAY['黑色', '棕色', '米白色']),
  ('1012', 'baby', '儿童益智积木 120 件套', '大颗粒设计，颜色丰富，锻炼动手能力和空间想象力。', 129, 199, 2988, 920, '亲子', ARRAY['大颗粒', '益智'], '益智积木', 'linear-gradient(135deg, #fff8e9 0%, #ffd590 100%)', ARRAY['基础款', '豪华款'])
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  old_price = EXCLUDED.old_price,
  sales = EXCLUDED.sales,
  stock = EXCLUDED.stock,
  badge = EXCLUDED.badge,
  tags = EXCLUDED.tags,
  cover_text = EXCLUDED.cover_text,
  gradient = EXCLUDED.gradient,
  specs = EXCLUDED.specs,
  is_active = TRUE;

INSERT INTO product_skus (product_id, sku_name, stock)
SELECT p.id, spec.sku_name, GREATEST(1, FLOOR(p.stock::NUMERIC / GREATEST(array_length(p.specs, 1), 1))::INT)
FROM products p
CROSS JOIN LATERAL unnest(p.specs) AS spec(sku_name)
ON CONFLICT (product_id, sku_name) DO UPDATE SET stock = EXCLUDED.stock;

INSERT INTO coupons (id, title, amount, threshold_amount, description, valid_until, category_id, stock) VALUES
  ('c1', '新人专享券', 20, 99, '满 99 元可用', '2026-12-31 23:59:59+08', NULL, -1),
  ('c2', '全场通用券', 50, 299, '满 299 元可用', '2026-12-31 23:59:59+08', NULL, -1),
  ('c3', '数码品类券', 100, 1999, '数码手机类商品可用', '2026-12-31 23:59:59+08', 'phone', -1)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  amount = EXCLUDED.amount,
  threshold_amount = EXCLUDED.threshold_amount,
  description = EXCLUDED.description,
  valid_until = EXCLUDED.valid_until,
  category_id = EXCLUDED.category_id,
  stock = EXCLUDED.stock,
  is_active = TRUE;

INSERT INTO users (phone, nickname, avatar_text, role) VALUES
  ('13800138000', '张三', '张', 'user')
ON CONFLICT (phone) DO UPDATE SET
  nickname = EXCLUDED.nickname,
  avatar_text = EXCLUDED.avatar_text,
  role = EXCLUDED.role;

WITH seed_user AS (
  SELECT id FROM users WHERE phone = '13800138000'
)
INSERT INTO user_addresses (user_id, name, phone, province, city, district, detail, is_default)
SELECT id, '张三', '13800138000', '广东省', '深圳市', '南山区', '科技园示例大厦 18 楼', TRUE
FROM seed_user
WHERE NOT EXISTS (
  SELECT 1 FROM user_addresses a
  WHERE a.user_id = seed_user.id AND a.phone = '13800138000' AND a.detail = '科技园示例大厦 18 楼'
);

WITH seed_user AS (
  SELECT id FROM users WHERE phone = '13800138000'
)
INSERT INTO user_coupons (user_id, coupon_id)
SELECT seed_user.id, coupons.id
FROM seed_user CROSS JOIN coupons
ON CONFLICT (user_id, coupon_id) DO NOTHING;

WITH seed_user AS (
  SELECT id FROM users WHERE phone = '13800138000'
), seed_cart AS (
  INSERT INTO carts (user_id)
  SELECT id FROM seed_user
  ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
  RETURNING id
)
INSERT INTO cart_items (cart_id, product_id, sku_name, quantity, checked)
SELECT seed_cart.id, item.product_id, item.sku_name, item.quantity, item.checked
FROM seed_cart
CROSS JOIN (
  VALUES
    ('1002', '云朵白', 1, TRUE),
    ('1006', '30包', 2, TRUE)
) AS item(product_id, sku_name, quantity, checked)
ON CONFLICT (cart_id, product_id, sku_name) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  checked = EXCLUDED.checked;

WITH seed_user AS (
  SELECT id FROM users WHERE phone = '13800138000'
)
INSERT INTO favorites (user_id, product_id)
SELECT seed_user.id, item.product_id
FROM seed_user
CROSS JOIN (VALUES ('1001'), ('1007')) AS item(product_id)
ON CONFLICT (user_id, product_id) DO NOTHING;

WITH seed_user AS (
  SELECT id FROM users WHERE phone = '13800138000'
), address_payload AS (
  SELECT jsonb_build_object(
    'name', '张三',
    'phone', '13800138000',
    'province', '广东省',
    'city', '深圳市',
    'district', '南山区',
    'detail', '科技园示例大厦 18 楼'
  ) AS address
), new_order AS (
  INSERT INTO orders (
    order_no, user_id, status, goods_amount, freight_amount, discount_amount, total_amount,
    coupon_id, address_snapshot, remark, pay_type, paid_at, created_at
  )
  SELECT
    'UM202606070001', seed_user.id, 'paid', 468, 0, 50, 418,
    'c2', address_payload.address, 'seed 示例订单', '微信支付', NOW(), NOW() - INTERVAL '2 days'
  FROM seed_user, address_payload
  WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_no = 'UM202606070001')
  RETURNING id
)
INSERT INTO order_items (order_id, product_id, sku_name, title, price, quantity, cover_text, gradient)
SELECT new_order.id, item.product_id, item.sku_name, item.title, item.price, item.quantity, item.cover_text, item.gradient
FROM new_order
CROSS JOIN (
  VALUES
    ('1002', '云朵白', '智能主动降噪蓝牙耳机', 399::NUMERIC, 1, '降噪耳机', 'linear-gradient(135deg, #f1f4ff 0%, #d8c7ff 100%)'),
    ('1006', '30包', '每日坚果混合装 30 包', 69::NUMERIC, 1, '每日坚果', 'linear-gradient(135deg, #fff1df 0%, #ffd2a6 100%)')
) AS item(product_id, sku_name, title, price, quantity, cover_text, gradient);

WITH seed_order AS (
  SELECT id FROM orders WHERE order_no = 'UM202606070001'
)
INSERT INTO payments (order_id, payment_no, provider, amount, status, paid_at)
SELECT id, 'PAY202606070001', 'wechat', 418, 'success', NOW() - INTERVAL '2 days'
FROM seed_order
ON CONFLICT (payment_no) DO NOTHING;
