import { Connection } from 'mongoose';
import { ItemSchema } from './entities/item.schema';

export const ItemsProviders = [
  {
    provide: 'ITEMS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Items', ItemSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
