import pg from 'pg'
import 'dotenv/config';

const { Pool } = pg;

class db {
    constuctor() {
        this.Pool = new Pool({
            user: `${process.env.USER_LOGIN}`,
            password: `${process.env.USER_PASSWORD}`,
            host: 'db',
            port: 5432,
            database: 'url_shortener',
        });
    }

    async connect() {
        await this.Pool.connect();
    }

    async is_present(url) {
        let res = await this.Pool.connect('SELECT ID FROM urls WHERE URL=$1', [url]);
        console.log(res);
    }
}

await db.connect();

export { db };