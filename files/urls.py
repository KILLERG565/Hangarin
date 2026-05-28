from django.urls import path
from . import views

urlpatterns = [
    # List all recipes / create a new recipe
    path('recipes/',                views.RecipeListView.as_view(),   name='recipe-list'),

    # Get or delete a single recipe
    path('recipes/<int:pk>/',       views.RecipeDetailView.as_view(), name='recipe-detail'),

    # Like / unlike a recipe
    path('recipes/<int:pk>/like/',  views.RecipeLikeView.as_view(),   name='recipe-like'),

    # Post a comment on a recipe
    path('recipes/<int:pk>/comments/', views.CommentListView.as_view(), name='comment-list'),
]
