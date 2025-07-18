
const getErrorMessage = (lang, role) => {
    const messages = {
        "pt-BR": `Você precisa ser ${role} para acessar essa funcionalidade!`,
        "en-US": `You need to be ${role} to access this feature!`,
        "es": `¡Necesitas ser ${role} para acceder a esta funcionalidad!`,
    };
    return messages[lang] || messages["es"];
};

const controllerRoles = {
    logged: function (req, res, next) {
        if (!req.session.user) {
            const lang = req.cookies.lang || "es";
            const messages = {
                "pt-BR": "Você precisa estar logado para acessar essa funcionalidade!",
                "en-US": "You need to be logged in to access this feature!",
                "es": "¡Debes iniciar sesión para acceder a esta funcionalidad!",
            };
            return res.status(403).json({ msg: messages[lang], status: 403 });
        } else {
            return next();
        }
    },

    roleRequired: function (roles) {
        return function (req, res, next) {
            if (req.session.user && roles.includes(req.session.user.role)) {
                return next();
            } else {
                const lang = req.cookies.lang || "en-US";
                const role = roles[0];
                return res.status(403).json({ msg: getErrorMessage(lang, role), status: 403 });
            }
        };
    },
};

module.exports = controllerRoles
