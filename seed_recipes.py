#!/usr/bin/env python
"""Seed database with sample recipes."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoapp.settings')
django.setup()

from recipe.models import Recipe, Ingredient, Step

# Clear existing recipes (optional)
Recipe.objects.all().delete()

# Create first recipe
recipe1 = Recipe.objects.create(
    author='Chef John',
    title='Tomato Pasta',
    category='Main',
    description='A simple and delicious Italian pasta with fresh tomatoes and basil',
    cook_time='20 min',
    serves=4
)

Ingredient.objects.bulk_create([
    Ingredient(recipe=recipe1, order=1, text='400g pasta'),
    Ingredient(recipe=recipe1, order=2, text='500g fresh tomatoes'),
    Ingredient(recipe=recipe1, order=3, text='4 cloves garlic'),
    Ingredient(recipe=recipe1, order=4, text='Fresh basil'),
    Ingredient(recipe=recipe1, order=5, text='Olive oil'),
])

Step.objects.bulk_create([
    Step(recipe=recipe1, order=1, text='Boil water and cook pasta until al dente'),
    Step(recipe=recipe1, order=2, text='Chop tomatoes and garlic'),
    Step(recipe=recipe1, order=3, text='Heat olive oil and sauté garlic'),
    Step(recipe=recipe1, order=4, text='Add tomatoes and simmer for 10 minutes'),
    Step(recipe=recipe1, order=5, text='Toss pasta with sauce and top with fresh basil'),
])

print('✓ Created: Tomato Pasta')

# Create second recipe
recipe2 = Recipe.objects.create(
    author='Chef Maria',
    title='Chicken Soup',
    category='Soup',
    description='Warm and comforting homemade chicken soup',
    cook_time='45 min',
    serves=6
)

Ingredient.objects.bulk_create([
    Ingredient(recipe=recipe2, order=1, text='1 whole chicken'),
    Ingredient(recipe=recipe2, order=2, text='Carrots, celery, onion'),
    Ingredient(recipe=recipe2, order=3, text='8 cups water'),
])

Step.objects.bulk_create([
    Step(recipe=recipe2, order=1, text='Boil chicken with vegetables'),
    Step(recipe=recipe2, order=2, text='Simmer for 30 minutes'),
    Step(recipe=recipe2, order=3, text='Shred chicken and serve'),
])

print('✓ Created: Chicken Soup')

# Create third recipe
recipe3 = Recipe.objects.create(
    author='Chef Alex',
    title='Chocolate Cake',
    category='Dessert',
    description='Rich and decadent chocolate cake perfect for any occasion',
    cook_time='1 hour',
    serves=8
)

Ingredient.objects.bulk_create([
    Ingredient(recipe=recipe3, order=1, text='2 cups flour'),
    Ingredient(recipe=recipe3, order=2, text='1 cup cocoa powder'),
    Ingredient(recipe=recipe3, order=3, text='2 eggs'),
    Ingredient(recipe=recipe3, order=4, text='1 cup sugar'),
])

Step.objects.bulk_create([
    Step(recipe=recipe3, order=1, text='Mix dry ingredients'),
    Step(recipe=recipe3, order=2, text='Beat eggs and sugar'),
    Step(recipe=recipe3, order=3, text='Combine wet and dry ingredients'),
    Step(recipe=recipe3, order=4, text='Bake at 350°F for 35 minutes'),
])

print('✓ Created: Chocolate Cake')

print(f'\n✅ Total recipes in database: {Recipe.objects.count()}')
