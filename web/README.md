# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Form submission setup

This app submits form data through `POST /api/submit`.

- In local development (`npm run dev`), Vite proxies `/api/submit` to `VITE_APPS_SCRIPT_URL`.
- In production (Vercel), `api/submit.js` relays requests to Google Apps Script server-side.

### Local `.env`

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-script-id/exec
VITE_APPS_SCRIPT_KEY=your-dev-key
```

### Production environment variables (set in Vercel)

- `APPS_SCRIPT_URL` = your Google Apps Script `/exec` URL
- `APPS_SCRIPT_KEY` = your Apps Script API key

Do not expose production keys as `VITE_*` variables.
