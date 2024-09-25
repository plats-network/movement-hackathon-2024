FROM python:3.10-slim-buster

# Install build-essential for C++ compiler
RUN apt-get update && apt-get install -y build-essential


WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip uninstall protobuf -y

RUN pip install  -r requirements.txt

RUN pip install protobuf==3.20.1


# Install  Nillion SDK Tools
# RUN apt-get update && apt-get install -y curl

# Close your terminal. Open a new terminal and confirm global nilup tool installation
# RUN curl https://nilup.nilogy.xyz/install.sh | bash

# Verify nilup installation
# RUN nilup -V

# RUN nilup install latest \
#     && nilup use latest \
#     && nilup init 

# Verify nillion installation
# RUN nillion -V

COPY . .
EXPOSE 8000
CMD ["python", "manage.py"]