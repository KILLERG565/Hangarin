from django.db import models


class BaseModel(models.Model):
    """Abstract base — adds created_at and updated_at to every model."""
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Recipe(BaseModel):
    """A recipe post shared by a community member."""

    CATEGORY_CHOICES = [
        ('Soup',      'Soup'),
        ('Main',      'Main'),
        ('Noodles',   'Noodles'),
        ('Dessert',   'Dessert'),
        ('Snack',     'Snack'),
        ('Breakfast', 'Breakfast'),
        ('Drinks',    'Drinks'),
    ]

    author      = models.CharField(max_length=100)
    title       = models.CharField(max_length=250)
    category    = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Main')
    description = models.TextField()
    cook_time   = models.CharField(max_length=50, default='30 min')
    serves      = models.PositiveIntegerField(default=4)
    likes       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — by {self.author}"


class Ingredient(BaseModel):
    """One ingredient line belonging to a Recipe."""
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='ingredients'
    )
    order = models.PositiveSmallIntegerField(default=0)
    text  = models.CharField(max_length=300)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.text


class Step(BaseModel):
    """One cooking step belonging to a Recipe."""
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='steps'
    )
    order = models.PositiveSmallIntegerField(default=0)
    text  = models.TextField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Step {self.order}: {self.text[:60]}"


class Comment(BaseModel):
    """A review / comment left on a Recipe."""
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.CharField(max_length=100)
    text   = models.TextField()

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.author} on '{self.recipe.title}'"
