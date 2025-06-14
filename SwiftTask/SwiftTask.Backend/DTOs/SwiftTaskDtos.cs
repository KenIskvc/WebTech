﻿namespace SwiftTask.Backend.DTOs
{
    public record TopicDto
    {
        public int Id { get; init; }
        public string Name { get; init; }
        public List<TaskDto> Tasks { get; init; }
             
    }
    public record TopicCreateDto
    {
        public string Name { get; init; }
        public string UserId { get; init; }
    }
    public record TaskDto
    {
        public int Id { get; init; }
        public string Description { get; init; }
        public DateTime DueDate { get; init; }
        public bool IsDone { get; init; }
        public string TopicName { get; init; }
    }

    public record SwiftTaskUserDto
    {
        public int Id { get; init; }
        public string Name { get; init; }
        public string Email { get; init; }
        public List<TopicDto> Topics { get; init; } 
    }
}
