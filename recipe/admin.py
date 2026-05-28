from django.contrib import admin
from .models import Recipe, Ingredient, Step, Comment


# ── Inline editors (edit ingredients/steps right inside a recipe) ──────────

class IngredientInline(admin.TabularInline):
    model   = Ingredient
    extra   = 3
    fields  = ('order', 'text')
    ordering = ('order',)


class StepInline(admin.TabularInline):
    model   = Step
    extra   = 3
    fields  = ('order', 'text')
    ordering = ('order',)


class CommentInline(admin.TabularInline):
    model   = Comment
    extra   = 0
    fields  = ('author', 'text', 'created_at')
    readonly_fields = ('created_at',)
    can_delete = True


# ── Model Admin classes ─────────────────────────────────────────────────────

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display   = ('title', 'author', 'category', 'cook_time', 'serves',
                      'likes', 'created_at')
    list_filter    = ('category', 'created_at')
    search_fields  = ('title', 'author', 'description')
    readonly_fields = ('likes', 'created_at', 'updated_at')
    inlines        = [IngredientInline, StepInline, CommentInline]

    fieldsets = (
        ('Recipe Info', {
            'fields': ('title', 'author', 'category', 'description')
        }),
        ('Details', {
            'fields': ('cook_time', 'serves')
        }),
        ('Stats', {
            'fields': ('likes', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display  = ('text', 'recipe', 'order')
    list_filter   = ('recipe',)
    search_fields = ('text', 'recipe__title')
    ordering      = ('recipe', 'order')


@admin.register(Step)
class StepAdmin(admin.ModelAdmin):
    list_display  = ('recipe', 'order', 'short_text')
    list_filter   = ('recipe',)
    search_fields = ('text', 'recipe__title')
    ordering      = ('recipe', 'order')

    def short_text(self, obj):
        return obj.text[:80] + ('…' if len(obj.text) > 80 else '')
    short_text.short_description = 'Step Text'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display   = ('author', 'recipe', 'short_text', 'created_at')
    list_filter    = ('created_at',)
    search_fields  = ('author', 'text', 'recipe__title')
    readonly_fields = ('created_at',)

    def short_text(self, obj):
        return obj.text[:80] + ('…' if len(obj.text) > 80 else '')
    short_text.short_description = 'Comment'
