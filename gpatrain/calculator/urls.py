from django.contrib import admin
from django.urls import path, include 
from . import views
from rest_framework import routers
from calculator.views import CourseViewSet, TermViewSet, AllTermsViewSet

router = routers.DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'terms', TermViewSet)
router.register(r'allterms', AllTermsViewSet)

urlpatterns = [
    path('', views.home, name='homepage'),
    path('manual/', views.manual, name='manualpage'),
    path('api/', include(router.urls)),
    path('api/gpa-calculate/', views.calculate_gpa, name='gpa-calculate')

]