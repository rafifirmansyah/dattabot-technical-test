import db from '../databases/postgres.js';

const TimeCapsules = {
    create(transaction, data) {
        return transaction.one(`
            INSERT INTO 
                time_capsules
                    (subject, slug, message, release_time) 
            VALUES 
                ($/subject/, $/slug/, $/message/, $/release_time/)
            RETURNING id`,
            {
                subject: data.subject,
                slug: data.slug,
                message: data.message,
                release_time: data.release_time
            }
        );
    },

    getListAllTimeCapsule(data) {
        return db.manyOrNone(`
            WITH 
                pagination AS (
                    SELECT
                        id, subject, slug, release_time, 
                        CASE 
                            WHEN release_time <= now()
                        THEN 
                            'active'
                        ELSE
                            'inactive'
                        END AS status
                    FROM
                        time_capsules
                    ORDER BY
                        release_time $/sort:value/, id DESC 
                    OFFSET 
                        $/offset/ ROWS 
                    FETCH FIRST 
                        $/size/ ROW ONLY
                ),
                totalPages AS (
                    SELECT
                        CEIL(COUNT(id)::double precision / $/size/ ) AS total_pages
                    FROM
                        time_capsules
                ),
                totalItems AS (
                    SELECT
                        COUNT(id) AS total_items
                    FROM
                        time_capsules
                ),
                items AS (
                    SELECT
                        COUNT(id) AS items
                    FROM
                        pagination
                ) SELECT * FROM pagination, totalPages, totalItems, items`, 
            {
                size: data.size,
                offset: data.offset,
                sort: data.sort
            }
        );
    },

    getListAllTimeCapsuleFilter(data) {
        return db.manyOrNone(`
            WITH 
                pagination AS (
                    SELECT
                        id, subject, slug, release_time, 
                        CASE 
                            WHEN release_time <= now()
                        THEN 
                            'active'
                        ELSE
                            'inactive'
                        END AS status
                    FROM
                        time_capsules
                    WHERE
                        (release_time <= now()) is $/status/
                    ORDER BY
                        release_time $/sort:value/, id DESC 
                    OFFSET 
                        $/offset/ ROWS 
                    FETCH FIRST 
                        $/size/ ROW ONLY
               ),
               totalPages AS (
                       SELECT
                        CEIL(COUNT(id)::double precision / $/size/ ) AS total_pages
                    FROM
                        time_capsules
                    WHERE
                        (release_time <= now()) is $/status/
               ),
               totalItems AS (
                       SELECT
                        COUNT(id) AS total_items
                    FROM
                        time_capsules
                    WHERE
                        (release_time <= now()) is $/status/
               ),
               items AS (
                       SELECT
                        COUNT(id) AS items
                    FROM
                        pagination
               ) SELECT * FROM pagination, totalPages, totalItems, items`,
            {
                size: data.size,
                offset: data.offset,
                sort: data.sort,
                status: data.status   
            }
        );
    },

    isExists(slug) {
        return db.one(`
            SELECT 
                CASE WHEN COUNT(*) > 0 THEN true ELSE false END AS exists
            FROM
                time_capsules
            WHERE 
                slug = $/slug/`, 
            {
                slug: slug
            }
        );
    },

    isActive(slug) {
        return db.one(`
            SELECT
                release_time <= now() AS active
            FROM
                time_capsules 
            WHERE
                slug = $/slug/`, 
            {
                slug: slug
            }
        );
    },

    getDetail(slug) {
        return db.manyOrNone(`
            SELECT
                tc.id, tc.subject, tc.slug, tc.message, tc.release_time, tcaf.file_path
            FROM
                time_capsule_attach_files AS tcaf 
            RIGHT JOIN
                    time_capsules AS tc 
                ON 
                    tcaf.time_capsule_id = tc.id 
            WHERE 
                tc.slug = $/slug/`, 
            {
                slug: slug
            }
        );
    }
};

export default TimeCapsules;
