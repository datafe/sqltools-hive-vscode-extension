import { ILanguageServerPlugin } from '@sqltools/types';
import HiveSQL from './driver';
import { DRIVER_ALIASES } from './../constants';

const HiveSQLDriverPlugin: ILanguageServerPlugin = {
  register(server) {
    DRIVER_ALIASES.forEach(({ value }) => {
      server.getContext().drivers.set(value, HiveSQL);
    });
  }
}

export default HiveSQLDriverPlugin;