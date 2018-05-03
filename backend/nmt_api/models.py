from django.db import models

class Translation(models.Model):
  source_text = models.CharField(max_length=500)
  target_text = models.CharField(max_length=1200, blank=True)
  nmt_text = models.CharField(max_length=1200)

  def __str__(self):
    return '%s -> %s' % (source_text, nmt_text)




