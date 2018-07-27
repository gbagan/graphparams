module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],

    "parser": "babel-eslint",

    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [ "react", "babel" ],
    "rules": {
        "no-undef": "error",
        "indent": [1, 4],
        "linebreak-style": [ "error", "unix"],
        "quotes": [ "error", "single"],
        "semi": [ "error", "always"],
        "react/jsx-uses-vars": 2,
        "react/prop-types": 0,
        "import/no-unresolved": 0,
    }
};