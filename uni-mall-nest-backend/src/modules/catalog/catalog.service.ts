import { Injectable, NotFoundException } from '@nestjs/common';
import { pageOffset, PageResult } from '../../common/utils/pagination';
import { toNumber } from '../../common/utils/money';
import { DatabaseService } from '../../database/database.service';
import { ListProductsDto } from './dto/list-products.dto';

interface ProductRow {
  id: string;
  title: string;
  description: string;
  category_id: string;
  price: string;
  old_price: string | null;
  sales: number;
  stock: number;
  badge: string | null;
  tags: string[];
  cover_text: string;
  gradient: string;
  specs: string[];
  created_at: Date;
  total_count?: string;
}

interface CategoryRow {
  id: string;
  name: string;
  icon: string | null;
  is_shortcut: boolean;
}

interface BannerRow {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  gradient: string;
}

@Injectable()
export class CatalogService {
  constructor(private readonly databaseService: DatabaseService) {}

  async home() {
    const [banners, categories, hotProducts, newProducts] = await Promise.all([
      this.getBanners(),
      this.getCategories(),
      this.getHotProducts(6),
      this.getNewProducts(6),
    ]);

    return {
      banners,
      categoryTabs: categories.map(({ id, name }) => ({ id, name })),
      categoryShortcuts: categories.filter((item) => item.isShortcut).map(({ id, name, icon }) => ({ id, name, icon })),
      hotProducts,
      newProducts,
    };
  }

  async getBanners() {
    const result = await this.databaseService.query<BannerRow>(
      `
      SELECT id, title, subtitle, button_text, gradient
      FROM banners
      WHERE is_active = TRUE
      ORDER BY sort_no ASC, id ASC
      `,
    );

    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      buttonText: row.button_text,
      gradient: row.gradient,
    }));
  }

  async getCategories() {
    const result = await this.databaseService.query<CategoryRow>(
      `
      SELECT id, name, icon, is_shortcut
      FROM categories
      WHERE is_active = TRUE
      ORDER BY sort_no ASC, id ASC
      `,
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      isShortcut: row.is_shortcut,
    }));
  }

  async listProducts(dto: ListProductsDto): Promise<PageResult<any>> {
    const { page, pageSize, offset } = pageOffset(dto.page, dto.pageSize);
    const params: unknown[] = [];
    const where: string[] = ['p.is_active = TRUE'];

    if (dto.categoryId && dto.categoryId !== 'all') {
      params.push(dto.categoryId);
      where.push(`p.category_id = $${params.length}`);
    }

    if (dto.keyword?.trim()) {
      params.push(`%${dto.keyword.trim()}%`);
      where.push(`(
        p.title ILIKE $${params.length}
        OR p.description ILIKE $${params.length}
        OR p.category_id ILIKE $${params.length}
        OR array_to_string(p.tags || p.specs, ' ') ILIKE $${params.length}
      )`);
    }

    const orderByMap: Record<string, string> = {
      default: 'p.sales DESC, p.created_at DESC',
      sales: 'p.sales DESC, p.created_at DESC',
      price_asc: 'p.price ASC, p.sales DESC',
      price_desc: 'p.price DESC, p.sales DESC',
      newest: 'p.created_at DESC, p.sales DESC',
    };
    const orderBy = orderByMap[dto.sort ?? 'default'];

    params.push(pageSize, offset);
    const limitParam = params.length - 1;
    const offsetParam = params.length;

    const result = await this.databaseService.query<ProductRow>(
      `
      SELECT
        p.id, p.title, p.description, p.category_id, p.price, p.old_price, p.sales,
        p.stock, p.badge, p.tags, p.cover_text, p.gradient, p.specs, p.created_at,
        COUNT(*) OVER() AS total_count
      FROM products p
      WHERE ${where.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT $${limitParam} OFFSET $${offsetParam}
      `,
      params,
    );

    const total = Number(result.rows[0]?.total_count ?? 0);

    return {
      list: result.rows.map((row) => this.mapProduct(row)),
      page,
      pageSize,
      total,
      hasMore: page * pageSize < total,
    };
  }

  async getProductById(id: string) {
    const row = await this.databaseService.oneOrNone<ProductRow>(
      `
      SELECT id, title, description, category_id, price, old_price, sales, stock,
             badge, tags, cover_text, gradient, specs, created_at
      FROM products
      WHERE id = $1 AND is_active = TRUE
      `,
      [id],
    );

    if (!row) {
      throw new NotFoundException('商品不存在或已下架');
    }

    return this.mapProduct(row);
  }

  async getHotProducts(limit = 6) {
    const result = await this.databaseService.query<ProductRow>(
      `
      SELECT id, title, description, category_id, price, old_price, sales, stock,
             badge, tags, cover_text, gradient, specs, created_at
      FROM products
      WHERE is_active = TRUE
      ORDER BY sales DESC, created_at DESC
      LIMIT $1
      `,
      [limit],
    );

    return result.rows.map((row) => this.mapProduct(row));
  }

  async getNewProducts(limit = 6) {
    const result = await this.databaseService.query<ProductRow>(
      `
      SELECT id, title, description, category_id, price, old_price, sales, stock,
             badge, tags, cover_text, gradient, specs, created_at
      FROM products
      WHERE is_active = TRUE
      ORDER BY created_at DESC, id ASC
      LIMIT $1
      `,
      [limit],
    );

    return result.rows.map((row) => this.mapProduct(row));
  }

  private mapProduct(row: ProductRow) {
    return {
      id: row.id,
      title: row.title,
      desc: row.description,
      category: row.category_id,
      price: toNumber(row.price),
      oldPrice: row.old_price === null ? null : toNumber(row.old_price),
      sales: Number(row.sales),
      stock: Number(row.stock),
      badge: row.badge,
      tags: row.tags ?? [],
      coverText: row.cover_text,
      gradient: row.gradient,
      specs: row.specs ?? [],
      createdAt: row.created_at,
    };
  }
}
