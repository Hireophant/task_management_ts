interface ObjectPagination {
  currentPage: number;
  limitItems: number;
}

interface ObjectPaginationResult extends ObjectPagination {
  skip: number;
  totalPage: number;
}

const paginationHelper = (
  objectPagination: ObjectPagination,
  query: Record<string, any>,
  countRecords: number
): ObjectPaginationResult => {
  const result: ObjectPaginationResult = {
    ...objectPagination,
    skip: 0,
    totalPage: 0,
  };

  if (query.page) {
    result.currentPage = parseInt(query.page);
  }
  if (query.limit) {
    result.limitItems = parseInt(query.limit);
  }

  result.skip = (result.currentPage - 1) * result.limitItems;
  result.totalPage = Math.ceil(countRecords / result.limitItems);

  return result;
};

export default paginationHelper;
