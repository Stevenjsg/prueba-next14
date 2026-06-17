import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import prettierRecommended from "eslint-plugin-prettier/recommended"

/**
 * ESLint 9 flat config (replaces the legacy .eslintrc.cjs).
 *
 * `eslint-config-next@16` ships native flat-config arrays and already bundles
 * typescript-eslint v8, react, react-hooks, import and jsx-a11y, so we just
 * spread its presets and layer Prettier + our project overrides on top.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "next.config.js",
      "tailwind.config.ts",
      "postcss.config.js",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierRecommended,
  {
    rules: {
      semi: "off",
      "@next/next/no-img-element": "off",
      "no-console": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "prettier/prettier": "warn",
    },
  },
]

export default config
