# Whop Chess React Native

A React Native chess application built with Whop's React Native framework.

## Prerequisites

- Node.js (v16 or higher)
- pnpm (v10.12.4 or higher) - required package manager
- Whop CLI tools

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd whop-chess-react-native
```

2. Install dependencies:
```bash
pnpm install
```

## Development

To run the development server:
```bash
pnpm run dev
```

This will start the Vite development server for web development.

## Available Scripts

- `pnpm run dev` - Start the development server
- `pnpm run build` - Build the application using whop-react-native
- `pnpm run upload` - Upload the build to Whop
- `pnpm run clean` - Clean build artifacts
- `pnpm run ship` - Build and deploy the application

## Building for Production

To build the application for production:
```bash
pnpm run build
```

To build and ship to Whop:
```bash
pnpm run ship
```

## Project Structure

- `src/` - Source code
- `public/` - Static assets
- `build/` - Built application files
- `index.html` - Entry HTML file
- `vite.config.js` - Vite configuration
- `tsconfig.json` - TypeScript configuration

## Technologies Used

- React Native 0.80.0
- React 19.1.0
- TypeScript
- Vite (for development)
- Whop React Native framework
- React Native Reanimated
- React Native SVG
- React Native Gesture Handler