from src import create_app, settings
import uvicorn


app = create_app()

# if __name__ == "__main__":
#     uvicorn.run("__main__:app", host=settings.HOST,
#                 port=settings.PORT, reload=settings.RELOAD)
    

# fastapi dev manage.py