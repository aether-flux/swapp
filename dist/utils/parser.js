"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractQuery = abstractQuery;
function parseQuery(query) {
    const filterRx = /(\w+)\s*(=|!=|>|<|>=|<=)\s*(?:"([^"]*)"|'([^']*)'|(\d+))/g;
    const orderRx = /ORDER BY (\w+)\s*(ASC|DESC)?/i;
    // WHERE clause
    const filters = [];
    let match;
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
    const orderBy = orderByMatch ? { field: orderByMatch[1], direction: orderByMatch[2] || 'ASC' } : null;
    return { filters, orderBy };
}
// Convert parsed query to MongoDB syntax
function toMongoQuery(parsedQuery) {
    const mq = {};
    // WHERE clause
    parsedQuery.filters.forEach((filter) => {
        switch (filter.operator) {
            case '=':
                mq[filter.field] = filter.value;
                break;
            case '!=':
                mq[filter.field] = { $ne: filter.value };
                break;
            case '>':
                mq[filter.field] = { $gt: filter.value };
                break;
            case '<':
                mq[filter.field] = { $lt: filter.value };
                break;
            case '>=':
                mq[filter.field] = { $gte: filter.value };
                break;
            case '<=':
                mq[filter.field] = { $lte: filter.value };
                break;
            default:
                throw new Error('Invalid query.');
        }
    });
    return {
        query: mq,
        sort: parsedQuery.orderBy ? { [parsedQuery.orderBy.field]: parsedQuery.orderBy.direction === 'ASC' ? 1 : -1 } : null
    };
}
// Convert parsed query to Supabase syntax
function toSupabaseQuery(parsedQuery) {
    const operatorMap = {
        "=": "eq",
        "!=": "neq",
        ">": "gt",
        "<": "lt",
        ">=": "gte",
        "<=": "lte"
    };
    let filters = parsedQuery.filters.map((filter) => ({
        field: filter.field,
        operator: operatorMap[filter.operator] || filter.operator, // Convert SQL-style operator
        value: filter.value
    }));
    return {
        filters,
        orderBy: parsedQuery.orderBy ? parsedQuery.orderBy : null
    };
}
// Function to get query of chosen database's syntax
function abstractQuery(query, dbType) {
    if (dbType === 'mongodb') {
        return toMongoQuery(parseQuery(query));
    }
    else if (dbType === 'supabase') {
        return toSupabaseQuery(parseQuery(query));
    }
    else {
        throw new Error("Unsupported database type.");
    }
}
