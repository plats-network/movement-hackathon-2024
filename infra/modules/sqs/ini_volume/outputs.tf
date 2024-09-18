output "aws_sqs_queue_arn" {
  value = aws_sqs_queue.queue.arn
}

output "aws_sqs_queue_url" {
  value = aws_sqs_queue.queue.url
}
