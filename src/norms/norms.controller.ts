import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  NotFoundException,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { NormsService } from './norms.service';
import { CreateNormDto } from './dto/create-norm.dto';
import { UpdateNormDto } from './dto/update-norm.dto';
import { NormResponseDto } from './dto/norm-response.dto';

@Controller('norms')
@SerializeOptions({ strategy: 'excludeAll' })
export class NormsController {
  constructor(private readonly normsService: NormsService) {}

  @Get()
  async getAllNorms(): Promise<NormResponseDto[]> {
    const norms = await this.normsService.getAllNorms();
    return norms.map(n => new NormResponseDto(n));
  }

  @Get(':id')
  async getNorm(@Param('id') id: string): Promise<NormResponseDto> {
    const norm = await this.normsService.getNormById(id);
    return new NormResponseDto(norm);
  }

  @Get('codigo/:codigoNorma')
  async getNormCod(@Param('codigoNorma') codigoNorma: string): Promise<NormResponseDto> {
    const norm = await this.normsService.getNormByCod(codigoNorma);
    return new NormResponseDto(norm);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNormDto: CreateNormDto): Promise<NormResponseDto> {
    const norm = await this.normsService.create(createNormDto);
    return new NormResponseDto(norm);
  }

  @Patch(':id')
  async updateNorm(
    @Param('id') id: string,
    @Body() updateNormDto: UpdateNormDto,
  ): Promise<NormResponseDto> {
    const norm = await this.normsService.updateNorm(id, updateNormDto);
    return new NormResponseDto(norm);
  }

  @Patch('codigo/:codigoNorma')
  async updateNormCod(
    @Param('codigoNorma') codigoNorma: string,
    @Body() updateNormDto: UpdateNormDto,
  ): Promise<NormResponseDto> {
    const norm = await this.normsService.updateNormCod(codigoNorma, updateNormDto);
    return new NormResponseDto(norm);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNorm(@Param('id') id: string): Promise<{ message: string }> {
    await this.normsService.deleteNorm(id);
    return { message: 'Norma eliminada correctamente' };
  }

  @Delete('codigo/:codigoNorma')
  @HttpCode(HttpStatus.OK)
  async deleteNormCod(@Param('codigoNorma') codigoNorma: string): Promise<{ message: string }> {
    await this.normsService.deleteNormCod(codigoNorma);
    return { message: 'Norma eliminada correctamente' };
  }
}