import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by id' })
  @ApiResponse({ status: 200 })
  findOne(@Param('id') id: number) {
    return this.feedbackService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create feedback' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update feedback' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: number, @Body() dto: CreateFeedbackDto) {
    return this.feedbackService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: number) {
    return this.feedbackService.remove(id);
  }
}
