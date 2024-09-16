# task definition for repo api
resource "aws_ecs_task_definition" "core" {
  family                   = aws_ecs_cluster.cluster.name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 2048
  memory                   = 4096
  container_definitions = jsonencode([
    {
      name  = "plat-fellowship-${var.environment_name}-nillion"
      image = "${var.ecr_uri}:latest"
      links = []
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        },
        {
          containerPort = 35403
          hostPort      = 35403
          protocol      = "tcp"
        },
        {
          containerPort = 59322
          hostPort      = 59322
          protocol      = "tcp"
        },
        {
          containerPort = 48102
          hostPort      = 48102
          protocol      = "tcp"
        },
        {
          containerPort = 26650
          hostPort      = 26650
          protocol      = "tcp"
        },
        {
          containerPort = 26649
          hostPort      = 26649
          protocol      = "tcp"
        }
      ]
      essential             = true
      entryPoint            = []
      command               = []
      environment           = []
      environmentFiles      = []
      mountPoints           = []
      volumesFrom           = []
      secrets               = []
      dnsServers            = []
      dnsSearchDomains      = []
      extraHosts            = []
      dockerSecurityOptions = []
      dockerLabels          = {}
      ulimits               = []
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/aws/ecs/${aws_ecs_cluster.cluster.name}"
          awslogs-create-group  = "true"
          awslogs-region        = var.logs_region
          awslogs-stream-prefix = "core"
        },
        secretOptions = []
      }
      systemControls  = []
      credentialSpecs = []
      # healthCheck = {
      #   retries = 3
      #   command = [
      #     "CMD-SHELL",
      #     "curl -f http://localhost/_health || exit 1"
      #   ],
      #   timeout     = 5
      #   interval    = 60
      #   startPeriod = null
      # }
    }
  ])
  # The task execution role grants the Amazon ECS container and Fargate agents permission to make AWS API calls on your behalf.
  execution_role_arn = var.ecs_task_execution_role_arn
  # This role allows your application code (on the container) to use other AWS services
  task_role_arn = var.ecs_task_container_role_arn
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
  ephemeral_storage {
    size_in_gib = 21
  }
  tags = {
    Environment = var.environment_name
    SystemName  = "plat"
    ProductName = "plat-fellowship"
    Service     = "nillion"
  }
}
