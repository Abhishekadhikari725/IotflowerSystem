/**
 * @typedef {object} INFLUX_CONF
 * @property {string} HOST Address to InfluxDB
 * @property {string} ORG Organization
 * @property {string} BUCKET Bucket name
 * @property {string} TOKEN Token name
 */

/**
 * @typedef {object} ENV
 * @property {INFLUX_CONF} INFLUX
 */

/** @type {ENV} */
const ENV = {
    INFLUX: {
        HOST: '',
        ORG: '',
        BUCKET: '',
        TOKEN: ''
    }
}

/**
 * Gets the environment variables
 * @returns {ENV}
 * @throws {Error}
 */
const getEnvs = () => {
    if (ENV.INFLUX.HOST == '') {
        try {
            // influx
            ENV.INFLUX.HOST = process.env.DB_INFLUX_HOST || 'http://localhost:8086';
            ENV.INFLUX.ORG = process.env.DB_INFLUX_ORG || (() => { throw new Error('INFLUX_ORG is not defined'); })();
            ENV.INFLUX.BUCKET = process.env.DB_INFLUX_BUCKET || (() => { throw new Error('INFLUX_BUCKET is not defined'); })();
            ENV.INFLUX.TOKEN = process.env.DB_INFLUX_TOKEN || (() => { throw new Error('INFLUX_TOKEN is not defined'); })();
            return ENV;
        } catch(err) {
            console.error(err);
            process.exit(1);
        }
    } else {
        return ENV;
    }
};

module.exports = { getEnvs };