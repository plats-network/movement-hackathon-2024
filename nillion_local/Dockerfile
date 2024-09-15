FROM python:3.11-slim
# FROM rust:1.67

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && apt-get install -y gcc curl vim supervisor \
    && rm -rf /tmp/* /var/cache/*

COPY conf/services.conf /etc/supervisor/conf.d/

# Install nilup by sh
RUN curl https://nilup.nilogy.xyz/install.sh | bash
# Restart terminal
RUN echo "source ~/.bashrc" >> ~/.profile
# Confirm global nilup tool installation
RUN . ~/.bashrc && nilup -V
# Install Nillion SDK
RUN . ~/.bashrc && nilup install latest && nilup use latest && nilup init
# Restart terminal
RUN echo "source ~/.bashrc" >> ~/.profile
# Confirm global Nillion tool installation
RUN . ~/.bashrc && nillion -V

COPY . /webapps
WORKDIR /webapps
RUN chmod +x /webapps/run.sh

# CMD tail -f /dev/null
# CMD . ~/.bashrc && nillion-devnet
CMD supervisord -n -c /etc/supervisor/supervisord.conf