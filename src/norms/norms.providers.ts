import { Connection } from 'mongoose';
import { NormSchema } from './entities/norm.schema';

export const normsProviders = [
  {
    provide: 'NORM_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Normas', NormSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
