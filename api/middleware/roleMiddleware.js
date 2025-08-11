module.exports = (requiredRoles) => {
    return (req, res, next) => {
        const userRole = req.role;

        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

        if (!roles.includes(userRole)) {
           
            return res.status(403).json({ message: 'Accès refusé, rôle non autorisé' });
        }
        next();
    };
};