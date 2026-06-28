# Chili Classifier Web Application

This is the web frontend and interface for the Chili Plant Disease Classification project. It is built using **Laravel**, **React**, **Inertia.js**, and **Tailwind CSS**.

This application provides the user interface for interacting with the disease classification models (provided by the separate FastAPI backend).

## Prerequisites

Before setting up the project, ensure you have the following installed:
- PHP >= 8.3
- Composer
- Node.js & npm (or pnpm/yarn)
- A local web server or Laravel Valet / Herd

## Setup Instructions

1. **Install PHP Dependencies**
   Run Composer to install all Laravel dependencies:
   ```bash
   composer install
   ```

2. **Set up Environment Variables**
   Copy the example `.env` file to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   Generate the application key:
   ```bash
   php artisan key:generate
   ```
   *Note: Ensure your database connection settings in the `.env` are configured correctly (by default, it uses SQLite which requires a `database/database.sqlite` file).*

3. **Database Migration**
   Run the database migrations to set up the necessary tables:
   ```bash
   php artisan migrate
   ```

4. **Install Node Dependencies**
   Install the frontend dependencies:
   ```bash
   npm install
   ```

## Running the Application

To run the application locally, you can use the built-in composer dev script which runs the Laravel server, queue listener, and Vite simultaneously:

```bash
composer run dev
```

Alternatively, you can run them in separate terminal windows:
```bash
# Terminal 1: Start Laravel Development Server
php artisan serve

# Terminal 2: Start Vite Development Server
npm run dev
```

### Important Note on Ports (FastAPI Backend Conflict)
By default, `php artisan serve` runs on `http://127.0.0.1:8000`. 
If you are also running the FastAPI backend for the ML model, it typically defaults to port `8000` as well.

To avoid port conflicts, you can either:
1. Run Laravel on a different port:
   ```bash
   php artisan serve --port=8080
   ```
2. Or change the FastAPI backend port:
   ```bash
   uvicorn main:app --reload --port 8001
   ```
Make sure to update any API endpoint URLs in your `.env` or frontend configuration to point to the correct FastAPI backend port.

## Building for Production

To build the assets for production, run:
```bash
npm run build
```
This will compile and minify your React components and Tailwind CSS for production use.
