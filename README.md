# IdeaForge

**An online marketplace for engineering students to discover and purchase project ideas for internships and academic work.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://idea-forge-beige.vercel.app/)

## Overview

IdeaForge is a full-stack web application built to make project discovery easier for engineering students.

Users can browse project ideas, explore detailed project information, add ideas to a cart, and manage their purchases through an authenticated dashboard.

The application also includes administrative functionality for managing project ideas and controlling their visibility on the marketplace.

## Features

- 🔐 User authentication and protected application flows
- 🔎 Browse and explore project ideas by domain
- 📄 Detailed project pages with project information and resources
- 🛒 Cart and checkout flow
- 👤 User dashboard and purchased-idea management
- 🧑‍💼 Administrative project management
- 👁️ Visibility controls for marketplace listings
- ☁️ Firebase Authentication and Cloud Firestore integration
- 📱 Responsive interface for desktop and mobile use

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Motion

### Backend & Data

- Firebase Authentication
- Cloud Firestore

### Deployment

- Vercel

## Project Structure

```text
src/
├── components/     # Reusable UI components
├── pages/          # Application pages and views
├── lib/            # Authentication, cart, Firebase and data services
├── App.tsx         # Application routing and composition
├── main.tsx        # Application entry point
└── types.ts        # Shared TypeScript types
