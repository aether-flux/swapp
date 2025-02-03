function parseQuery (query: string) {
  const filterRx = /(\w+)\s*(=|!=|>|<|>=|<=)\s*(?:"([^"]*)"|'([^']*)'|(\d+))/g;
  const orderRx = /ORDER BY (\w+)\s*(ASC|DESC)?/i;

  // WHERE clause

  const filters = [];
  let match: any;

  while ((match = filterRx.exec(query)) !== null) {
    let value = match[3] || match[4] || match[5];
    
    if (match[5] !== undefined) {
      value = Number(match[5]);
    }

    filters.push({
      field: match[1],
      operator: match[2],
      value: value
    });
  }

  // ORDER BY clause
  const orderByMatch = orderRx.exec(query);
  const orderBy = orderByMatch ? {field: orderByMatch[1], direction: orderByMatch[2] || 'ASC'} : null;

  return {filters, orderBy};
}

function toMongoQuery (parsedQuery: any) {
  const mq: any = {};

  // WHERE clause
  parsedQuery.filters.forEach((filter: any) => {
    switch (filter.operator) {
      case '=':
        mq[filter.field] = filter.value;
        break;
      case '!=':
        mq[filter.field] = {$ne: filter.value};
        break;
      case '>':
        mq[filter.field] = {$gt: filter.value};
        break;
      case '<':
        mq[filter.field] = {$lt: filter.value};
        break;
      case '>=':
        mq[filter.field] = {$gte: filter.value};
        break;
      case '<=':
        mq[filter.field] = {$lte: filter.value};
        break;
      default:
        throw new Error('Invalid query.');
    }
  })

  return {
    query: mq,
    sort: parsedQuery.orderBy ? { [parsedQuery.orderBy.field]: parsedQuery.orderBy.direction === 'ASC' ? 1 : -1 } : null
  }
}

function toSupabaseQuery (parsedQuery: any) {
  const operatorMap: any = {
    "=": "eq",
    "!=": "neq",
    ">": "gt",
    "<": "lt",
    ">=": "gte",
    "<=": "lte"
  };

  let filters = parsedQuery.filters.map((filter: any) => ({
    field: filter.field,
    operator: operatorMap[filter.operator] || filter.operator,  // Convert SQL-style operator
    value: filter.value
  }));

  return {
    filters,
    orderBy: parsedQuery.orderBy ? parsedQuery.orderBy : null
  };
}

export function abstractQuery (query: string, dbType: string) {
  if (dbType === 'mongodb') {
    return toMongoQuery(parseQuery(query));
  } else if (dbType === 'supabase') {
    return toSupabaseQuery(parseQuery(query));
  } else {
    throw new Error("Unsupported database type.");
  }
}
