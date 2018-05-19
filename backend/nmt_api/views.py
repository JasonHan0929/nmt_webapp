from rest_framework.decorators import api_view
from django.core.exceptions import ValidationError
from rest_framework.response import Response
import json

from Epica import predict
from .models import Translation
from .serializers import TranslationSerializer


@api_view(['GET', 'POST'])
def nmt(request):
  if request.method == 'GET':
    request_dict = request.GET
  elif request.method == 'POST':
    request_dict = json.loads(request.body.decode('utf-8'))
  else:
    raise ValidationError('Wrong Http Verb!')
  if 'source_text' in request_dict and 'attention' in request_dict:
    translation = Translation(source_text=request_dict['source_text'].lower(), target_text=None)
    if 'target_text' in request_dict:
      translation.target_text = request_dict['target_text']
    translation.nmt_text = getattr(predict, request_dict['attention'])(translation.source_text)
    return Response(TranslationSerializer(translation).data)
  else:
    raise ValidationError('both source_text and attention could not be empty!')



