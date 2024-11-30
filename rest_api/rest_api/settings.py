from pathlib import Path
from datetime import timedelta
import requests
import os


VAULT_HOST="vault:8200"

def get_secret(secret_name):
    try :
        headers = {
                "X-Vault-Token" : os.environ["VAULT_TOKEN"]
                }
        r = requests.get(f"http://{VAULT_HOST}/v1/secret/data/{secret_name}", headers=headers)
        j = r.json()["data"]["data"][secret_name]
        return (j)
    except:
        print(f"not working")
        return ("null")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

BASE_URL = "http://localhost:8000/"
BACK_URL = "http://localhost/"

SECRET_KEY = get_secret("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    "django_extensions",
    "daphne",
    "chat",
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'ninja_jwt.token_blacklist',
    "rest_api",
    "ninja_jwt",
    "ninja",
    "corsheaders"
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'rest_api.urls'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'rest_api.wsgi.application'
ASGI_APPLICATION = 'rest_api.asgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': get_secret('POSTGRES_DB') ,
        'USER':  get_secret('POSTGRES_USER'),
        'PASSWORD': get_secret('POSTGRES_PASS'),
        'HOST': "postgres",
        'PORT': '',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
AUTH_USER_MODEL = "rest_api.Tuser"

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

#CORS_ORIGIN_CREDENTIALS = True

# used to allow communication between frontend and api
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = (
  'http://localhost:3000',
  'http://localhost:80',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:80',
  'http://backend:3000',
  "http://nginx:80"
)


CORS_ALLOW_METHODS = [
        "GET",
        "POST",
        "DELETE",
        ]

CORS_ALLOW_HEADERS = [
        "Content-Type",
        "Authorization",
        "X-CSRFToken",
        ]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REG_EMAIL = r"^\S+@\S+\.\S+$"
REG_USER = r"[a-z0-9A-z]{3,32}"
REG_XNAME = r"[a-zA-z]{3,64}"
REG_PASS = r"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&_=*-]).{8,}$"

## jwt config
NINJA_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=20),
    'REFRESH_TOKEN_LIFETIME' : timedelta(minutes=1440),
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
}

## verification
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = get_secret("SMTP_USER")
EMAIL_HOST_PASSWORD = get_secret("SMTP_PASS")
print(f"FUCK {EMAIL_HOST_USER}, {EMAIL_HOST_PASSWORD}")

UPLOAD_DIR = STATIC_URL 
DEFAULT_IMG = "anon.png"

API_42_CLIENT_ID = get_secret('API_42_ID')
API_42_CLIENT_SECRET = get_secret('API_42_SECRET')
API_42_REDIRECT_URI = 'https://localhost/callback'
API_42_AUTHORIZE_URL = 'https://api.intra.42.fr/oauth/authorize'
API_42_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
API_42_USER_INFO_URL = 'https://api.intra.42.fr/v2/me'


MAX_TOURNAMENT_PLAYERS = 8
