from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SurveyViewSet, QuestionViewSet, ResponseViewSet

router = DefaultRouter()
router.register(r'surveys', SurveyViewSet, basename='survey')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'responses', ResponseViewSet, basename='response')

urlpatterns = [
    path('', include(router.urls)),
]
