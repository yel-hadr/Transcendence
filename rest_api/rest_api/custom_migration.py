import os
from django.contrib.auth.hashers import make_password
from django.db import migrations
from rest_api.models import Tuser
from rest_api.settings import UPLOAD_DIR, DEFAULT_IMG, get_secret

def generate_superuser(apps, schema_editor):
    admin_creds = get_secret("API_ADMIN")
    admin = Tuser( username=admin_creds,
                    password_hash=make_password(get_secret("API_PASS")),
                    fname=admin_creds,
                    lname=admin_creds,
                    email=admin_creds + "@lmongol.lol",
                    verified=True,
                    image = DEFAULT_IMG
            )
    admin.save()

class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(generate_superuser),
    ]


