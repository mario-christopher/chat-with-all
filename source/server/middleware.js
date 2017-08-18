export const logApi = (req, res, next) => {
    console.log('API called : ', req.originalUrl);
    next();
};

export const notFound = (req, res, next) => {
    res.status(404).send(`'${req.originalUrl}' does not exist`);
};

export const isAuthorized = (req, res, next) => {
    if (req.session && req.session.user)
        next();
    else
        res.status(401).send();
};