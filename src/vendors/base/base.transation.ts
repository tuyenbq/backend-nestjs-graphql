import { COMMON_ERROR } from '../../configs/constants/error-code/base';
import {
  BaseEntity,
  DataSource,
  DataSourceOptions,
  QueryRunner,
} from 'typeorm';
import dbConfig from '../../configs/db/mySql';
import { BaseException } from '../exceptions/base.exception';

export const initDatasource = async () => {
  const dataSource = new DataSource(dbConfig as DataSourceOptions);
  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (error) {
    console.error('Error during Data Source initialization', error);
  }
  return dataSource;
};

export const startTransation = async () => {
  const dataSource = await initDatasource();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};

export const handleTransation = async (queryRunner: QueryRunner, _callBack) => {
  if (typeof _callBack !== 'function') {
    throw new BaseException(
      COMMON_ERROR.CALLBACK_NOT_IS_FUNCTION,
      COMMON_ERROR.CALLBACK_NOT_IS_FUNCTION_MSG,
    );
  }
  try {
    await _callBack();
    await queryRunner.commitTransaction();
    console.log('Transation has been commit!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.log('Transation has been rollback!');
    if (error instanceof BaseException) {
      throw error;
    }
    throw new BaseException(
      COMMON_ERROR.ERROR,
      error.message || COMMON_ERROR.TRANSATION_FAIL_MSG,
    );
  } finally {
    await queryRunner.release();
    console.log('Transation has been release!');
  }
};

/**
 * save many item with or without transaction before
 * @param entities
 * @param queryBuilder
 * @returns
 */
export const saveMany = async (
  entities: BaseEntity[],
  queryBuilder?: QueryRunner,
) => {
  const res = [];
  if (queryBuilder) {
    for (const entity of entities) {
      res.push(await queryBuilder.manager.save(entity));
    }
  } else {
    queryBuilder = await startTransation();
    await handleTransation(queryBuilder, async () => {
      for (const entity of entities) {
        res.push(await queryBuilder.manager.save(entity));
      }
    });
  }
  return res;
};
