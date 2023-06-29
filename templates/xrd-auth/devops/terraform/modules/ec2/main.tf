data "aws_ami" "latest_amazon_linux" {
    most_recent = true
    owners = ["amazon"]
    filter {
        name = "name"
        values = ["amzn*"]
    }
}

resource "aws_instance" "this" {
    ami = data.aws_ami.latest_amazon_linux.id
    availability_zone = var.availability_zone
    instance_type = var.instance_type
    key_name = var.key_name
    user_data = local.user_data
    security_groups = ["${aws_security_group.this.name}"]
    
    tags = {
        Name = var.name
    }
}