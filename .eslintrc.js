module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "standard-with-typescript",
    "plugin:react/recommended",
    "next/core-web-vitals",
    "eslint-config-prettier",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "@typescript-eslint", "prettier", "tailwindcss"],
  rules: {
    semi: "off",
    "no-console": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": [
      "warn",
      {
        semi: false,
        EndOfLine: "lf",
        plugins: ["prettier-plugin-tailwindcss"],
      },
    ],
  },
}
