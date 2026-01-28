import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { CreateProductDto } from "./dto/crate-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";


@ApiTags("product")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new product" })
  @ApiBody({
    schema: {
      example: {
        name: "Laptop",
        description: "A high-performance laptop",
        price: 999,
        stock: 100,
        barcode: "123456789",
        manufactureDate: "2024-01-15",
        expireDate: "2026-01-15"
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: "Product created successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  @ApiResponse({
    status: 404,
    description: "Store or Category not found",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
  })
  async createProduct(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    return this.productService.createProduct(createProductDto, req.user.id);
  }

  @Get("getAll")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: 200,
    description: "Products retrieved successfully",
    schema: {
      example: [
        {
          id: 1,
          name: "Laptop",
          description: "A high-performance laptop",
          price: 999,
          stock: 100,
          barcode: "123456789",
          manufactureDate: "2024-01-15",
          expireDate: "2026-01-15"
        }
      ]
    }
  })
  @ApiResponse({
    status: 403,
    description: "Products not found",
  })
  async getAllProducts(@Query('type') type?: string) {
    return this.productService.getAllProducts(type);
  }

  @Get("store/:storeId")
  @ApiOperation({ summary: "Get all products by store ID" })
  @ApiResponse({
    status: 200,
    description: "Products retrieved successfully",
  })
  async getProductsByStoreId(@Param("storeId") storeId: string) {
    return this.productService.getProductsByStoreId(+storeId);
  }

  @Get("vendorProduct")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: 200,
    description: "Products retrieved successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Products not found",
  })
  async userRoleProducts(@Request() req: any, @Query('type') type?: string) {
    return this.productService.vendorProduct(req.user.id, type);
  }

  @Get("vendor/services")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getVendorServices(@Request() req: any) {
    return this.productService.vendorProduct(req.user.id, 'service');
  }

  @Get("vendor/products")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getVendorProducts(@Request() req: any) {
    return this.productService.vendorProduct(req.user.id, 'product');
  }

  @Post("create/service")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createService(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    createProductDto.isService = true;
    return this.productService.createProduct(createProductDto, req.user.id);
  }

  @Post("create/product")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPhysicalProduct(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    createProductDto.isService = false;
    return this.productService.createProduct(createProductDto, req.user.id);
  }


  @Get("getById/:id")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product details",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  async getProductById(@Param("id") id: string, @Request() req: any) {
    return this.productService.getProductById(id);

  }


  @Put("update/service/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update Service by ID" })
  async updateService(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto, @Request() req: any) {
    return this.productService.updateService(id, updateProductDto, req.user.id);
  }

  @Put("update/product/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update Physical Product by ID" })
  async updatePhysicalProduct(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto, @Request() req: any) {
    return this.productService.updatePhysicalProduct(id, updateProductDto, req.user.id);
  }

  @Put("update/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update product by ID" })
  @ApiBody({
    schema: {
      example: {
        name: "Updated Laptop",
        description: "Updated description.",
        price: 1099,
        stock: 80,
        barcode: "987654321",
        manufactureDate: "2024-02-01",
        expireDate: "2027-02-01"
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: "Product updated successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  @ApiResponse({
    status: 500,
    description: "amar api jamela ache update product service a"
  })
  async updateProduct(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto, @Request() req: any) {

    return this.productService.updateProduct(id, updateProductDto, req.user.id);
  }


  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete product by ID" })
  @ApiResponse({
    status: 200,
    description: "Product deleted successfully",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
  })
  @ApiResponse({
    status: 404,
    description: "Product not found",
  })
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
  })
  async deleteProduct(@Param("id") id: string, @Request() req: any) {
    return this.productService.deleteProduct(id, req.user.id);
  }

}

