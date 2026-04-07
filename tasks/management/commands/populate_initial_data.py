from django.core.management.base import BaseCommand
from tasks.models import Priority, Category

class Command(BaseCommand):
    help = 'Populate initial Priority and Category data.'

    def handle(self, *args, **options):
        priorities = ['high', 'medium', 'low', 'critical', 'optional']
        categories = ['Work', 'School', 'Personal', 'Finance', 'Projects']

        for name in priorities:
            Priority.objects.get_or_create(name=name)
        for name in categories:
            Category.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Initial Priority and Category data populated.'))
