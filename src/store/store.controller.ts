import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@ApiTags('store')
@Controller('store')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }


    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new store' })
    @ApiBody({
        schema: {
            example: {
                name: 'My Awesome Store',
                description: 'This store sells awesome products.',
                imageUrl: 'https://example.com/store-image.jpg',
                coverImage: 'https://example.com/store-cover.jpg',
                address: '123 Main St'
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Store created successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async createStore(@Body() createStoreDto: CreateStoreDto, @Request() req: any) {
        return this.storeService.create(createStoreDto, req.user.id);
    }


    @Get("getAll")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all stores' })
    @ApiResponse({
        status: 200,
        description: 'Returns an array of stores',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'My Awesome Store',
                    description: 'This store sells awesome products.',
                    imageUrl: 'https://example.com/store-image.jpg',
                    coverImage: 'https://example.com/store-cover.jpg',
                    address: '123 Main St'
                }
            ]
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getAllStores(@Request() req: any) {
        return this.storeService.getAll(req.user.id);
    }

    @Get("public/all")
    @ApiOperation({ summary: 'Get all public stores' })
    @ApiResponse({
        status: 200,
        description: 'Returns an array of stores',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'My Awesome Store',
                    description: 'This store sells awesome products.',
                    imageUrl: 'https://example.com/store-image.jpg',
                    coverImage: 'https://example.com/store-cover.jpg',
                    address: '123 Main St'
                }
            ]
        }
    })
    async getAllPublicStores() {
        return this.storeService.getAllPublic();
    }

    @Get("public/:id")
    @ApiOperation({ summary: 'Get public store by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the store with the specified ID',
        schema: {
            example: {
                id: 1,
                name: 'My Awesome Store',
                description: 'This store sells awesome products.',
                imageUrl: 'https://example.com/store-image.jpg',
                coverImage: 'https://example.com/store-cover.jpg',
                address: '123 Main St'
            }
        }
    })
    async getPublicStoreById(@Param('id') id: string) {
        return this.storeService.getStoreById(+id);
    }

    @Get('getSingleStore/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get store by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the store with the specified ID',
    })
    @ApiResponse({
        status: 404,
        description: 'Store not found',
    })
    async getSingleStore(@Param('id') id: string) {
        return this.storeService.getStoreById(+id);
    }

    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Follow a store' })
    async followStore(@Param('id') id: string, @Request() req: any) {
        return this.storeService.followStore(req.user.id, +id);
    }

    @Delete(':id/follow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Unfollow a store' })
    async unfollowStore(@Param('id') id: string, @Request() req: any) {
        return this.storeService.unfollowStore(req.user.id, +id);
    }

    @Get(':id/is-following')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check if user is following a store' })
    async checkFollowStatus(@Param('id') id: string, @Request() req: any) {
        return this.storeService.isFollowing(req.user.id, +id);
    }


    @Put('updateStore/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update store by ID' })
    @ApiBody({
        schema: {
            example: {
                name: 'Updated Store Name',
                description: 'Updated description.',
                imageUrl: 'https://example.com/updated-store-image.jpg',
                coverImage: 'https://example.com/updated-store-cover.jpg',
                address: '456 Updated St'
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Store updated successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Store not found',
    })
    async updateStore(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto, @Request() req: any) {
        return this.storeService.updateStore(+id, updateStoreDto, req.user.id);
    }



    @Put('owner-status/:ownerId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: "Status update"})
    @ApiResponse({
        status: 200,
        description: "Status update Successfully"
    })
    async toggleOwnerStatus(
        @Param('ownerId') ownerId: number,
        @Body() body: { isActive: boolean },
        @Request() req
    ) {
        return this.storeService.updateOwnerStatus(ownerId, body.isActive, req.user.role);
    }

    @Delete('deleteStore/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete store by ID' })
    @ApiResponse({
        status: 204,
        description: 'Store deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Store not found',
    })
    async deleteStore(@Param('id') id: string, @Request() req: any) {
        return this.storeService.deleteStore(+id, req.user.id);
    }

    @Post('sendMail/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Send email using store SMTP settings' })
    @ApiResponse({
        status: 200,
        description: 'Email sent',
    })
    async sendMail(
        @Param('id') id: string,
        @Body() body: { to: string, subject: string, text?: string, html?: string },
        @Request() req: any
    ) {
        return this.storeService.sendMail(+id, body.to, body.subject, body.text || '', body.html, req.user.id);
    }

}
