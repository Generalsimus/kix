export const getVitePackageConfig = (kixVersion: string, tsVersion: string, appName: string) => {
  return {
    "name": appName,
    "private": true,
    "version": "0.0.1",
    "type": "module",
    "scripts": {
      "build": "vite build",
      "dist": "vite build",
      "start": "vite --host --open",
      "serve": "vite --host --open",
      "dev": "vite --host --open",
      "preview": "vite preview"
    },
    "devDependencies": {
      "resolve": "^1.22.8",
      "sass": "^1.70.0",
      "svg-plugin-vite": "^0.0.5",
      "typescript": tsVersion,
      "vite": "^5.0.12",
      "vite-typescript-plugin": "^0.3.0"
    },
    "dependencies": {
      "kix": kixVersion
    }
  }

}