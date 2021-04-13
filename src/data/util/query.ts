import { each } from "lodash";

/**
 * Result gotten from a pagination query
 */
export interface PaginationQueryResult<T> {
  /**
   * The current page of results
   */
  page: number;

  /**
   * The number of documents returned in each page
   */
  per_page: number;

  /**
   * Sort order in which the documents are returned. Defaults to `created_at`
   */
  sort: string | object;

  /**
   * Array of found documents
   */
  result: T[];
}

/**
 * A repository query that specifies pagination options
 */
export interface PaginationQuery {
  /**
   * Whether to return deleted files
   */
  archived?: boolean | string;

  /**
   * MongoDB query object
   */
  conditions: any;

  /**
   * The current page of results.  Defaults to 1 (the `1st`) page
   */
  page?: number;

  /**
   * The number of documents returned in each page. Defaults to `20` documents
   */
  per_page?: number;

  /**
   * Specifies which document fields to include or exclude
   */
  projections?: any;

  /**
   * Sort order in which the documents are returned. Defaults to `created_at`
   */
  sort?: string | object;
}

/**
 * Repository query object
 */
export interface Query {
  /**
   * MongoDB query object
   */
  conditions?: object;

  /**
   * Specifies which document fields to include or exclude
   */
  projections?: string | object;

  /**
   * Sort order in which the documents are returned. Defaults to `created_at`
   */
  sort?: string | object;

  /**
   * Whether to return deleted files
   */
  archived?: boolean | string;
}

/**
 * Convert any query to a mongoose query using queryMap. Note that it will
 * only use queries defined in `queryMap` to generate the expected query. Note
 * that you can use `$always` key to set parameters that will always be used.
 * Please don't use this with multiple mongo operators as they'll overwrite
 * each other
 * @param query query to transform
 * @param queryMap definition of expected queries and their arguments
 */
export function fromQueryMap(query: any, queryMap: object) {
  const mongoQuery = {};
  const $orQueries = [];
  each(queryMap, (val: any, key) => {
    if (query[key] != null) {
      // separate $or queries
      if (val.$or) {
        $orQueries.push(val.$or);
        delete val.$or;
      }

      Object.assign(mongoQuery, val);
    }
  });

  if (queryMap["$always"]) {
    Object.assign(mongoQuery, queryMap["$always"]);
  }

  if ($orQueries.length === 1) {
    mongoQuery["$or"] = $orQueries[0];
  } else if ($orQueries.length > 1) {
    mongoQuery["$and"] = $orQueries.map(query => ({ $or: query }));
  }

  return mongoQuery;
}

export function orFromQueryMap(query: any, queryMap: object) {
  const mongoQuery = {};

  each(queryMap, (val: any, key) => {
    if (query[key] != null) {
      Object.assign(mongoQuery, val);
      return;
    }
  });

  if (queryMap["$always"]) {
    Object.assign(mongoQuery, queryMap["$always"]);
  }

  return mongoQuery;
}

export function paginate(query: PaginationQuery) {
  const page = Number(query.page) > 1 ? Number(query.page) - 1 : 1;
  const per_page = Number(query.per_page) || 20;
  const offset = page * per_page;

  return [per_page, offset];
}
