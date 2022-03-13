import TimeCapsules from '../models/TimeCapsules.js';
import Users from '../models/Users.js';
import TimeCapsuleAttachFiles from '../models/TimeCapsuleAttachFiles.js';
import { check, validationResult } from 'express-validator';
import db from '../databases/postgres.js';
import helper from '../helper.js';
import urlSlug from 'url-slug';
import { customAlphabet } from 'nanoid';
import fileSystem from 'fs';
import sharp from 'sharp';
import schedule from 'node-schedule';

const TimeCapsulesController = {
    createValidation: [
        check('subject')
            .notEmpty()
            .withMessage('The subject is required.')
            .isLength({ min: 3})
            .withMessage('The subject must be at least 3 character.')
            .isLength({ max: 255})
            .withMessage('The subject must be a maximum of 255 character.'),
        check('message')
            .notEmpty()
            .withMessage('The message is required.')
            .isLength({ min: 3})
            .withMessage('The message must be at least 3 character.'),
        check('release_time')
            .notEmpty()
            .withMessage('The release time is required.')
            .custom(async value => {
                const releaseTime = new Date(Number(value));

                // Validate release time format
                if (isNaN(releaseTime) || releaseTime.getFullYear() == 1970) {
                    return Promise.reject('Release time format must be Unix Epoch Timestamp in milliseconds. example : 1646975847000.');
                }

                // Validate release time must be greater than or equal time now
                const now = new Date();

                if (releaseTime.getTime() <= now.getTime()) {
                    return Promise.reject('Release time must be greater than time now.');
                }
            }),
        check('attach_files')
            .notEmpty()
            .withMessage('The attach files is required.')
            .custom(async value => {
                let totalValidFiles = 0;

                value.map(attach_file => {
                    const imageExtension = attach_file.originalname.split('.')[1];
                    const imageExtensionLists = ["jpg", "jpeg", "png", "pdf"];
    
                    if (imageExtensionLists.includes(imageExtension)) {
                        totalValidFiles++;
                    }
                });

                if (value.length !== totalValidFiles) {
                    return Promise.reject('Attach files format must be .jpg, .jpeg, .png. or .pdf.');
                } 
            }),
    ],

    async create(req, res) {
        // Validation
        const errors = validationResult(req);
        
        // If validation fails
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.mapped());
        }

        try {
            // Generate random string for concat to subject 
            const randomString = customAlphabet('1234567890abcdef', 6);

            const timeCapsuleData = {
                subject: req.body.subject,
                slug: urlSlug(`${req.body.subject} ${randomString()}}`),
                message: req.body.message,
                release_time: helper.generateTimestampFormat(req.body.release_time)
            };

            // Transaction Time Capsule
            await db.tx(async transaction => {
                // Create Time Capsule
                const timeCapsule = await TimeCapsules.create(transaction, timeCapsuleData);

                // Create time-capsules-file directory in public, if not exists
                if (!fileSystem.existsSync(`${helper.pathUploads}/time-capsules-file`)) {
                    fileSystem.mkdirSync(`${helper.pathUploads}/time-capsules-file`);
                }

                // Create directory specify time capsule based on slug 
                if (!fileSystem.existsSync(`${helper.pathUploads}/time-capsules-file/${timeCapsuleData.slug}`)) {
                    fileSystem.mkdirSync(`${helper.pathUploads}/time-capsules-file/${timeCapsuleData.slug}`);
                }

                let promises = [];

                req.body.attach_files.map(attach_file => {
                    // Generate random string for file name
                    const generateRandomFileName = customAlphabet('1234567890abcdef', 32);
                    const fileExtension = attach_file.originalname.split('.')[1];
                    const filePath = `time-capsules-file/${timeCapsuleData.slug}/${generateRandomFileName()}.${fileExtension}`;

                    // Store attach files to filesystem
                    sharp(attach_file.path).toFile(`${helper.pathUploads}/${filePath}`);

                    const timeCapsuleAttachFileData = {
                        time_capsule_id: timeCapsule.id,
                        file_path: filePath
                    };

                    promises.push(TimeCapsuleAttachFiles.create(transaction, timeCapsuleAttachFileData));
                });

                // Create Time Capsule Attach File
                await Promise.all(promises);

                // Schedule Time Capsule Release 
                const timeCapsuleRelease = new Date(timeCapsuleData.release_time);

                schedule.scheduleJob(timeCapsuleRelease, async function() {
                    // Get all user email
                    const allUserEmail = await Users.getAllUserEmail();

                    let promises = [];

                    allUserEmail.map(async user => {
                        promises.push(helper.sendEmail(`${timeCapsuleData.subject} is release`, `${user.email}`, `Now the ${timeCapsuleData.subject} is release, please check the website for details.`));
                    });

                    // Send Time Capsule Release Email Notification
                    Promise.all(promises);
                });
            });

            return res.status(200).json({
                status: 'Success',
                message: 'Time capsule successfully created.'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Failed',
                message: 'Failed to create time capsule.'
            });
        }
    },

    async getAll(req, res) {
        try {
            const statusQuery = {
                active: true,
                inactive: false
            };
    
            let page = req.query.page ? req.query.page : 1;
            let size = req.query.size ? req.query.size : 10;
            let offset = (Number(page) * Number(size)) - Number(size); 
            let sort = req.query.sort ? req.query.sort : '';
            let status = '';
            // console.log(req.query.status);
            // Filter status is valid ?
            if (statusQuery[req.query.status] === true || statusQuery[req.query.status] === false) {
                status = statusQuery[req.query.status];
            } else {
                status = null;
            }

            const data = {
                page: page,
                size: size,
                offset: offset,
                sort: sort,
                status: status
            };

            let timeCapsules = [];
            let information = {};

            // Get list all time capsule with filter
            if (data.status !== null || data.status === true || data.status === false) {
                const timeCapsulesRaw = await TimeCapsules.getListAllTimeCapsuleFilter(data);

                if (timeCapsulesRaw.length) {
                    timeCapsules = timeCapsulesRaw.map(timeCapsule => {
                        return {
                            id: timeCapsule.id,
                            subject: timeCapsule.subject,
                            slug: timeCapsule.slug,
                            release_date: helper.generateDateFormat(timeCapsule.release_time),
                            release_time: helper.generateTimeFormat(timeCapsule.release_time),
                            status: timeCapsule.status
                        }
                    });

                    information = {
                        items: Number(timeCapsulesRaw[0].items),
                        total_items: Number(timeCapsulesRaw[0].total_items),
                        first_page: 1,
                        previous_page: Number(page) !== 1 ? Number(page) - 1 : null,
                        current_page: Number(page),
                        next_page: Number(page) < Number(timeCapsulesRaw[0].total_pages) ? Number(page) + 1 : null,
                        last_page: Number(timeCapsulesRaw[0].total_pages)
                    }
                } else {
                    information = {
                        items: 0,
                        total_items: 0,
                        first_page: 1,
                        previous_page: null,
                        current_page: 1,
                        next_page: null,
                        last_page: null
                    }
                }
            }

            // Get list all time capsule without filter
            else {
                const timeCapsulesRaw = await TimeCapsules.getListAllTimeCapsule(data);

                if (timeCapsulesRaw.length) {
                    timeCapsules = timeCapsulesRaw.map(timeCapsule => {
                        return {
                            id: timeCapsule.id,
                            subject: timeCapsule.subject,
                            slug: timeCapsule.slug,
                            release_date: helper.generateDateFormat(timeCapsule.release_time),
                            release_time: helper.generateTimeFormat(timeCapsule.release_time),
                            status: timeCapsule.status
                        }
                    });

                    information = {
                        items: Number(timeCapsulesRaw[0].items),
                        total_items: Number(timeCapsulesRaw[0].total_items),
                        first_page: 1,
                        previous_page: Number(page) !== 1 ? Number(page) - 1 : null,
                        current_page: Number(page),
                        next_page: Number(page) < Number(timeCapsulesRaw[0].total_pages) ? Number(page) + 1 : null,
                        last_page: Number(timeCapsulesRaw[0].total_pages)
                    }
                } else {
                    information = {
                        items: 0,
                        total_items: 0,
                        first_page: 1,
                        previous_page: null,
                        current_page: 1,
                        next_page: null,
                        last_page: null
                    }
                }
            }
    
            return res.status(200).json({
                status: 'Success',
                data: timeCapsules,
                information: information
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Failed',
                message: 'Failed to get all time capsule.'
            });
        }
    },

    async getDetail(req, res) {
        try {            
            // Time capsule is exists ?
            let timeCapsule = await TimeCapsules.isExists(req.params.slug);
    
            if (!timeCapsule.exists) {
                return res.status(404).json({
                    status: 'Not Found',
                    message: 'Time capsule is not found.'
                });
            }
            
            // Time capsule is active ?
            timeCapsule = await TimeCapsules.isActive(req.params.slug);
    
            if (!timeCapsule.active) {
                return res.status(423).json({
                    status: 'Locked',
                    message: 'Unable to display the time capsule, because it hasn\'t been released yet.'
                });
            }
    
            // Get detail time capsule
            timeCapsule = await TimeCapsules.getDetail(req.params.slug);
    
            const filesPath = [];
    
            timeCapsule.map(value => {
                filesPath.push(value.file_path);
            });
    
            const result = {
                id: timeCapsule[0].id,
                subject: timeCapsule[0].subject,
                slug: timeCapsule[0].slug,
                message: timeCapsule[0].message,
                release_date: helper.generateDateFormat(timeCapsule[0].release_time),
                release_time: helper.generateTimeFormat(timeCapsule[0].release_time),
                files_path: filesPath
            };
    
            return res.status(200).json({
                status: 'Success',
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Failed',
                message: 'Failed to get time capsule detail.'
            });
        }
    }
};

export default TimeCapsulesController;