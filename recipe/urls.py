from django.urls import path
from . import views

urlpatterns = [
    path('recipes/',                    views.RecipeListView.as_view(),    name='recipe-list'),
    path('recipes/<int:pk>/',           views.RecipeDetailView.as_view(),  name='recipe-detail'),
    path('recipes/<int:pk>/like/',      views.RecipeLikeView.as_view(),    name='recipe-like'),
    path('recipes/<int:pk>/comments/',  views.CommentListView.as_view(),   name='comment-list'),
]