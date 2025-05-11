namespace SwiftTask.Backend.Models
{
    public class Task
    {
        public Task(string description, Topic topic)
        {
            Description = description;
            Topic = topic;
            TopicId = topic.Id;
            IsDone = false;
        }
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public Task() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

        public int Id { get; private set; }
        public string Description { get; set; }
        public int TopicId { get; set; }
        public virtual Topic Topic { get; set; }

        public bool IsDone { get; set; } = false;
    }
}
