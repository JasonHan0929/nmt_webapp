from rest_framework import serializers

from .models import Translation

class TranslationSerializer(serializers.ModelSerializer):

  class Meta:
    model = Translation
    fields = ('source_text', 'target_text', 'nmt_text')
