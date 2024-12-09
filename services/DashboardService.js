const { InfluxDB, QueryApi } = require('@influxdata/influxdb-client');
const { getEnvs } = require('../envs');

// Load environment variables for InfluxDB configuration
const { INFLUX } = getEnvs();

// Initialize InfluxDB client and query API
const influxDB = new InfluxDB({ url: INFLUX.HOST, token: INFLUX.TOKEN });
const queryApi = influxDB.getQueryApi(INFLUX.ORG);

class DashboardService {
  /**
   * Fetches sensor data from InfluxDB for the past 5 minutes.
   * @returns {Promise<object[]>} An array of sensor data points.
   */
  static async fetchSensorData() {
    const query = `
      from(bucket: "${INFLUX.BUCKET}")
      |> range(start: -5m)
      |> filter(fn: (r) => r._measurement == "environment_data")
      |> keep(columns: ["_time", "_field", "_value", "device_id"])
    `;

    try {
      const results = [];
      return new Promise((resolve, reject) => {
        queryApi.queryRows(query, {
          next: (row, tableMeta) => {
            const data = tableMeta.toObject(row);
            results.push({
              time: data._time,
              field: data._field,
              value: data._value,
              device_id: data.device_id,
            });
          },
          error: (error) => {
            console.error('Error querying InfluxDB:', error);
            reject(error);
          },
          complete: () => {
            resolve(results);
          },
        });
      });
    } catch (error) {
      console.error('Failed to fetch sensor data:', error);
      throw error;
    }
  }
}

module.exports = DashboardService;
