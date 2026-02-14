import {Pool} from 'pg';
import dotenv from 'dotenv'

dotenv.config();

const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: 'localhost',
    port: 5432,
    database: process.env.DBDATABASE
})

export default pool;