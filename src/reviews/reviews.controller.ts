import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';

@Controller('reviews')
@SerializeOptions({ strategy: 'excludeAll' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getAllReviews(): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewsService.getAllReviews();
    return reviews.map(r => new ReviewResponseDto(r));
  }

  @Get(':id')
  async getReviewByTheId(@Param('id') _id: string): Promise<ReviewResponseDto> {
    const review = await this.reviewsService.getReviewById(_id);
    return new ReviewResponseDto(review);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReview(@Body() createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    const review = await this.reviewsService.create(createReviewDto);
    return new ReviewResponseDto(review);
  }

  @Put(':id')
  async updateReview(
    @Param('id') _id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewsService.updateReview(_id, updateReviewDto);
    return new ReviewResponseDto(review);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Param('id') _id: string): Promise<void> {
    await this.reviewsService.deleteReview(_id);
  }
}