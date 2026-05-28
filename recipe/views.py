from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Recipe
from .serializers import RecipeSerializer


class RecipeListView(generics.ListCreateAPIView):
    """List all recipes or create a new recipe"""
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a single recipe"""
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


class RecipeLikeView(generics.GenericAPIView):
    """Like or unlike a recipe"""
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def post(self, request, pk=None):
        """Toggle like on a recipe"""
        recipe = self.get_object()
        liked = request.data.get('liked', False)
        if liked:
            recipe.likes += 1
        else:
            recipe.likes = max(0, recipe.likes - 1)
        recipe.save()
        return Response({'likes': recipe.likes})


class CommentListView(generics.ListCreateAPIView):
    """Post a comment on a recipe"""
    serializer_class = RecipeSerializer

    def get_queryset(self):
        recipe_id = self.kwargs.get('pk')
        return Recipe.objects.filter(id=recipe_id)
