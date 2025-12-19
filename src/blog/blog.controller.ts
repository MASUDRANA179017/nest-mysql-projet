import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards, ParseIntPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../jwt-auth.guard";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@ApiTags("blog")
@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get("all")
  @ApiOperation({ summary: "Get all blogs" })
  @ApiResponse({ status: 200 })
  async getAll() {
    return this.blogService.getAll();
  }

  @Get("vendor/:vendorId")
  @ApiOperation({ summary: "Get blogs by vendor" })
  @ApiResponse({ status: 200 })
  async getByVendor(@Param("vendorId", ParseIntPipe) vendorId: number, @Query("limit") limit?: string) {
    const take = limit ? Number(limit) : undefined;
    return this.blogService.getByVendor(vendorId, take);
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create blog" })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateBlogDto, @Request() req: any) {
    return this.blogService.create(dto, req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get blog by id" })
  @ApiResponse({ status: 200 })
  async getById(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.getById(id);
  }

  @Put("update/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update blog" })
  @ApiResponse({ status: 200 })
  async update(@Param("id") id: string, @Body() dto: UpdateBlogDto, @Request() req: any) {
    return this.blogService.update(+id, dto, req.user.id);
  }

  @Delete("delete/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete blog" })
  @ApiResponse({ status: 200 })
  async delete(@Param("id") id: string, @Request() req: any) {
    return this.blogService.delete(+id, req.user.id);
  }
}
