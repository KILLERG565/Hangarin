from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.views.static import serve
import os

urlpatterns = [
    path('admin/', admin.site.urls),

    # All API routes go through recipe/urls.py
    path('api/', include('recipe.urls')),

    # Serve static/assets files before the catch-all
    re_path(r'^assets/(?P<path>.*)$', serve, {
        'document_root': os.path.join(settings.STATIC_ROOT, 'assets'),
        'show_indexes': False,
    }),
    
    re_path(r'^static/(?P<path>.*)$', serve, {
        'document_root': settings.STATIC_ROOT,
        'show_indexes': False,
    }),

    # Everything else → serve the React app
    re_path(r'^.*$', TemplateView.as_view(
        template_name='index.html'
    )),
]