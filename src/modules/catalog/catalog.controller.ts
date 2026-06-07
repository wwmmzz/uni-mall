import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ListProductsDto } from './dto/list-products.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('home')
  home() {
    return this.catalogService.home();
  }

  @Get('banners')
  banners() {
    return this.catalogService.getBanners();
  }

  @Get('categories')
  categories() {
    return this.catalogService.getCategories();
  }

  @Get('products')
  products(@Query() query: ListProductsDto) {
    return this.catalogService.listProducts(query);
  }

  @Get('products/hot')
  hotProducts() {
    return this.catalogService.getHotProducts(6);
  }

  @Get('products/new')
  newProducts() {
    return this.catalogService.getNewProducts(6);
  }

  @Get('products/:id')
  product(@Param('id') id: string) {
    return this.catalogService.getProductById(id);
  }
}
