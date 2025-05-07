from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

from .permissions import IsSurveyCreator
from .serializers import SurveySerializer, QuestionSerializer, ResponseSerializer, OptionSerializer
from .models import Survey, Question, Response, Option


class SurveyViewSet(viewsets.ModelViewSet):
    serializer_class = SurveySerializer


    def get_permissions(self):
        if self.action == 'list':
            return [permissions.IsAuthenticated()]
        return []


    def get_queryset(self):
        if self.action == 'list':
            return Survey.objects.filter(creator=self.request.user)
        return Survey.objects.all()


    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Only authorized users can create surveys.")
        serializer.save(creator=self.request.user)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, IsSurveyCreator]

    def perform_create(self, serializer):
        survey_id = self.request.data.get("survey")
        survey = Survey.objects.get(id=survey_id)

        if survey.creator != self.request.user:
            raise PermissionDenied("Only the survey creator can add questions.")
        
        serializer.save(survey=survey)


class ResponseViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer
    permission_classes = [permissions.AllowAny]


class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer
    permission_classes = [IsAuthenticated, IsSurveyCreator]

    def perform_create(self, serializer):
        question_id = self.request.data.get("question")
        question = Question.objects.get(id=question_id)

        if question.survey.creator != self.request.user:
            raise PermissionDenied("Only the survey creator can add options.")
        
        serializer.save(question=question)
