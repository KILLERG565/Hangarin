from django.db import models
from django.utils import timezone
import random

# --- BaseModel ---
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

# --- Status Choices ---
STATUS_CHOICES = [
    ("Pending", "Pending"),
    ("In Progress", "In Progress"),
    ("Completed", "Completed"),
]

# --- Category ---
class Category(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

# --- Priority ---
class Priority(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Priority"
        verbose_name_plural = "Priorities"

    def __str__(self):
        return self.name

# --- Task ---
class Task(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Pending")
    deadline = models.DateTimeField(default=timezone.now)
    priority = models.ForeignKey(Priority, on_delete=models.CASCADE, related_name="tasks")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="tasks")

    def __str__(self):
        return self.title

# --- SubTask ---
class SubTask(BaseModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="subtasks")
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Pending")

    def __str__(self):
        return self.title

# --- Note ---
class Note(BaseModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="notes")
    content = models.TextField()

    def __str__(self):
        return f"Note for {self.task.title}"