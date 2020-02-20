const _ = require("lodash");
const debug = require("debug")("pg-load");
const { Client } = require("pg");

const insertDataSet = async (client, dataSet, dataSetName) => {
  const query = `
  drop table libraries if exists;
  create table libraries (id bigint, signupDuration int);
  create table books (id bigint, score int);
  insert into libraries (id, signupDuration) values ${dataSet.libraries
    .map(({ index, signupDuration }) => `(${index}, ${signupDuration})`)
    .join(" ")}
  insert into books (id, score) values ${dataSet.scores
    .map((score, i) => `(${i}, ${score})`)
    .join(" ")}
    `;
  await client.query(query);
};

const main = async files => {
  if (files.length === 0) {
    debug("no input files");
    return;
  }

  const dataSets = _(files)
    .keyBy(file => file.split(".")[0].replace("-", "_"))
    .mapValues(file => require(`./${file}`))
    .value();

  const client = new Client({
    connectionString: "postgres://postgres@localhost:5432/postgres"
  });

  await client.connect();

  await Promise.all(
    Object.entries(dataSets).map(async ([dataSetName, dataSet]) => {
      const database = dataSetName;
      await client.query(`drop database if exists ${database}`);
      await client.query(`create database ${database}`);
      debug(dataSetName, "database created");
      const dataSetClient = new Client({
        connectionString: `postgres://postgres:postgres@localhost:5432/${database}`
      });
      await dataSetClient.connect();
      await dataSetClient.query("begin");
      try {
        await insertDataSet(client, dataSet, dataSetName);
        await dataSetClient.query("commit");
        debug(dataSetName, "dataset committed");
      } catch (err) {
        await dataSetClient.query("rollback");
        debug(dataSetName, "rolled back", err);
      }
      await dataSetClient.end();
    })
  );

  await client.end();
};

main(process.argv.slice(2));
