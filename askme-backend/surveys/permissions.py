from rest_framework.permissions import BasePermission
from .models import Survey, Question


class IsSurveyCreator(BasePermission):

    
    def has_permission(self, request, view):
        return True


    def has_object_permission(self, request, view, obj):
        
        if isinstance(obj, Question):
            return obj.survey.creator == request.user
        elif hasattr(obj, 'question') and hasattr(obj.question, 'survey'):
            return obj.question.survey.creator == request.user
        
        return False
