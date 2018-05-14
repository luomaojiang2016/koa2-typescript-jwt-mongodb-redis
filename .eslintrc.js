module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },

    "extends": "eslint:recommended",

    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },

        "ecmaVersion": 2017
    },

    "plugins": [
        //"react"
    ],
    
    "rules": {
        /*
        "linebreak-style": [
            "error",
            "windows"
        ],
        */

        "semi": [
            "error",
            "always"
        ],

        "no-console":               0,
        "no-constant-condition":    0
    },

    globals: {
        $:      true,
        V2RTC:  true
    }
};