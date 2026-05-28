# Hangarin - PythonAnywhere Deployment Guide

## What's Fixed

✅ **Circular Import** - Resolved view/URL structure
✅ **Database Models** - Recipe, Ingredient, Step, Comment models ready
✅ **API Serializers** - Return nested recipe data with ingredients, steps, comments
✅ **React Frontend** - Built for production and integrated with Django
✅ **Static Files** - Configured to serve React app
✅ **CORS** - Configured to allow API calls
✅ **Production Ready** - All dependencies in requirements.txt

---

## Deployment Steps on PythonAnywhere

### 1. **Upload Your Code**
   - Upload the entire project to your PythonAnywhere account
   - Make sure these files/folders are included:
     - `djangoapp/` (Django app)
     - `recipe/` (API app)
     - `dist/` (React build - created by `npm run build`)
     - `requirements.txt` (Python dependencies)
     - `manage.py`
     - `index.html`

### 2. **Create a Virtual Environment**
   In PythonAnywhere console, navigate to your project folder:
   ```bash
   python3 -m venv hangenv
   source hangenv/bin/activate
   pip install -r requirements.txt
   ```

### 3. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

### 4. **Collect Static Files**
   ```bash
   python manage.py collectstatic --noinput
   ```

### 5. **Create Sample Recipes (Optional)**
   ```bash
   python seed_recipes.py
   ```

### 6. **Configure WSGI File**
   In PythonAnywhere, edit your WSGI configuration file and ensure it points to:
   ```python
   path = '/home/yourusername/Hangarin'
   if path not in sys.path:
       sys.path.append(path)
   os.environ['DJANGO_SETTINGS_MODULE'] = 'djangoapp.settings'
   from django.wsgi import get_wsgi_application
   application = get_wsgi_application()
   ```

### 7. **Update Static Files in Web App Settings**
   In PythonAnywhere Web tab:
   - **URL**: `/static/`
   - **Directory**: `/home/yourusername/Hangarin/staticfiles/`

### 8. **Reload Your Web App**
   Click "Reload" button in PythonAnywhere Web tab

---

## Expected URLs

- **Frontend**: `https://hangarin22.pythonanywhere.com/`
- **API**: `https://hangarin22.pythonanywhere.com/api/recipes/`
- **Admin**: `https://hangarin22.pythonanywhere.com/admin/`

---

## Features

✅ **Browse Recipes** - View all shared recipes with categories
✅ **Share Recipe** - Users can post their own recipes with ingredients & steps
✅ **Like Recipes** - Heart recipes to show appreciation
✅ **Post Comments** - Share reviews and feedback on recipes
✅ **Search** - Find recipes by keyword
✅ **Filter by Category** - Soup, Main, Noodles, Dessert, Snack, Breakfast, Drinks

---

## API Endpoints

- `GET /api/recipes/` - List all recipes
- `POST /api/recipes/` - Create a new recipe
- `GET /api/recipes/{id}/` - Get recipe details
- `POST /api/recipes/{id}/comments/` - Post a comment

---

## Troubleshooting

### Blank Page
- Run `python manage.py collectstatic --noinput`
- Verify staticfiles folder exists
- Check that index.html is in `dist/` folder

### API Not Working
- Verify CORS_ALLOWED_ORIGINS includes your domain
- Check that rest_framework is installed
- Ensure manage.py migrate has been run

### No Recipes Showing
- Run: `python seed_recipes.py`
- Or post recipes via the "+ Share Recipe" button

---

## Development vs Production

**Development** (Local - port 5173):
- React dev server on port 5173
- Django backend on port 8000
- Vite proxy forwards /api to Django

**Production** (PythonAnywhere):
- Everything served from one domain
- React build files served by Django
- Static files in staticfiles/ folder
