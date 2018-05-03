from django.conf.urls import url

from . import views

app_name = 'nmt'
urlpatterns = [
    url(r'', views.nmt, name='nmt'),
]