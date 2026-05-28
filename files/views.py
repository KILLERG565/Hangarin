import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from .models import Recipe, Ingredient, Step, Comment


def recipe_to_dict(recipe):
    """Serialize a Recipe (with nested ingredients, steps, comments) to a dict."""
    return {
        'id':          recipe.id,
        'author':      recipe.author,
        'title':       recipe.title,
        'category':    recipe.category,
        'description': recipe.description,
        'cook_time':   recipe.cook_time,
        'serves':      recipe.serves,
        'likes':       recipe.likes,
        'time':        recipe.created_at.strftime('%-d %b %Y'),
        'ingredients': [i.text for i in recipe.ingredients.all()],
        'steps':       [s.text for s in recipe.steps.all()],
        'comments': [
            {
                'id':     c.id,
                'author': c.author,
                'text':   c.text,
                'time':   c.created_at.strftime('%-d %b %Y'),
            }
            for c in recipe.comments.all()
        ],
    }


# ── /api/recipes/ ───────────────────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class RecipeListView(View):

    def get(self, request):
        """GET /api/recipes/  — return all recipes (newest first)."""
        recipes = Recipe.objects.prefetch_related(
            'ingredients', 'steps', 'comments'
        ).all()

        # Optional ?category=Soup filter
        category = request.GET.get('category')
        if category and category != 'All':
            recipes = recipes.filter(category=category)

        # Optional ?search=keyword filter
        search = request.GET.get('search', '').strip()
        if search:
            recipes = recipes.filter(title__icontains=search) | \
                      recipes.filter(author__icontains=search)

        return JsonResponse([recipe_to_dict(r) for r in recipes], safe=False)

    def post(self, request):
        """POST /api/recipes/  — create a new recipe."""
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Validate required fields
        required = ['author', 'title', 'description', 'ingredients', 'steps']
        for field in required:
            if not data.get(field):
                return JsonResponse(
                    {'error': f'Missing required field: {field}'}, status=400
                )

        recipe = Recipe.objects.create(
            author      = data['author'].strip(),
            title       = data['title'].strip(),
            category    = data.get('category', 'Main'),
            description = data['description'].strip(),
            cook_time   = data.get('cook_time', '30 min'),
            serves      = int(data.get('serves', 4)),
        )

        # Create ingredients
        for i, text in enumerate(data['ingredients']):
            if text.strip():
                Ingredient.objects.create(recipe=recipe, order=i, text=text.strip())

        # Create steps
        for i, text in enumerate(data['steps']):
            if text.strip():
                Step.objects.create(recipe=recipe, order=i, text=text.strip())

        return JsonResponse(recipe_to_dict(recipe), status=201)


# ── /api/recipes/<id>/ ──────────────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class RecipeDetailView(View):

    def get(self, request, pk):
        """GET /api/recipes/<id>/  — get a single recipe."""
        recipe = get_object_or_404(
            Recipe.objects.prefetch_related('ingredients', 'steps', 'comments'),
            pk=pk
        )
        return JsonResponse(recipe_to_dict(recipe))

    def delete(self, request, pk):
        """DELETE /api/recipes/<id>/  — remove a recipe."""
        recipe = get_object_or_404(Recipe, pk=pk)
        recipe.delete()
        return JsonResponse({'deleted': True})


# ── /api/recipes/<id>/like/ ─────────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class RecipeLikeView(View):

    def post(self, request, pk):
        """POST /api/recipes/<id>/like/  — toggle like (increment / decrement)."""
        recipe = get_object_or_404(Recipe, pk=pk)
        try:
            data = json.loads(request.body)
            liked = data.get('liked', True)   # True = add like, False = remove
        except (json.JSONDecodeError, ValueError):
            liked = True

        if liked:
            recipe.likes = max(0, recipe.likes + 1)
        else:
            recipe.likes = max(0, recipe.likes - 1)
        recipe.save(update_fields=['likes'])

        return JsonResponse({'likes': recipe.likes})


# ── /api/recipes/<id>/comments/ ─────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class CommentListView(View):

    def post(self, request, pk):
        """POST /api/recipes/<id>/comments/  — add a comment."""
        recipe = get_object_or_404(Recipe, pk=pk)
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if not data.get('author') or not data.get('text'):
            return JsonResponse(
                {'error': 'author and text are required'}, status=400
            )

        comment = Comment.objects.create(
            recipe = recipe,
            author = data['author'].strip(),
            text   = data['text'].strip(),
        )

        return JsonResponse({
            'id':     comment.id,
            'author': comment.author,
            'text':   comment.text,
            'time':   comment.created_at.strftime('%-d %b %Y'),
        }, status=201)
