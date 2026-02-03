import {Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe} from "@nestjs/common";
import {ProductsService} from "./products.service";
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {ProductQueryDto} from "./dto/product-query.dto";
import {UpdateStockDto} from "./dto/update-stock.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      success: true,
      data: product,
      message: "Product created successfully",
    };
  }

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findAll(query);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get("search")
  async search(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findAll(query);
    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  }

  @Get("featured")
  async findFeatured(@Query("limit") limit?: number) {
    const products = await this.productsService.findFeatured(limit);
    return {
      success: true,
      data: products,
    };
  }

  @Get("category/:categoryId")
  async findByCategory(@Param("categoryId", ParseUUIDPipe) categoryId: string, @Query("limit") limit?: number) {
    const products = await this.productsService.findByCategory(categoryId, limit);
    return {
      success: true,
      data: products,
    };
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const product = await this.productsService.findOne(id);
    return {
      success: true,
      data: product,
    };
  }

  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string) {
    const product = await this.productsService.findBySlug(slug);
    return {
      success: true,
      data: product,
    };
  }

  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      success: true,
      data: product,
      message: "Product updated successfully",
    };
  }

  @Patch(":id/stock")
  async updateStock(@Param("id", ParseUUIDPipe) id: string, @Body() updateStockDto: UpdateStockDto) {
    const product = await this.productsService.updateStock(id, updateStockDto.quantity, updateStockDto.operation);
    return {
      success: true,
      data: product,
      message: "Stock updated successfully",
    };
  }

  @Get("inventory/low-stock")
  async findLowStock(@Query("threshold") threshold: number = 10) {
    const products = await this.productsService.findLowStockAt(threshold);
    return {
      success: true,
      data: products,
    };
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.productsService.remove(id);
    return {
      success: true,
      message: "Product deleted successfully",
    };
  }
}
