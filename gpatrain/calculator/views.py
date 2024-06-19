from django.shortcuts import render
from rest_framework import viewsets
from .models import Course, Term, AllTerms
from .serializers import CourseSerializer, TermSerializer, AllTermsSerializer
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
class TermViewSet(viewsets.ModelViewSet):
    queryset = Term.objects.all()
    serializer_class = CourseSerializer
class AllTermsViewSet(viewsets.ModelViewSet):
        queryset = AllTerms.objects.all()
        serializer_class = AllTermsSerializer


@require_POST
@csrf_exempt
def calculate_gpa(request):
    try:
        data = json.loads(request.body)
        courses = data.get('courses', [])
        total_points = 0.0
        total_credits = 0.0

        for course in courses:
            credits = float(course.get('credits', 0))
            grade = float(course.get('grade', 0))
            if credits > 0 and grade >= 0:  # Basic validation
                total_points += credits * grade
                total_credits += credits

        gpa = total_points / total_credits if total_credits else 0.0
        return JsonResponse({'gpa': gpa})
    except (ValueError, KeyError, TypeError) as e:
        return JsonResponse({'error': 'Invalid input data', 'details': str(e)}, status=400)
# Create your views here.
def home(request):
    return render(request, 'homepage.html')
def manual(request):
    return render(request, 'manualpage.html')

    
