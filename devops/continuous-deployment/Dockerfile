FROM ubuntu:18.04

ENV TERRAFORM_VERSION=0.12.29 \
  NODEJS_VERSION=12.x

SHELL ["/bin/bash", "-e", "-o", "pipefail", "-c"]

RUN groupadd -g 1000 devops && \
  useradd --create-home -u 1000 -g 1000 -s /bin/bash devops

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections && \
  # base packages
  apt-get update && \
  apt-get -y install \
  apt-transport-https \
  gnupg \
  git \
  wget \
  curl \
  make \
  jq \
  zip \
  openssl \
  unzip && \
  apt-get clean && \
  rm -rf \
  /var/lib/apt/lists/* \
  /tmp/* \
  /var/tmp/*

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf  awscliv2.zip

WORKDIR /usr/local/bin

# terraform
RUN wget -O terraform_${TERRAFORM_VERSION}_linux_amd64.zip  https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
  unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
  rm -f terraform_${TERRAFORM_VERSION}_linux_amd64.zip

# Install NodeJS
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_${NODEJS_VERSION}  | bash -
RUN apt-get -y install nodejs
RUN npm install

# Install serverless
RUN npm install -g serverless@2.20.0
# USER devops
WORKDIR /usr/src
