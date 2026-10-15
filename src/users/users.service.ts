import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from './entities/user.schema';
import { Answer } from 'src/answers/entities/answer.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MODEL') private userModel: Model<User>,
    @Inject('ANSWERS_MODEL') private answerModel: Model<Answer>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userData = { ...createUserDto };

    if (createUserDto.password) {
      userData.password = await bcrypt.hash(createUserDto.password, 12);
    } else {
      delete userData.password; // Remove password field if not provided
    }

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id).exec();
    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con id: ${_id}`);
    }
    return user;
  }

  // buscar usuario con la respuesta
  async findUserWithAnswers(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .populate('respuestas') // <--- ¡Aquí está la clave!
      .exec();

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  // crear una respuesta y asociarla a un usuario
  async createAnswerForUser(
    userId: string,
    role: string,
    content: string,
  ): Promise<Answer> {
    const newAnswer = new this.answerModel({
      role,
      content,
      userId: userId, // Asocia la respuesta al usuario por su ID
    });
    const savedAnswer = await newAnswer.save();

    // Ahora, actualiza el usuario para agregar la referencia a esta nueva respuesta
    await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { respuestas: savedAnswer._id } }, // Agrega el _id de la respuesta al array 'respuestas'
        { new: true, useFindAndModify: false },
      )
      .exec();

    return savedAnswer;
  }

  async findByEmail(correo_electronico: string): Promise<User> {
    const user = await this.userModel.findOne({ correo_electronico }).exec();
    if (!user) {
      throw new NotFoundException(
        `No se encontró el usuario con email: ${correo_electronico}`,
      );
    }
    return user;
  }

  async findByCorreo(correo_electronico: string): Promise<User> {
    const user = await this.userModel.findOne({ correo_electronico }).exec();
    if (!user) {
      throw new NotFoundException(
        `No se encontró el usuario con correo electrónico: ${correo_electronico}`,
      );
    }
    return user;
  }

  async findByUser(usuario_asignado: string): Promise<User> {
    const user = await this.userModel.findOne({ usuario_asignado }).exec();
    if (!user) {
      throw new NotFoundException(
        `No se encontró el usuario con nombre de usuario: ${usuario_asignado}`,
      );
    }
    return user;
  }

  async update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // 🔒 Filtrado explícito - solo campos permitidos (allowlist)
    const allowedFields = [
      'primer_nombre',
      'segundo_nombre',
      'primer_apellido',
      'segundo_apellido',
      'correo_electronico',
      'correo_particular',
      'telefono_entidad',
      'extension_telefonica',
      'numero_celular',
      'direccion_residencia',
      'estado_actual',
      'fecha_fin_contrato',
      'numero_contrato',
      'pais_residencia',
      'dpto_residencia',
      'mncpio_residencia',
      'fecha_nacimiento',
      'tipo_de_identificacion',
    ];

    const sanitizedData: Record<string, any> = {};
    for (const field of allowedFields) {
      const value = (updateUserDto as any)[field];
      if (value !== undefined) {
        sanitizedData[field] = value;
      }
    }

    // 🔒 Prevenir actualización de password por esta ruta
    if ('password' in sanitizedData) {
      delete sanitizedData.password;
    }

    // 🔒 Prevenir campos inmutables aunque vengan en DTO
    delete sanitizedData.tenantId;
    delete sanitizedData.rol_asignado;
    delete sanitizedData.usuario_asignado;
    delete sanitizedData.password;

    const updatedUser = await this.userModel
      .findByIdAndUpdate(_id, sanitizedData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`No se encontró el usuario con id: ${_id}`);
    }
    return updatedUser;
  }

  async remove(_id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(_id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${_id} not found`);
    }
    return deletedUser;
  }
}
