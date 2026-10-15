import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.schema';

@Injectable()
export class ItemsService {
  constructor(@Inject('ITEMS_MODEL') private ItemModel: Model<Item>) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const newItem = new this.ItemModel(createItemDto);
    return await newItem.save();
  }

  async findAll(): Promise<Item[]> {
    return await this.ItemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    const Item = await this.ItemModel.findOne({ _id: id }).exec();
    if (!Item) {
      throw new NotFoundException(
        `el Item con el id: ${id} no está en la base de datos`,
      );
    }
    return Item;
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    // 🔒 Filtrado explícito - solo campos permitidos (allowlist)
    const allowedFields = [
      'modeloIA',
      'codigoNorma',
      'codigoItem',
      'role',
      'content',
      'evidenciasConocimiento',
      'conocimientoEsencial',
      'criterioDesempeno',
      'tipoCriterioConocimiento',
      'actividad',
      'niveldeCompetencia',
      'descripcionNiveldeCompetencia',
    ];

    const sanitizedData: Record<string, any> = {};
    for (const field of allowedFields) {
      const value = (updateItemDto as any)[field];
      if (value !== undefined) {
        sanitizedData[field] = value;
      }
    }

    // 🔒 Prevenir campos inmutables
    delete sanitizedData.userId;
    delete sanitizedData.createdAt;
    delete sanitizedData.updatedAt;

    const updatedItem = await this.ItemModel.findOneAndUpdate(
      { _id: id },
      sanitizedData,
      { new: true },
    ).exec();
    if (!updatedItem) {
      throw new NotFoundException(`el Item con el id: ${id} no se encontró`);
    }
    return updatedItem;
  }

  async remove(id: string): Promise<Item> {
    const deletedItem = await this.ItemModel.findByIdAndDelete(id).exec();
    if (!deletedItem) {
      throw new NotFoundException(`el Item con el id: ${id} no fué hallado`);
    }
    return deletedItem;
  }
}