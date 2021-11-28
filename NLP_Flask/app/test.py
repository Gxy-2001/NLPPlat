import base64
import hmac
from urllib import parse
from hashlib import sha256

# 前面生成的被签名串
string_to_sign = 'GET\n/iaas/\naccess_key_id=ZWQKNMRYYSDTKRIUONBY&action=DescribeRDBs&api_lang=zh-cn&rdb.n=cl-jz90byh8&signature_method=HmacSHA256&signature_version=1&time_stamp=2021-05-09T01%3A59%3A36Z&version=1&zone=sh1a'
h = hmac.new(bytes("RNt6gg7Kk0RAoYinSEiLfC75kXee0Zp75htkYNaS", encoding='utf-8'), digestmod=sha256)
s = "818bgbYWtB6Q8kUk0nkhjeu1nyQGSif5IAERLCuF"
h = hmac.new(bytes(s, encoding='utf-8'), digestmod=sha256)
h.update(string_to_sign.encode("utf8"))
sign = base64.b64encode(h.digest()).strip()
#print(sign)
signature = parse.quote_plus(sign)
print(signature)
