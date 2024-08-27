from django.contrib import admin
from django.urls import path, include 
from . import views
from rest_framework import routers
from calculator.views import CourseViewSet#, TermViewSet, AllTermsViewSet

router = routers.DefaultRouter()
router.register(r'courses', CourseViewSet)
# router.register(r'terms', TermViewSet)
# router.register(r'allterms', AllTermsViewSet)

#api is like a seperate to show functions that return json data and not just load up regular pages

urlpatterns = [
    path('', views.home, name='homepage'),
    path('manual/', views.manual, name='manualpage'),
    path('api/', include(router.urls)),
    path('api/gpa-calculate/', views.calculate_gpa, name='gpa-calculate'),
    path('upload_transcript',views.upload_transcript, name='auto_entry' )

]