# Allow port 80 so we can connect to the container.
resource "aws_security_group" "this" {
    name = "${var.name}-blockchain-ec2-security-group"
    description = "${var.name} security group"

    ingress {
        description      = "Blockchain Port"
        from_port        = 8545
        to_port          = 8545
        protocol         = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description      = "SSH"
        from_port        = 22
        to_port          = 22
        protocol         = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}