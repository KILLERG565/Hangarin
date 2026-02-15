from django.core.management.base import BaseCommand
from faker import Faker
from django.utils import timezone
from tasks.models import Task, Priority, Category
import random

class Command(BaseCommand):
    help = "Seed the database with fake data"

    def handle(self, *args, **kwargs):
        fake = Faker()
        priorities = list(Priority.objects.all())
        categories = list(Category.objects.all())

        for _ in range(20):
            Task.objects.create(
                title=fake.sentence(nb_words=5),
                description=fake.paragraph(nb_sentences=3),
                status=fake.random_element(elements=["Pending", "In Progress", "Completed"]),
                deadline=timezone.make_aware(fake.date_time_this_month()),
                priority=random.choice(priorities),
                category=random.choice(categories),
            )
        self.stdout.write(self.style.SUCCESS("Fake data generated!"))