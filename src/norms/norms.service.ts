import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateNormDto } from './dto/create-norm.dto';
import { UpdateNormDto } from './dto/update-norm.dto';
import { Norm } from './entities/norm.schema';

@Injectable()
export class NormsService {
  constructor(@Inject('NORM_MODEL') private normModel: Model<Norm>) {}

  async getAllNorms(): Promise<Norm[]> {
    return await this.normModel.find().exec();
  }

  async getNormById(_id: string): Promise<Norm> {
    const norm = await this.normModel.findById(_id).exec();
    if (!norm) {
      throw new NotFoundException(`La norma con ID ${_id} no fue encontrada`);
    }
    return norm;
  }

  async getNormByCod(codigoNorma: string): Promise<Norm> {
    const norm = await this.normModel.findOne({ codigoNorma }).exec();
    if (!norm) {
      throw new NotFoundException(`La norma con código ${codigoNorma} no fue encontrada`);
    }
    return norm;
  }

  async create(createNormDto: CreateNormDto): Promise<Norm> {
    const newNorm = new this.normModel(createNormDto);
    return await newNorm.save();
  }

  async updateNorm(_id: string, updateNormDto: UpdateNormDto): Promise<Norm> {
    // 🔒 Filtrado explícito - allowlist
    const allowedFields = [
      'codigoNorma',
      'versionNorma',
      'normaCertificacion',
      'actividadesClave',
      'criteriosDesempenoGenerales',
      'conocimientosEsenciales',
      'evidenciasRequeridas',
    ];

    const sanitizedData: Record<string, any> = {};
    for (const field of allowedFields) {
      const value = (updateNormDto as any)[field];
      if (value !== undefined) {
        sanitizedData[field] = value;
      }
    }

    const updatedNorm = await this.normModel
      .findByIdAndUpdate(_id, sanitizedData, { new: true })
      .exec();

    if (!updatedNorm) {
      throw new NotFoundException(
        `La norma con _id ${_id} no fue encontrada en la base de datos`,
      );
    }
    return updatedNorm;
  }

  async updateNormCod(
    codigoNorma: string,
    updateNormDto: UpdateNormDto,
  ): Promise<Norm> {
    const allowedFields = [
      'codigoNorma',
      'versionNorma',
      'normaCertificacion',
      'actividadesClave',
      'criteriosDesempenoGenerales',
      'conocimientosEsenciales',
      'evidenciasRequeridas',
    ];

    const sanitizedData: Record<string, any> = {};
    for (const field of allowedFields) {
      const value = (updateNormDto as any)[field];
      if (value !== undefined) {
        sanitizedData[field] = value;
      }
    }

    const updatedNorm = await this.normModel
      .findOneAndUpdate({ codigoNorma }, sanitizedData, { new: true })
      .exec();

    if (!updatedNorm) {
      throw new NotFoundException(
        `La norma con código ${codigoNorma} no existe en la base de datos`,
      );
    }
    return updatedNorm;
  }

  async deleteNorm(_id: string): Promise<Norm> {
    const deletedNorm = await this.normModel.findByIdAndDelete(_id).exec();
    if (!deletedNorm) {
      throw new NotFoundException(
        `La norma con ID ${_id} no fue encontrada para eliminar`,
      );
    }
    return deletedNorm;
  }

  async deleteNormCod(codigoNorma: string): Promise<Norm> {
    const deletedNorm = await this.normModel
      .findOneAndDelete({ codigoNorma })
      .exec();
    if (!deletedNorm) {
      throw new NotFoundException(
        `La norma con ID ${codigoNorma} no fue encontrada para eliminar`,
      );
    }
    return deletedNorm;
  }
}