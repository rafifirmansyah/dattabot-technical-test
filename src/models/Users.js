import db from '../databases/postgres.js';

const Users = {
    create(transaction, data) {
        return transaction.none(`
            INSERT INTO
                users
                    (email, password)
            VALUES 
                ($/email/, $/password/)`, 
            {
                email: data.email,
                password: data.password
            }
        );
    },

    exists(email) {
        return db.one(`
            SELECT 
                CASE 
                    WHEN COUNT(id) > 0
                THEN 
                    true
                ELSE
                    false
                END AS exists
            FROM
                users
            WHERE
                email = $/email/`, 
            {
                email: email
            }
        );
    },

    getByEmail(email) {
        return db.one(`
            SELECT
                id, email, password
            FROM
                users
            WHERE
                email = $/email/`, 
            {
                email: email
            }
        );
    },

    getAllUserEmail() {
        return db.manyOrNone(`SELECT email FROM users`);
    },

    getById(id) {
        return db.oneOrNone(`
            SELECT
                id, email, password
            FROM
                users 
            WHERE 
                id = $/id/`, 
            {
                id: id
            }
        );
    }
};

export default Users;