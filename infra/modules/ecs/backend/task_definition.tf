# task definition for repo api
resource "aws_ecs_task_definition" "core" {
  family                   = aws_ecs_cluster.cluster.name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 1024
  memory                   = 2048
  container_definitions = jsonencode([
    {
      name  = "plat-fellowship-backend-${var.environment_name}"
      image = "${var.ecr_uri}:latest"
      links = []
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      essential  = true
      entryPoint = []
      command    = []
      environment = [
        {
          "name" : "HOST",
          "value" : "0.0.0.0"
        },
        {
          "name" : "PORT",
          "value" : "80"
        },
        {
          "name" : "NODE_ENV",
          "value" : "development"
        }
      ]
      environmentFiles = []
      mountPoints      = []
      volumesFrom      = []
      secrets = [
        {
          name      = "APP_KEYS",
          valueFrom = "${var.secret_arn}:appKeys::"
        },
        {
          name      = "API_TOKEN_SALT",
          valueFrom = "${var.secret_arn}:apiTokenSalt::"
        },
        {
          name      = "ADMIN_JWT_SECRET",
          valueFrom = "${var.secret_arn}:adminJwtSecret::"
        },
        {
          name      = "TRANSFER_TOKEN_SALT",
          valueFrom = "${var.secret_arn}:transferTokenSalt::"
        },
        {
          name      = "DATABASE_CLIENT",
          valueFrom = "${var.secret_arn}:databaseClient::"
        },
        {
          name      = "DATABASE_HOST",
          valueFrom = "${var.secret_arn}:databaseHost::"
        },
        {
          name      = "DATABASE_PORT",
          valueFrom = "${var.secret_arn}:databasePort::"
        },
        {
          name      = "DATABASE_NAME",
          valueFrom = "${var.secret_arn}:databaseName::"
        },
        {
          name      = "DATABASE_USERNAME",
          valueFrom = "${var.secret_arn}:databaseUsername::"
        },
        {
          name      = "DATABASE_PASSWORD",
          valueFrom = "${var.secret_arn}:databasePassword::"
        },
        {
          name      = "DATABASE_SSL",
          valueFrom = "${var.secret_arn}:databaseSSL::"
        },
        {
          name      = "JWT_SECRET",
          valueFrom = "${var.secret_arn}:jwtSecret::"
        }
      ]
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
  }
}
