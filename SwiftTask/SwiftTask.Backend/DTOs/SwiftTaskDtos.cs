using System.ComponentModel.DataAnnotations;

namespace SwiftTask.Backend.DTOs
{
    public record TopicDto
    {
        public int Id { get; init; }
        public string Name { get; init; }
        public List<TaskDto> Tasks { get; init; }
    }
    public record TaskDto
    {
        public int Id { get; init; }
        public string Description { get; init; }
        public bool IsDone { get; init; }
        public string TopicName { get; init; } = string.Empty;
    }

    public record SwiftTaskUserDto
    {
        public int Id { get; init; }
        public string Name { get; init; }
        public string Email { get; init; }
        public List<TopicDto> Topics { get; init; }
    }

    public record CreateTaskDto(
    string Description,
    string TopicName
);
    }

