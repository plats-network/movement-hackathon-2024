FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

# Install  Nillion SDK Tools
RUN apt-get update && apt-get install -y curl

# Close your terminal. Open a new terminal and confirm global nilup tool installation
RUN curl https://nilup.nilogy.xyz/install.sh | bash

# Verify nilup installation
RUN nilup -V

RUN nilup install latest \
    && nilup use latest \
    && nilup init 

# Verify nillion installation
RUN nillion -V

COPY . .
EXPOSE 8000
CMD ["python", "manage.py"]