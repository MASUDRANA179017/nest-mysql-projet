import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog } from "../entity/blog.entity";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { User } from "../entity/user.entity";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateBlogDto, vendorId: number) {
    const vendor = await this.userRepo.findOne({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException("Vendor not found");
    const count = await this.blogRepo.count({ where: { vendor: { id: vendorId } } });
    if (count >= 3) throw new ForbiddenException("Blog limit reached");
    const blog = this.blogRepo.create({ ...dto, vendor });
    return this.blogRepo.save(blog);
  }

  async update(id: number, dto: UpdateBlogDto, vendorId: number) {
    const blog = await this.blogRepo.findOne({ where: { id }, relations: ["vendor"] });
    if (!blog) throw new NotFoundException("Blog not found");
    if (blog.vendor?.id !== vendorId) throw new ForbiddenException("Not allowed");
    Object.assign(blog, dto);
    return this.blogRepo.save(blog);
  }

  async delete(id: number, vendorId: number) {
    const blog = await this.blogRepo.findOne({ where: { id }, relations: ["vendor"] });
    if (!blog) throw new NotFoundException("Blog not found");
    if (blog.vendor?.id !== vendorId) throw new ForbiddenException("Not allowed");
    await this.blogRepo.delete(id);
    return { deleted: true };
  }

  async getAll() {
    return this.blogRepo.find({ order: { createdAt: "DESC" }, relations: ["vendor"] });
  }

  async getByVendor(vendorId: number, limit?: number) {
    return this.blogRepo.find({
      where: { vendor: { id: vendorId } },
      order: { createdAt: "DESC" },
      take: limit,
      relations: ["vendor"],
    });
  }
 
  async getById(id: number) {
    const blog = await this.blogRepo.findOne({ where: { id }, relations: ["vendor"] });
    if (!blog) throw new NotFoundException("Blog not found");
    return blog;
  }
}
