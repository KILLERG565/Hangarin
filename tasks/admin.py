from django.contrib import admin
from .models import Task, SubTask, Category, Priority, Note

# --- TaskAdmin ---
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "deadline", "priority", "category")
    list_filter = ("status", "priority", "category")
    search_fields = ("title", "description")

# --- SubTaskAdmin ---
@admin.register(SubTask)
class SubTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "parent_task_name")
    list_filter = ("status",)
    search_fields = ("title",)

    def parent_task_name(self, obj):
        return obj.task.title

# --- CategoryAdmin ---
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

# --- PriorityAdmin ---
@admin.register(Priority)
class PriorityAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

# --- NoteAdmin ---
@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("task", "content", "created_at")
    list_filter = ("created_at",)
    search_fields = ("content",)