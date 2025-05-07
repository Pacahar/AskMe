from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response as DRFResponse


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

    @action(detail=True, methods=['get'], url_path='responses', permission_classes=[permissions.IsAuthenticated])
    def responses(self, request, pk=None):
        survey = self.get_object()

        if survey.creator != request.user:
            raise PermissionDenied("Access denied. You are not the author of this survey.")

        responses = Response.objects.filter(survey=survey)
        serializer = ResponseSerializer(responses, many=True)
        return DRFResponse(serializer.data)


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


    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("Only authorized users can get responses info.")
        return super().get_queryset().filter(survey__creator=user)


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
