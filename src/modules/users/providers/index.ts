import { container } from 'tsyringe';

import IHashProvider from '../providers/HashProviders/models/IHashProvider';
import BCryptHashProvider from '../providers/HashProviders/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>(
  'HashProvider',
  BCryptHashProvider
);
