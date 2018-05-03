import os
import re
import string

def joint_zh(sentence):
  sentence = sentence.replace(' ', '')
  sentence = sentence.translate(str.maketrans({key: "{0} ".format(key) for key in string.punctuation}))
  return sentence

def bahdanau(source_text):
  base_path = os.path.dirname(os.path.abspath(__file__))
  os.chdir(base_path)
  input_file = open('./input.en', 'w')
  input_file.write(source_text)
  input_file.close()
  os.system(
    'python -m nmt_tensorflow.nmt.nmt \
    --src=en --tgt=zh \
    --ckpt=./nmt_attention_model_bahdanau_50w/translate.ckpt-214200 \
    --out_dir=./nmt_attention_model_bahdanau_50w \
    --vocab_prefix=./nmt_attention_model_bahdanau_50w/vocab \
    --inference_input_file=./input.en \
    --inference_output_file=./output.zh'
  )
  result_file = open('./output.zh', 'r')
  result_sentence = result_file.read()
  result_file.close()
  return joint_zh(result_sentence)
