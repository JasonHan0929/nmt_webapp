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
    --ckpt=./nmt_attention_model_bahdanau_50w/translate.ckpt-250000 \
    --out_dir=./nmt_attention_model_bahdanau_50w \
    --vocab_prefix=./vocab \
    --inference_input_file=./input.en \
    --inference_output_file=./output.zh'
  )
  result_file = open('./output.zh', 'r')
  result_sentence = result_file.read()
  result_file.close()
  return joint_zh(result_sentence)


def luong(source_text):
  base_path = os.path.dirname(os.path.abspath(__file__))
  os.chdir(base_path)
  input_file = open('./input.en', 'w')
  input_file.write(source_text)
  input_file.close()
  os.system(
    'python -m nmt_tensorflow.nmt.nmt \
    --src=en --tgt=zh \
    --ckpt=./nmt_attention_model_scaled_luong_50w/translate.ckpt-265000 \
    --out_dir=./nmt_attention_model_scaled_luong_50w \
    --vocab_prefix=./vocab \
    --inference_input_file=./input.en \
    --inference_output_file=./output.zh'
  )
  result_file = open('./output.zh', 'r')
  result_sentence = result_file.read()
  result_file.close()
  return joint_zh(result_sentence)

def luong_deeper(source_text):
  base_path = os.path.dirname(os.path.abspath(__file__))
  os.chdir(base_path)
  input_file = open('./input.en', 'w')
  input_file.write(source_text)
  input_file.close()
  os.system(
    'python -m nmt_tensorflow.nmt.nmt \
    --src=en --tgt=zh \
    --ckpt=./nmt_attention_model_scaled_luong_50w_deeper/translate.ckpt-210000 \
    --out_dir=./nmt_attention_model_scaled_luong_50w_deeper \
    --vocab_prefix=./vocab \
    --inference_input_file=./input.en \
    --inference_output_file=./output.zh'
  )
  result_file = open('./output.zh', 'r')
  result_sentence = result_file.read()
  result_file.close()
  return joint_zh(result_sentence)

def naive(source_text):
  base_path = os.path.dirname(os.path.abspath(__file__))
  os.chdir(base_path)
  input_file = open('./input.en', 'w')
  input_file.write(source_text)
  input_file.close()
  os.system(
    'python -m nmt_tensorflow.nmt.nmt \
    --src=en --tgt=zh \
    --ckpt=./nmt_model_naive_50w/translate.ckpt-465000 \
    --out_dir=./nmt_model_naive_50w \
    --vocab_prefix=./vocab \
    --inference_input_file=./input.en \
    --inference_output_file=./output.zh'
  )
  result_file = open('./output.zh', 'r')
  result_sentence = result_file.read()
  result_file.close()
  return joint_zh(result_sentence)
