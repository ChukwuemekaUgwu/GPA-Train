from django.core.management.commands.runserver import Command as RunserverCommand
from django.core.management import call_command
import os

class Command(RunserverCommand):
    def handle(self, *args, **options):
        # Remove the database file if it exists
        db_path = 'db.sqlite3'
        if os.path.exists(db_path):
            os.remove(db_path)
            print("Database file removed.")

        # Run migrations to recreate the schema
        call_command('migrate')
        print("Migrations applied.")

        # # Optionally create a superuser
        # from django.contrib.auth.models import User
        # if not User.objects.filter(username='admin').exists():
        #     User.objects.create_superuser('admin', 'admin@example.com', 'password')
        #     print("Superuser created.")

        # # Call the original runserver command
        # super().handle(*args, **options)