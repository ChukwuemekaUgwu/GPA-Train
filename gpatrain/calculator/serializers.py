from rest_framework import serializers
from .models import Course #, Term, AllTerms

class CourseSerializer(serializers.ModelSerializer):
    class Meta: #what does Meta do
        model = Course
        field = '__all__'

# class TermSerializer(serializers.ModelSerializer):
#     courses = CourseSerializer(many = True, read_only = True)
#     class Meta: 
#         model = Term
#         field = '__all__'

# class AllTermsSerializer(serializers.ModelSerializer):
#     terms = TermSerializer(many = True, read_only = True)
#     class Meta:
#         model = AllTerms
#         field = '__all__'


