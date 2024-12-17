# Backend API Documentation

This repository contains the backend for a smart irrigation system that handles device management, sensor data collection, scheduling, and pump control. The backend is built with Node.js and Express, and uses MySQL for relational data and InfluxDB for time-series data.

# Demo Videos of IoT Flower

- Watering the flower:

  [![Watch the video](https://img.youtube.com/vi/KV8GZOnwDzo/0.jpg)](https://www.youtube.com/watch?v=KV8GZOnwDzo)


## Table of Contents

- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Frontend Routes](#frontend-routes)
  - [Embedded Routes](#embedded-routes)
- [Database Models](#database-models)
- [Services and Schedulers](#services-and-schedulers)
- [Cron Jobs](#cron-jobs)
- [Running the Application](#running-the-application)
- [License](#license)

---

## Project Setup

### Prerequisites

- **Node.js** (v14 or above)
- **MySQL** database
- **InfluxDB** for time-series data

### Install Dependencies

Clone the repository and install dependencies:

```bash
npm install
```

### Database Setup

1. **MySQL Database:** Create a MySQL database and update the `.env` file with your database credentials.
2. **InfluxDB:** Ensure InfluxDB is running and update the `.env` file with your InfluxDB configuration.

Run the following command to create database tables:

```bash
npm run migrate
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MySQL Credentials
DB_HOST=your_mysql_host
DB_PORT=your_mysql_port
DB_NAME=your_mysql_db_name
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_SOCKET_PATH=your_socket_path

# InfluxDB Credentials
DB_INFLUX_HOST=http://your_influx_host:port
DB_INFLUX_ORG=your_organization
DB_INFLUX_BUCKET=your_bucket_name
DB_INFLUX_TOKEN=your_api_token
```

## API Endpoints

### Frontend Routes

| **Endpoint**                | **Method** | **Description**                         |
|------------------------------|------------|-----------------------------------------|
| `/devices`                  | `GET`      | Fetch all devices                       |
| `/schedule`                 | `POST`     | Create a new schedule                   |
| `/pump-status`              | `GET`      | Get pump activation status              |
| `/set-pump-status`          | `POST`     | Update pump activation status           |
| `/dashboard-data`           | `GET`      | Get sensor data for dashboard           |
| `/logs`                     | `GET`      | Fetch logs for a specific device        |
| `/schedules`                | `GET`      | Fetch schedules for a specific device   |

### Embedded Routes

| **Endpoint**                | **Method** | **Description**                         |
|------------------------------|------------|-----------------------------------------|
| `/should-activate-pump`     | `GET`      | Fetch pump activation instructions      |
| `/sensor-data`              | `POST`     | Submit sensor data                      |

## Database Models

### Device

- `device_id` (Primary Key, Auto Increment)
- `flower_id` (Integer)
- `location` (String)
- `status` (Enum: `active`/`inactive`)
- `time_interval` (Integer)

### Log

- `log_id` (Primary Key, Auto Increment)
- `device_id` (Foreign Key)
- `action` (String)
- `details` (Text)

### Schedule

- `schedule_id` (Primary Key, Auto Increment)
- `device_id` (Foreign Key)
- `start_date` (Date)
- `end_date` (Date)
- `time` (Time)
- `interval` (Integer)
- `completed` (Boolean)

## Services and Schedulers

- **Services:** Handle business logic, such as managing devices, schedules, and logs.
  - `DeviceService`
  - `LogService`
  - `PumpService`
  - `DashboardService`
  - `ScheduleFetchService`
  - `LogFetchService`
- **Schedulers:** Automate tasks such as checking schedules and resetting completion status.
  - `Scheduler.js`

## Cron Jobs

A cron job is scheduled to clear the InfluxDB log file every Sunday at midnight:

```js
cron.schedule('0 0 * * 0', () => {
  clearLogFile();
});
```

## Running the Application

Start the server with:

```bash
npm start
```

The server will run on port `8000` by default. You can configure the port using the `PORT` environment variable.

### Testing the API

Use tools like **Postman** or **cURL** to test the endpoints. Example:

```bash
curl http://localhost:8000/devices
```

## License

This project is licensed under the MIT License.

