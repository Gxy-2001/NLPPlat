from flask import request, render_template, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, get_raw_jwt
from werkzeug.security import generate_password_hash, check_password_hash

from . import api
from app import jwt
from app.utils.permission_utils import *
from app.utils.response_code import *

import pymongo


@api.route('/article/list', methods=["GET"])
@jwt_required
def getArticle():
    # 读取文章列表
    info = request.values
    page = info.get('page')
    limit = info.get('limit')
    realUsername = get_jwt_identity()
    # 数据库查询
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["nlpplat"]
    mycol = mydb["article"]
    article = []
    for x in mycol.find():
        article.append(x.art)
    return {'code': RET.OK, 'data': {'items': article, 'total': len(article)}}
