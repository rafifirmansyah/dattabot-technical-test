const BypassAttachFilesMiddleware = (req, res, next) => {
    // Bypass data files to request body for validation
    req.body.attach_files = req.files;

    next();
};

export default BypassAttachFilesMiddleware;