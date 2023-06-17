# React TypeScript SassKit
A React/TypeScript/Express SassKit demo project with Github OAuth signup flow.

- Front-End: React / React Router / TypeScript
- Server: Express
- Image Storage: Cloudinary (https://cloudinary.com/)
- Database: xata (https://xata.io/)

## How To Get Started
### 1. Clone the repo.
```bash
git clone https://github.com/heybran/react-typescript-sasskit.git
```

### 2. Setup environment variables
Rename `server/.env.example` to `server/.env`.
```bash
mv server/.env.example server/.env
```
Since this project uses GitHub OAuth for user signup, you need to [create an OAuth App on GitHub](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) and then add your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` into `.env` file.
```
GITHUB_CLIENT_ID="your github client id"
GITHUB_CLIENT_SECRET="your github client secret"
JWT_SECRET="your json web token secret key"
XATA_BRANCH=main
XATA_API_KEY="your xata database api key"
```

You'll also need a JWT secret key, which can be generated by running this in your terminal.
```bash
node -e "console.log (require ('crypto').randomBytes (32).toString ('hex'))"
```

And `XATA_API_KEY` can be created via Xata dashboard. You need to create a free account on their website.

### 3. Install dependencies
Install front end dependencies.
```bash
npm install
```

Install server side dependencies.
```bash
cd server && npm install 
```
### 4. Local development
Back to project root directory and run:
```bash
npm run dev
```
It will run both `Vite` dev server (Port: 5173) and `Express` server (Port: 5000) concurrently.

### 5. Deploy
This project only servers as a demo project for learning purpose, but if you would like to deploy, [https://render.com/](https://render.com/)
is a pretty good option.

Register an free account on Render and create a Web Service and connect the service with your GitHub repo of this project.

The way I set it up is before we do a production bulild of our React app into `./server/build/` folder. You can find by this command inside `package.json` file.

```bash
npm run build # "build": "tsc && vite build --outDir=./server/build"
```

In your Render dashboard, you can change the Root Directory to `server`, and then add `npm install` to install dependencies and `npm run start` to kick off the express server.
