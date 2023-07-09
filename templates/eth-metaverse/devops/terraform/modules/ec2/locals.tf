locals {
    block_device_path = "/dev/sdh"
    user_data = <<EOF
#!/bin/bash
DEST=${var.working_directory}

sudo yum install curl
sudo yum update
sudo yum search docker
sudo yum info docker
sudo yum install -y docker
sudo wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) 
sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo chmod -v +x /usr/local/bin/docker-compose
sudo service docker stop
sudo service docker start
sudo usermod -a -G docker ec2-user
newgrp docker

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose


cat > $DEST/docker-compose.yml <<-TEMPLATE
${data.template_file.dockercompose.rendered}
TEMPLATE

cat > $DEST/Dockerfile <<-TEMPLATE
${data.template_file.dockerfile.rendered}
TEMPLATE

cat > $DEST/genesis.json <<-TEMPLATE
${data.template_file.genesis.rendered}
TEMPLATE

cat > $DEST/.env <<-TEMPLATE
${data.template_file.env.rendered}
TEMPLATE

docker-compose up -d

EOF
}

data "template_file" "dockercompose" {
  template = file("${path.module}/../../../../backend/ethereum/blockchain/docker-compose.yml")

  vars = { 
    ACCOUNT_PASSWORD = var.chain_account_password
    NETWORK_ID = var.chain_network_id
  }
}

data "template_file" "dockerfile" {
  template = file("${path.module}/../../../../backend/ethereum/blockchain/Dockerfile")

  vars = { 
    ACCOUNT_PASSWORD = var.chain_account_password
  }
}

data "template_file" "genesis" {
  template = file("${path.module}/../../../../backend/ethereum/blockchain/genesis.json")
}

data "template_file" "env" {
  template = file("${path.module}/../../../../backend/ethereum/blockchain/.env")
}