from rest_framework import serializers
from .models import Student, Instructor, Vehicle, Course, Enrollment, Lesson


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=150, allow_blank=False, trim_whitespace=True)
    duration_hours = serializers.IntegerField(min_value=1)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    level = serializers.ChoiceField(choices=Course.LEVEL_CHOICES)
    is_active = serializers.BooleanField(required=False)

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('created_at',)

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("El nombre no puede estar vacío.")
        return value


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'