from rest_framework import serializers
from .models import Recipe, Ingredient, Step, Comment


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'text', 'order']


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'text', 'order']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'text', 'created_at']


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, read_only=True)
    steps = StepSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = ['id', 'author', 'title', 'category', 'description', 'cook_time', 'serves', 'likes', 'created_at', 'updated_at', 'ingredients', 'steps', 'comments']
