import { BASE_REPOSITORY_ERROR } from '../../configs/constants/error-code/base';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseException } from '../exceptions/base.exception';
import { DataAndPagination } from '../schema/base.schema';

export class BaseRepository<Entity> extends Repository<Entity> {
  async pagination(
    where: any,
    page: number,
    pageSize: number,
    order = {},
  ): Promise<DataAndPagination<Entity>> {
    const skip = (page - 1) * pageSize;
    if (typeof page !== 'number' || page < 0) {
      throw new BaseException(
        BASE_REPOSITORY_ERROR.PAGE_ERROR,
        BASE_REPOSITORY_ERROR.PAGE_ERROR_MSG,
      );
    }
    if (typeof pageSize !== 'number' || pageSize < 0) {
      throw new BaseException(
        BASE_REPOSITORY_ERROR.PAGE_SIZE_ERROR,
        BASE_REPOSITORY_ERROR.PAGE_SIZE_ERROR_MSG,
      );
    }
    const [data, totalCount] = await this.findAndCount({
      order,
      where,
      take: pageSize,
      skip,
    });
    return this.dataAndPagination(data, totalCount, pageSize, page);
  }

  async paginationQueryBuilder(
    queryBuilder: SelectQueryBuilder<Entity>,
    page: number,
    pageSize: number,
  ) {
    if (typeof page !== 'number' || page < 0) {
      throw new BaseException(
        BASE_REPOSITORY_ERROR.PAGE_ERROR,
        BASE_REPOSITORY_ERROR.PAGE_ERROR_MSG,
      );
    }
    if (typeof pageSize !== 'number' || pageSize < 0) {
      throw new BaseException(
        BASE_REPOSITORY_ERROR.PAGE_SIZE_ERROR,
        BASE_REPOSITORY_ERROR.PAGE_SIZE_ERROR_MSG,
      );
    }
    const skip = (page - 1) * pageSize;
    const [data, totalCount] = await queryBuilder
      .take(pageSize)
      .skip(skip)
      .getManyAndCount();
    return this.dataAndPagination(data, totalCount, pageSize, page);
  }

  dataAndPagination(
    data = [],
    totalCount: number,
    pageSize: number,
    currentPage: number,
  ) {
    const pageTotal = Math.ceil(totalCount / pageSize);
    return {
      items: data,
      pagination: {
        pageTotal,
        totalCount,
        currentPage,
        pageSize,
      },
    };
  }

  /**
   * map object column DB to Entity
   * @param column Object
   * @returns Entity
   * @author HuuTC
   */
  mapColumnToEntity(column): Entity {
    const _entityTarget = new Object();
    const columns = this.metadata.columns;
    const dateType = [
      'date',
      'datetime',
      'datetime2',
      'datetimeoffset',
      'time',
      'time with time zone',
      'time without time zone',
      'timestamp',
      'timestamp without time zone',
      'timestamp with time zone',
      'timestamp with local time zone',
    ];
    const numberType = ['int', 'bigint', 'smallint', 'tinyint'];
    for (const item of columns) {
      if (column.hasOwnProperty(item.databaseName)) {
        const type: any = item.type;
        if (dateType.indexOf(type) !== -1) {
          _entityTarget[item.propertyName] = column[item.databaseName];
        } else if (numberType.indexOf(type) !== -1) {
          _entityTarget[item.propertyName] = Number(column[item.databaseName]);
        } else {
          if (typeof type === 'function') {
            _entityTarget[item.propertyName] = column[item.databaseName]
              ? type(column[item.databaseName])
              : column[item.databaseName];
          } else {
            _entityTarget[item.propertyName] = column[item.databaseName];
          }
        }
      }
    }
    return this.create(_entityTarget as DeepPartial<Entity>);
  }
}
