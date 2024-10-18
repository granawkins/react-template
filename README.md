# React, TypeScript, and Vite Integration

This template offers a streamlined setup for integrating React with Vite, featuring Hot Module Replacement (HMR) and predefined ESLint configurations.

The following two official plugins are currently available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Utilizes [Babel](https://babeljs.io/) to implement Fast Refresh functionality.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Employs [SWC](https://swc.rs/) for Fast Refresh capabilities.

## Enhancing the ESLint Configuration

For production-grade applications, it is recommended to update the ESLint configuration to incorporate type-aware linting rules:

- Configure the top-level `parserOptions` property like this:

```javascript
export default tseslint.config({
  languageOptions: {
    // Additional configuration options
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` with either `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`.
- Optionally, include `...tseslint.configs.stylisticTypeChecked` for additional stylistic linting rules.
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```javascript
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Specify the React version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Integrate the React plugin
    react,
  },
  rules: {
    // Additional linting rules
    // Activate the recommended React rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
