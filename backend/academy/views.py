from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Student, Instructor, Vehicle, Course, Enrollment, Lesson
from .serializers import (
    StudentSerializer, StudentPictureSerializer, InstructorSerializer, VehicleSerializer,
    CourseSerializer, EnrollmentSerializer, LessonSerializer
)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'first_name', 'last_name']

    @action(detail=True, methods=['post'], url_path='upload-picture',
            parser_classes=[MultiPartParser, FormParser])
    def upload_picture(self, request, pk=None):
        student = self.get_object()

        incoming_file = request.FILES.get('profile_picture')
        if not incoming_file:
            return Response(
                {'detail': 'Debes enviar el archivo profile_picture.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        allowed_types = ['image/jpeg', 'image/png']
        if incoming_file.content_type not in allowed_types:
            return Response(
                {'detail': 'Solo se permiten imágenes JPEG o PNG.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        max_size = 2 * 1024 * 1024
        if incoming_file.size > max_size:
            return Response(
                {'detail': 'La imagen no puede superar los 2MB.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StudentPictureSerializer(student, data=request.FILES, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                StudentSerializer(student, context={'request': request}).data,
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InstructorViewSet(viewsets.ModelViewSet):
    pass

class VehicleViewSet(viewsets.ModelViewSet):
    pass

class CourseViewSet(viewsets.ModelViewSet):
    pass

class EnrollmentViewSet(viewsets.ModelViewSet):
    pass

class LessonViewSet(viewsets.ModelViewSet):
    pass