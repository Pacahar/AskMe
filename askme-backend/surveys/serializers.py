from rest_framework import serializers
from .models import Survey, Question, Option, Response, Answer

class OptionSerializer(serializers.ModelSerializer):


    class Meta:
        model = Option
        # fields = ['id', 'text']
        fields = '__all__'
    
    def validate(self, data):
        question = data.get('question')
        question_type = question.type 

        if question_type == 'text':
            raise serializers.ValidationError('Options cannot be created for text questions.')
        
        return data


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)


    class Meta:
        model = Question
        # fields = ['id', 'text', 'type', 'options', 'survey']
        fields = '__all__'


class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)


    class Meta:
        model = Survey
        fields = ['id', 'title', 'description', 'creator', 'created_at', 'questions']
        read_only_fields = ['creator', 'created_at']


class AnswerSerializer(serializers.ModelSerializer):
    selected_options = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Option.objects.all(),
        required=False
    )
    text_answer = serializers.CharField(required=False, allow_blank=True)


    class Meta:
        model = Answer
        fields = ['id', 'question', 'selected_options', 'text_answer']


    def validate(self, data):
        question = data.get('question')
        selected_options = data.get('selected_options', [])
        text_answer = data.get('text_answer', '')

        if question.type == 'text':
            if not text_answer:
                raise serializers.ValidationError('Text answer is required for text questions.')
            if selected_options:
                raise serializers.ValidationError('Options should not be selected for text questions.')
        
        elif question.type in ['single', 'multiple']:
            if not selected_options:
                raise serializers.ValidationError('At least one option must be selected for choice questions.')
            if question.type == 'single' and len(selected_options) > 1:
                raise serializers.ValidationError('Maximum one option must be selected for single choice questions.')
            if text_answer:
                raise serializers.ValidationError('Text answer should not be filled for choice questions.')

        return data

class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)


    class Meta:
        model = Response
        fields = ['id', 'survey', 'submitted_at', 'answers']
        read_only_fields = ['submitted_at']


    def validate(self, data):
        survey = data.get('survey')
        answers = data.get('answers')

        question_ids_in_survey = set(survey.questions.values_list('id', flat=True))
        question_ids_answered = set()

        for answer in answers:
            question = answer.get('question')
            if question.id not in question_ids_in_survey:
                raise serializers.ValidationError(
                    f"The question with id={question.id} does not belong to survey {survey.id}"
                )

            if question.id in question_ids_answered:
                raise serializers.ValidationError(
                    f"The question with id={question.id} has more than one answer"
                )
            question_ids_answered.add(question.id)

            for option in answer.get('selected_options', []):
                if option.question_id != question.id:
                    raise serializers.ValidationError(
                        f"The option with id={option.id} does not belong to question {question.id}"
                    )

        if question_ids_in_survey != question_ids_answered:
            raise serializers.ValidationError(
                "Answers have not been provided for all survey questions"
            )

        return data


    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        response = Response.objects.create(**validated_data)

        for answer_data in answers_data:
            selected_options = answer_data.pop('selected_options', [])
            answer = Answer.objects.create(response=response, **answer_data)
            answer.selected_options.set(selected_options)

        return response
