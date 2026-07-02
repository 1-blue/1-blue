import eslintConfig from "@1-blue/eslint-config/react-internal";

export default [
  ...eslintConfig,
  {
    files: ["babel.config.js", "metro.config.js"],
    languageOptions: {
      globals: {
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
