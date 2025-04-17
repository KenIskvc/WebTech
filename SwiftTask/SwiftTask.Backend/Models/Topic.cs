namespace SwiftTask.Backend.Models
{
    public class Topic
    {
        public Topic(string name)
        {
            Name = name;
        }

#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public Topic() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

        public int Id { get; private set; }
        public string Name { get; set; }
        public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
        public string SwiftTaskUserId { get; set; }
        public virtual SwiftTaskUser User { get; set; }

    }
}
