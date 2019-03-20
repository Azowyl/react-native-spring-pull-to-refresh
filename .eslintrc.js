module.exports = {
    "parser": "babel-eslint",
    "env": {
        "jest/globals": true,
        "es6": true,
        "browser": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "plugins": [
        "react",
        "jest",
    ],
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
        }
    },
    "rules": {
        "indent": [
            "error",
            4,
            {SwitchCase: 1}
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "settings": {
        "react": {
            "version": "16.4", // React version, default to the latest React stable release
        },
    }
};
