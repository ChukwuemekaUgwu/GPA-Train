from django.shortcuts import render
from rest_framework import viewsets
from .models import Course, Term, AllTerms
from .serializers import CourseSerializer, TermSerializer, AllTermsSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
class TermViewSet(viewsets.ModelViewSet):
    queryset = Term.objects.all()
    serializer_class = CourseSerializer
class AllTermsViewSet(viewsets.ModelViewSet):
        queryset = AllTerms.objects.all()
        serializer_class = AllTermsSerializer

# Create your views here.
def home(request):
    return render(request, 'homepage.html')
def manual(request):
    return render(request, 'manualpage.html')

    
