import redis from 'redis';
import connectRedis from 'connect-redis';
import session from 'express-session';

const REDIS_URL = process.env.REDIS_URL || '<your Redis server url goes here>';
const REDIS_DB_PWD = process.env.REDIS_DB_PWD || '<your Redis AUTH password goes here>';
const redisStore = connectRedis(session);

export const redisClient = redis.createClient(REDIS_URL, { password: REDIS_DB_PWD });

redisClient.on("error", (err) => {
    console.log("Redis client connection error : " + err + '. Redis Sessions and Datastore will not be available.');
});
redisClient.on("connect", () => {
    console.log("Redis client connected.");
});
redisClient.on("ready", () => {
    console.log("Redis client ready.");
});

export const redisSessionStore = new redisStore({ client: redisClient });