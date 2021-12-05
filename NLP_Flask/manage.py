from app import *

app = create_app("development")
celery = create_celery(app)
register_blueprint(app)

if __name__ == '__main__':
    app.run(debug=True)
    '''
    if app.config['RUN_MODE']=='development':
        app.run(debug = False)
    elif app.config['RUN_MODE']=='production':
        app.run(host='0.0.0.0')
    '''

'''
celery -A manage.celery worker -l INFO --without-mingle --without-gossip  --pool=eventlet
'''