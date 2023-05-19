import { DataSource } from 'typeorm';
import ormConfig from '../ormconfig.json';

export default new DataSource(ormConfig as never);
