# Hangarin - Recipe Management Application

A Django + React + Vite application for managing recipes.

## Tech Stack

- **Backend:** Django 4.2 with Django REST Framework
- **Frontend:** React with Vite
- **Database:** SQLite (development)
- **Server:** Node.js (frontend dev server)

## Prerequisites

- Python 3.10+
- Node.js 16+
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Hangarin
```

### 2. Backend Setup (Django)

#### Create and Activate Virtual Environment

**Windows:**
```bash
python -m venv hangenv
hangenv\Scripts\activate
```

**macOS/Linux:**
```bash
python -m venv hangenv
source hangenv/bin/activate
```

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Run Database Migrations

```bash
cd djangoapp
python manage.py makemigrations
python manage.py migrate
```

#### (Optional) Seed the Database

```bash
python seed_recipes.py
```

#### Create Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

#### Start Django Development Server

```bash
python manage.py runserver
```

The Django backend will be running at `http://127.0.0.1:8000/`

### 3. Frontend Setup (React + Vite)

#### Install Node Dependencies

Open a new terminal (keep the Django server running in the first terminal):

```bash
npm install
```

#### Start Vite Development Server

```bash
npm run dev
```

The React frontend will be running at `http://localhost:5173/` (or another port if 5173 is in use).

### 4. Access the Application

- **Frontend:** http://localhost:5173/
- **Django Admin:** http://127.0.0.1:8000/admin/
- **API:** http://127.0.0.1:8000/api/

## Running Tests

### Test API Format
```bash
python test_api_format.py
```

### Test API
```bash
python test_api.py
```

## Build for Production

### Build Frontend
```bash
npm run build
```

This generates optimized files in the `dist/` directory.

### Collect Static Files
```bash
python manage.py collectstatic
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
Hangarin/
├── djangoapp/          # Django configuration
├── recipe/             # Recipe app (models, views, serializers)
├── src/                # React source code
├── public/             # Static assets
├── staticfiles/        # Collected static files
├── requirements.txt    # Python dependencies
├── package.json        # Node.js dependencies
├── vite.config.js      # Vite configuration
└── manage.py           # Django management script
```

## Troubleshooting

### Virtual Environment Issues
- Ensure you're using the correct virtual environment activation command for your OS
- Run `which python` (macOS/Linux) or `where python` (Windows) to verify the correct Python is active

### Port Conflicts
- If port 8000 is in use, run: `python manage.py runserver 8001`
- If port 5173 is in use, Vite will automatically use the next available port

### CORS Issues
- Check that `hangenv/Lib/site-packages/corsheaders/` is installed
- Verify Django CORS settings in `djangoapp/settings.py`

### Database Issues
- Delete `db.sqlite3` and re-run migrations if database is corrupted
- Run `python manage.py migrate --fake-initial` if migrations fail

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test your changes
4. Submit a pull request

## License

[Add your license here]
