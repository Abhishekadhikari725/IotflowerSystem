const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { getEnvs } = require('../envs');

const ENV = getEnvs();

const DB_CLIENT = new InfluxDB({
    url: ENV.INFLUX.HOST,
    token: ENV.INFLUX.TOKEN
});

const DB_WRITE_POINT = DB_CLIENT.getWriteApi(
    ENV.INFLUX.ORG,
    ENV.INFLUX.BUCKET
);

DB_WRITE_POINT.useDefaultTags({ app: 'sensorData' });

module.exports = { DB_WRITE_POINT, Point };