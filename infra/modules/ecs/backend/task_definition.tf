# task definition for repo api
resource "aws_ecs_task_definition" "core" {
  family                   = aws_ecs_cluster.cluster.name
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  container_definitions = jsonencode([
    {
      name  = "plat-fellowship-${var.environment_name}-backend"
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
          "name" : "MODE",
          "value" : "local"
        },
        {
          "name" : "HOST",
          "value" : "0.0.0.0"
        },
        {
          "name" : "PORT",
          "value" : "80"
        },
        {
          "name" : "RELOAD",
          "value" : "False"
        },
        {
          "name" : "MONGO_DB",
          "value" : "plat"
        },
        {
          "name" : "MONGO_USER_COLLECTION",
          "value" : "users"
        },
        {
          "name" : "ALGORITHM",
          "value" : "HS256"
        },
        {
          "name" : "ACCESS_TOKEN_EXPIRE_MINUTES",
          "value" : "60"
        }
      ]
      environmentFiles = []
      mountPoints      = []
      volumesFrom      = []
      secrets = [
        {
          name      = "MONGO_HOST",
          valueFrom = "${var.secret_arn}:mongoHost::"
        },
        {
          name      = "MONGO_PORT",
          valueFrom = "${var.secret_arn}:mongoPort::"
        },
        {
          name      = "MONGO_USER",
          valueFrom = "${var.secret_arn}:mongoUser::"
        },
        {
          name      = "MONGO_PASSWORD",
          valueFrom = "${var.secret_arn}:mongoPassword::"
        },
        {
          name      = "MONGO_URI",
          valueFrom = "${var.secret_arn}:mongoUri::"
        },
        {
          name      = "REDIS_HOST",
          valueFrom = "${var.secret_arn}:redisHost::"
        },
        {
          name      = "REDIS_PORT",
          valueFrom = "${var.secret_arn}:redisPort::"
        },
        {
          name      = "REDIS_PASSWORD",
          valueFrom = "${var.secret_arn}:redisPassword::"
        },
        {
          name      = "REDIS_BROKER_URL",
          valueFrom = "${var.secret_arn}:redisBrokerUrl::"
        },
        {
          name      = "SECRET_KEY",
          valueFrom = "${var.secret_arn}:secretKey::"
        },
        {
          name      = "NILLION_CLUSTER_ID",
          valueFrom = "${var.secret_arn}:nillionClusterId::"
        },
        {
          name      = "NILLION_BOOTNODE_MULTIADDRESS",
          valueFrom = "${var.secret_arn}:nillionBootnodeMultiaddress::"
        },
        {
          name      = "NILLION_BOOTNODE_WEBSOCKET",
          valueFrom = "${var.secret_arn}:nillionBootnodeWebsocket::"
        },
        {
          name      = "NILLION_SEED",
          valueFrom = "${var.secret_arn}:nillionSeed::"
        },
        {
          name      = "NILLION_NILCHAIN_CHAIN_ID",
          valueFrom = "${var.secret_arn}:nillionNilchainChainId::"
        },
        {
          name      = "NILLION_NILCHAIN_JSON_RPC",
          valueFrom = "${var.secret_arn}:nillionNilchainJsonRpc::"
        },
        {
          name      = "NILLION_NILCHAIN_REST_API",
          valueFrom = "${var.secret_arn}:nillionNilchainRestApi::"
        },
        {
          name      = "NILLION_NILCHAIN_GRPC",
          valueFrom = "${var.secret_arn}:nillionNilchainGrpc::"
        },
        {
          name      = "NILLION_NILCHAIN_PRIVATE_KEY_0",
          valueFrom = "${var.secret_arn}:nillionNilchainPrivateKey0::"
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
    Service     = "backend"
  }
}
