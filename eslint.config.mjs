import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
export default defineConfig([
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "react-hooks": hooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "src/generated/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    ".local/**",
  ]),
]);
