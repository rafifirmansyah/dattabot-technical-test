const TimeCapsuleAttachFiles = {
    create(transaction, data) {
        return transaction.none(`
            INSERT INTO
            time_capsule_attach_files
                    (time_capsule_id, file_path)
            VALUES
                ($/time_capsule_id/, $/file_path/)`, 
            {
                time_capsule_id: data.time_capsule_id,
                file_path: data.file_path
            }
        );
    }
};

export default TimeCapsuleAttachFiles;

