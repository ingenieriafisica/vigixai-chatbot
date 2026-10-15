import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemResponseDto } from './dto/item-response.dto';
import { Item } from './entities/item.schema';

@Controller('items')
@SerializeOptions({ strategy: 'excludeAll' })
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    const item = await this.itemsService.create(createItemDto);
    return new ItemResponseDto(item.toObject());
  }

  @Get()
  async findAll(): Promise<ItemResponseDto[]> {
    const items = await this.itemsService.findAll();
    return items.map(item => new ItemResponseDto(item.toObject()));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    const item = await this.itemsService.findOne(id);
    return new ItemResponseDto(item.toObject());
  }

  @Put(':id')
  async replace(
    @Param('id') id: string,
    @Body() replaceItemDto: CreateItemDto,
  ): Promise<ItemResponseDto> {
    const { userId, ...data } = replaceItemDto;
    const updatedItem = await this.itemsService.update(id, data as UpdateItemDto);
    return new ItemResponseDto(updatedItem.toObject());
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    const updatedItem = await this.itemsService.update(id, updateItemDto);
    return new ItemResponseDto(updatedItem.toObject());
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.itemsService.remove(id);
    return { message: 'Item eliminado correctamente' };
  }
}