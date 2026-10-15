import { Connection } from 'mongoose';
import { UserSchema } from './entities/user.schema';

export const usersProviders = [
  {
    provide: 'USERS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Usuarios', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
