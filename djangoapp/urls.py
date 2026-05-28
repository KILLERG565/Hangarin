from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    # All API routes go through recipe/urls.py
    path('api/', include('recipe.urls')),

    # Everything else → serve the React app
    re_path(r'^.*$', TemplateView.as_view(
        template_name='index.html'
    )),
]