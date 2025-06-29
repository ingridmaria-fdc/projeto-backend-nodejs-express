import { Sequelize } from "sequelize";
import { development as config } from "./config.json";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    timezone: "-03:00",
    define: {
      underscored: true,
      timestamps: true,
    },
    logging: false,
  }
);

export default sequelize;
