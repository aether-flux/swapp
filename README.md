# Swapp.js - The Universal DB Adapter for Effortless CRUD
#### Skip the setup. Write once, query everywhere.
<hr />
Swapp.js is an easy-to-use database adapter that lets you use a single SQL-like query language across both SQL (like Supabase) and NoSQL (like MongoDB) databases.

Forget about the hectic boilerplate copy-pasting for database setups. Swapp lets you set up a database in a single statement, so that you can now spend your time actually building your app, not on configuring the database itself.

Currently, Swapp.js supports **MongoDB** and **Supabase**. More databases are under development and support will increase soon.

[Swapp.js NPM Page](https://www.npmjs.com/package/swapp.js)

## Installation
Swapp.js can be installed simply by using the Node Package Manager (npm):
```
npm install swapp.js --legacy-peer-deps
```
or
```
yarn add swapp.js
```

**Note:** By default, npm v7+ installs peerDependencies by default. To prevent this, use --legacy-peer-deps as above. Otherwise, it would install all peerDependencies automatically, like mongodb, @supabase/supabase-js and all the supported databases' packages.

## Configuring a Database
#### MongoDB
```js
const db = new Swapp({
  provider: "mongodb",
  config: {
    connectionString: "<mongodb-connection-string>",
    dbName: "<mongodb-database-name>"
  }
});
await db.initialize();
```

#### Supabase
```js
const db = new Swapp({
  provider: "supabase",
  config: {
    supabaseKey: "<Supabase-Key>",
    supabaseUrl: "<Supabase-URL>"
  }
});
await db.initialize();
```

## CRUD Operations
This is where the fun factor of Swapp.js starts. The syntax for these operations remain the same, no matter which database (SQL/NoSQL) you choose.
#### Create/Save (C)
```js
await db.save("pokemon", {name: "Greninja", level: 45});
// db.save(collection: string, data: object);
```
#### Read/Get (R)
```js
await db.get("pokemon", 'WHERE name = "Greninja"');
// db.get(collection: string, query?: string);
// If no query is passed, all contents of the database will be listed.
```
#### Update (U)
```js
await db.update("pokemon", 'WHERE name = "Greninja"', {name: "Lucario", level: 45});
// db.update(collection: string, query: string, updateData: object);
```
#### Delete (D)
```js
await db.delete("pokemon", 'WHERE level = 45');
// db.delete(collection: string, query: string);
```

## The Query Language
In the above examples, the query used is a SQL-like query language, that is internally translated and adapted into the database chosen by the user. This query language is not as huge as SQL, but supports the extreme basics required for most operations: WHERE, ORDER BY and AND.
#### WHERE
This clause checks which fields satisfy the condition described in the clause. Example, 'WHERE name = "Greninja"' will check for entries in the DB with the field name having the value "Greninja".

**Example usage:** WHERE name = "Greninja" AND level = 45

#### ORDER BY
This clause returns the result of the search in the database and arranges it in the specified order (either ascending (ASC) or descending (DESC)).

**Example usage:** ORDER BY level      // uses ascending order by default
**Example usage:** ORDER BY level ASC     // ascending order
**Example usage:** ORDER BY level DESC    // descending order

## Support Me
Maintaining and improving Swapp.js takes time and effort. If you find it helpful and want to show some love, consider [buying me a coffee](https://buymeacoffee.com/aetherflux/)! Your support helps me keep the project alive and improve it further.

## License
This project is licensed under the MIT License.
