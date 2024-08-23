from django.db import models

class Course(models.Model):
    term_number = models.IntegerField
    name = models.CharField(max_length= 35)
    credits = models.FloatField()
    grade = models.FloatField()
    @property
    def earned_score(self):
        return self.credits * self.grade
    def __str__(self):
        return f"{self.name} (Term {self.term_number})"
    

# Create your models here.
# class Term(models.Model):
#     courses = models.ManyToManyField('Course', related_name="related_term")
#     name = models.CharField(max_length=15)
#     def __str__(self):
#         return self.name
#     @property
#     def totalCredits(self):
#         return sum(course.credits for course in self.courses.all())
#     @property
#     def totalTermEarnedScore(self):
#         return sum(course.earned_score for course in self.courses.all())
#     @property
#     def termGPA(self):
#         try:
#             return self.totalTermEarnedScore / self.totalCredits
#         except ZeroDivisionError as e:
#             return 0.0

# class Course(models.Model):
#     name = models.CharField(max_length=30)
#     credits = models.PositiveSmallIntegerField()
#     grade  = models.FloatField()
#     term = models.ForeignKey(Term, related_name='courseList', on_delete=models.CASCADE) # is this still neccessary / wi purpose
#     @property
#     def earned_score(self):
#        return self.credits * self.grade
#     def __str__ (self):
#         return self.name

# class AllTerms(models.Model):
#     terms = models.ManyToManyField(Term)
#     @property
#     def cumCredits(self):
#         return sum(term.totalCredits for term in self.terms.all())
#     @property
#     def cumEarnedScore(self):
#         return sum(term.totalTermEarnedScore for term in self.terms.all())
#     @property
#     def cumGPA(self):
#         try:
#             return self.cumEarnedScore / self.cumCredits
#         except ZeroDivisionError:
#             return 0.0

    




    


