from django.shortcuts import render
from rest_framework import viewsets
from .models import Course#, Term, AllTerms
from .serializers import CourseSerializer#, TermSerializer, AllTermsSerializer
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
# class TermViewSet(viewsets.ModelViewSet):
#     queryset = Term.objects.all()
#     serializer_class = CourseSerializer
# class AllTermsViewSet(viewsets.ModelViewSet):
#         queryset = AllTerms.objects.all()
#         serializer_class = AllTermsSerializer

@require_POST
@csrf_exempt
def clear_database(request):
    #be sure to add a double check to prevent accidental clears
    return

def delete_path(request):
    return
@require_POST
@csrf_exempt
def calculate_gpa(request):
    try:
        data = json.loads(request.body)
        courses = data.get('courses', 'none')
        print(courses)
        num = data.get('numofterms', 1) + 1
        termgpas = []
        c_score = 0
        c_credits = 0
        # termgpas = [[]] * num
        # # I need [es, c] or [tgpa]
        # for course in courses:
        for i in range(1, num):
            filtered_courses = [course for course in courses if course.get('term_number') == i]
            print(i)
            earned_score = 0
            total_credits = 0
            for course in filtered_courses:
                total_credits += course.get('credits', 0)
                earned_score += course.get('credits', 0) * course.get('grade', 0)
            gpa = earned_score / total_credits if total_credits > 0 else 0.0
            termgpas.append({'term': i, 'gpa': gpa})
            c_score += earned_score
            c_credits += total_credits
        return JsonResponse({
            'termgpas' : termgpas,
            'cgpa': c_score / c_credits
        })
    except (ValueError, TypeError, KeyError) as e:
        return JsonResponse({'error': 'Invalid Input Data', 'details': str(e)}, status=400)

@require_POST
@csrf_exempt
def upload_transcript(request):
    return

def load_path(request):
    return

def save_path(request):
    return






#Some of this can be used as "save_path()"
@require_POST
@csrf_exempt
def db_calculate_gpa(request):
    data = json.loads(request.body)
    term_gpas = []
    total_points = 0
    total_credits = 0

    # Track changes to update only modified terms and courses
    updated_terms = set()
    updated_courses = []

    for term_data in data.get('terms', []):
        term_name = term_data['name']
        term, created = Term.objects.get_or_create(name=term_name)
        existing_courses = {course.name: course for course in term.courses.all()}
        
        for course_data in term_data.get('courses', []):
            course_name = course_data['name']
            course_credits = course_data['credits']
            course_grade = course_data['grade']

            if course_name in existing_courses:
                course = existing_courses[course_name]
                # Check if course details have changed
                if course.credits != course_credits or course.grade != course_grade:
                    course.credits = course_credits
                    course.grade = course_grade
                    course.save()
                    updated_courses.append(course)
            else:
                # Create new course if it doesn't exist
                course = Course.objects.create(
                    name = course_name,
                    credits = course_credits,
                    grade = course_grade,
                    term = term
                )
                term.courses.add(course)
                updated_courses.append(course)
            
            total_points += course.earned_score
            total_credits += course.credits
        
        term_gpa = term.termGPA
        term_gpas.append({'term': term.name, 'gpa': term_gpa})
        updated_terms.add(term)
    
    # Calculate cumulative GPA
    all_terms = AllTerms.objects.first()  # Assuming a single instance for now
    if not all_terms:
        all_terms = AllTerms.objects.create()
    all_terms.terms.add(*updated_terms)
    cum_gpa = all_terms.cumGPA
    
    return JsonResponse({
        'term_gpas': term_gpas,
        'cumulative_gpa': cum_gpa
    })

# Create your views here.
def home(request):
    return render(request, 'homepage.html')
def manual(request):
    return render(request, 'manualpage.html')

    
